import express from 'express';
import {
  getApplicationsByRecruitment,
  updateApplicationStatus,
} from '../controllers/applicationController';
import verifyAdminToken from '../middleware/verifyAdminToken';

const router = express.Router();

router.get('/:recruitmentId/get', verifyAdminToken, getApplicationsByRecruitment);
router.put('/:applicationId/status', verifyAdminToken, updateApplicationStatus)

export default router;