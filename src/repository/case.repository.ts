import { AppError } from '../utils/app.error';
import { handleFileUpload } from '../utils/cloudinary';

const caseDocumentsUpload = async (req: any, res: any) => {
  const result = await handleFileUpload(req, res);
  if (!result) {
    throw new AppError('unable to upload documents.', 400);
  }

  console.log('uploaded successfully');
  console.log(result);

  return result;
};

export { caseDocumentsUpload };
