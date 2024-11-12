import express from 'express';
import {
  createCase,
  getAllCases,
  getASingleCase,
  updateCase,
  deleteCase,
  getClientCases,
  getCasesByLawyerId,
  uploadCaseDocuments,
} from '../controllers/case.controller';
import uploadFile from '../middleware/multer';
import { verifyAccessToken } from '../middleware/jwtAuth';
import { permission } from '../middleware/authorization';

const router = express.Router();

router.use(verifyAccessToken);
router.get(
  '/single-case/:caseId',
  permission(['admin', 'lawyer']),
  getASingleCase
);
router.put('/update-case/:caseId', permission(['admin', 'lawyer']), updateCase);
router.get(
  '/get-single-client-cases/:client_id',
  permission(['admin', 'lawyer']),
  getClientCases
);
router.post(
  '/upload-case-documents/:id',
  permission(['admin', 'lawyer']),
  uploadCaseDocuments
);

router.post(
  '/create-case',
  permission(['admin']),
  uploadFile.array('files', 20),
  createCase
);
router.get('/all-cases', permission(['admin']), getAllCases);
router.delete('/delete-case/:id', permission(['admin']), deleteCase);

router.get('/get-cases-lawyer', permission(['admin']), getCasesByLawyerId);

export default router;
