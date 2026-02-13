import mongoose from "mongoose";

export const positionEnum = { 
    GK: "GK", 
    DF: "DF", 
    MF: "MF", 
    FW: "FW" 
};

export const playerSchema = new mongoose.Schema({
    // Basic Info
    name: {
        type: String,
        required: true,
        trim: true
    },
    squad: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        enum: { values: Object.values(positionEnum) },
        required: true
    },
    
    // Personal Info
    age: {
        type: Number,
        min: [16, "minimum age is 16"],
        max: [45, "maximum age is 45"]
    },
    nationality: {
        type: String,
        trim: true
    },
    
    // Statistics
    minutes: {
        type: Number,
        default: 0
    },
    nineties: {
        type: Number,
        default: 0
    },
    goals: {
        type: Number,
        default: 0
    },
    assists: {
        type: Number,
        default: 0
    },
    npxG: {
        type: Number,
        default: 0
    },
    marketValue: {
        type: Number,
        default: 0
    },
    
    // AI Scores
    scoutScore: {
        type: Number,
        default: 0
    },
    fairValue: {
        type: Number,
        default: 0
    },
    undervaluedIndex: {
        type: Number,
        default: 0
    },
    
    // Full Stats JSON
    fullStats: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    
    // User Relation
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    
    // User Data
    notes: {
        type: String,
        maxLength: [500, "maximum notes length is 500 chars"]
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: [1, "minimum rating is 1"],
        max: [10, "maximum rating is 10"]
    },
    
    lastSyncedAt: Date
    
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

playerSchema.virtual('displayName').get(function() {
    return `${this.name} (${this.squad})`;
});

export const playerModel = 
    mongoose.models.player || mongoose.model("player", playerSchema);

playerModel.syncIndexes();