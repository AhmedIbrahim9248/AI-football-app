import { Router } from 'express';
import * as scoutingServices from './scout.service.js';
import { authentication, authorization } from '../../middleWares/auth.middleware.js';
import { roleEnum } from '../../DB/models/userModel.js';

const router = Router();

// Public Routes 
// Get AI config (presets, labels, features)
router.get('/config', scoutingServices.getConfig);

router.post(
    '/search',
    authentication(),
    scoutingServices.scoutSearch
);

// Find similar players
router.get(
    '/clones',
    authentication(),
    scoutingServices.findClones
);

// Coach Only Routes
// Add player to my list
router.post(
    '/players',
    authentication(),
    authorization({ accessRoles: [roleEnum.coatch] }),
    scoutingServices.addPlayer
);

// Get my players
router.get(
    '/players',
    authentication(),
    authorization({ accessRoles: [roleEnum.coatch] }),
    scoutingServices.getMyPlayers
);

// Update player
router.patch(
    '/players/:id',
    authentication(),
    authorization({ accessRoles: [roleEnum.coatch] }),
    scoutingServices.updatePlayer
);

// Delete player
router.delete(
    '/players/:id',
    authentication(),
    authorization({ accessRoles: [roleEnum.coatch] }),
    scoutingServices.deletePlayer
);

// Sync player data
router.post(
    '/players/:id/sync',
    authentication(),
    authorization({ accessRoles: [roleEnum.coatch] }),
    scoutingServices.syncPlayer
);

export default router;