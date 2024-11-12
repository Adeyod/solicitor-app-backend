import express from 'express';
import {
  getAllClients,
  getAllWorkers,
  getAllLawyers,
  getClientDetails,
  getUserProfile,
} from '../controllers/user.controller';
import { verifyAccessToken } from '../middleware/jwtAuth';
import { permission } from '../middleware/authorization';

const router = express.Router();

router.use(verifyAccessToken);
router.use('/get-user-details', getUserProfile);
router.get('/all-clients', permission(['admin']), getAllClients);
router.get('/all-workers', permission(['admin']), getAllWorkers);
router.get('/all-lawyers', permission(['admin']), getAllLawyers);
router.get('/client/:clientId', getClientDetails);

export default router;
