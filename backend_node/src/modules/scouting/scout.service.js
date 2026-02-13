import { playerModel } from "../../DB/models/playerModel.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBservice from '../../DB/db.services.js';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5000';


export const getConfig = asyncHandler(
    async (req, res, next) => {
        const response = await fetch(`${FLASK_API_URL}/api/config`);

        if (!response.ok) {
            return next(new Error("Failed to connect to AI service", { cause: 503 }));
        }

        const config = await response.json();
        return successResponse({ res, data: { config } });
    }
);

/**
 * AI Scout Search
 */
export const scoutSearch = asyncHandler(
    async (req, res, next) => {
        const { role, budget, max_age, weights } = req.body;

        const response = await fetch(`${FLASK_API_URL}/api/scout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: role || 'All',
                budget: budget || 100,
                max_age: max_age || 40,
                weights: weights || {}
            })
        });

        if (!response.ok) {
            return next(new Error("AI search failed", { cause: 503 }));
        }

        const players = await response.json();
        return successResponse({ res, data: { players, count: players.length } });
    }
);

/**
 * Find similar players (clones)
 */
export const findClones = asyncHandler(
    async (req, res, next) => {
        const { name } = req.query;

        if (!name) {
            return next(new Error("Player name is required", { cause: 400 }));
        }

        const response = await fetch(
            `${FLASK_API_URL}/api/clone?name=${encodeURIComponent(name)}`
        );

        if (!response.ok) {
            return next(new Error("Failed to find similar players", { cause: 503 }));
        }

        const data = await response.json();

        if (data.error) {
            return next(new Error(data.error, { cause: 404 }));
        }

        return successResponse({ res, data: { players: data } });
    }
);

/**
 * Add player to my list
 */
export const addPlayer = asyncHandler(
    async (req, res, next) => {
        const { name, squad, notes, isFavorite, rating } = req.body;
        const userId = req.user._id;

        if (!name || !squad) {
            return next(new Error("Player name and squad are required", { cause: 400 }));
        }

        // Check if already exists
        const exists = await DBservice.exists({
            model: playerModel,
            filter: { name, squad, addedBy: userId }
        });

        if (exists) {
            return next(new Error("Player already in your list", { cause: 409 }));
        }

        // Get player data from Flask by searching
        const searchResponse = await fetch(`${FLASK_API_URL}/api/scout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'All',
                budget: 500,
                max_age: 50,
                weights: {}
            })
        });

        if (!searchResponse.ok) {
            return next(new Error("Failed to fetch player data", { cause: 503 }));
        }

        const allPlayers = await searchResponse.json();
        const playerData = allPlayers.find(p =>
            p.Player === name && p.Squad === squad
        );

        if (!playerData) {
            return next(new Error("Player not found in scouting database", { cause: 404 }));
        }

        // Create player
        const [player] = await DBservice.create({
            model: playerModel,
            data: [{
                name: playerData.Player,
                squad: playerData.Squad,
                position: playerData.Pos?.includes('DF') ? 'DF' :
                    playerData.Pos?.includes('MF') ? 'MF' :
                        playerData.Pos?.includes('FW') ? 'FW' : 'GK',
                age: playerData.Age,
                nationality: playerData.Nation,
                minutes: playerData.Min,
                nineties: playerData['90s'],
                goals: playerData.Gls,
                assists: playerData.Ast,
                npxG: playerData.npxG,
                marketValue: playerData.market_value_in_eur,
                scoutScore: playerData.Scout_Score,
                fairValue: playerData.Fair_Value,
                undervaluedIndex: playerData.Undervalued_Index,
                fullStats: playerData,
                addedBy: userId,
                notes,
                isFavorite: isFavorite || false,
                rating,
                lastSyncedAt: Date.now()
            }]
        });

        return successResponse({ res, status: 201, data: { player } });
    }
);

/**
 * Get my players
 */
export const getMyPlayers = asyncHandler(
    async (req, res, next) => {
        const userId = req.user._id;
        const { position, isFavorite, sort = '-createdAt' } = req.query;

        const filter = { addedBy: userId };

        if (position) {
            filter.position = position;
        }

        if (isFavorite !== undefined) {
            filter.isFavorite = isFavorite === 'true';
        }

        const players = await DBservice.find({
            model: playerModel,
            filter,
            sort: { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 }
        });

        return successResponse({ res, data: { players, count: players.length } });
    }
);

/**
 * Update player
 */
export const updatePlayer = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const userId = req.user._id;
        const { notes, isFavorite, rating } = req.body;

        const player = await DBservice.findByIdAndUpdate({
            model: playerModel,
            id,
            data: {
                ...(notes !== undefined && { notes }),
                ...(isFavorite !== undefined && { isFavorite }),
                ...(rating !== undefined && { rating })
            }
        });

        if (!player || player.addedBy.toString() !== userId.toString()) {
            return next(new Error("Player not found", { cause: 404 }));
        }

        return successResponse({ res, data: { player } });
    }
);

/**
 * Delete player
 */
export const deletePlayer = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const userId = req.user._id;

        const player = await DBservice.findById({
            model: playerModel,
            id
        });

        if (!player || player.addedBy.toString() !== userId.toString()) {
            return next(new Error("Player not found", { cause: 404 }));
        }

        await DBservice.deleteOne({
            model: playerModel,
            filter: { _id: id }
        });

        return successResponse({ res, message: "Player deleted successfully" });
    }
);

/**
 * Sync player data from Flask
 */
export const syncPlayer = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const userId = req.user._id;

        const player = await DBservice.findById({
            model: playerModel,
            id
        });

        if (!player || player.addedBy.toString() !== userId.toString()) {
            return next(new Error("Player not found", { cause: 404 }));
        }

        // Get fresh data from Flask
        const searchResponse = await fetch(`${FLASK_API_URL}/api/scout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'All',
                budget: 500,
                max_age: 50,
                weights: {}
            })
        });

        if (!searchResponse.ok) {
            return next(new Error("Failed to sync player data", { cause: 503 }));
        }

        const allPlayers = await searchResponse.json();
        const freshData = allPlayers.find(p =>
            p.Player === player.name && p.Squad === player.squad
        );

        if (!freshData) {
            return next(new Error("Player not found in latest data", { cause: 404 }));
        }

        // Update player
        const updated = await DBservice.findByIdAndUpdate({
            model: playerModel,
            id,
            data: {
                age: freshData.Age,
                minutes: freshData.Min,
                nineties: freshData['90s'],
                goals: freshData.Gls,
                assists: freshData.Ast,
                npxG: freshData.npxG,
                marketValue: freshData.market_value_in_eur,
                scoutScore: freshData.Scout_Score,
                fairValue: freshData.Fair_Value,
                undervaluedIndex: freshData.Undervalued_Index,
                fullStats: freshData,
                lastSyncedAt: Date.now()
            }
        });

        return successResponse({ res, data: { player: updated } });
    }
);