import Case from '../models/case.model';

const generateCaseId = async (num: number) => {
  if (num < 1) {
    console.error('Number of digit must at least one');
    return;
  }

  let id;

  const min = Math.pow(10, num - 1);
  const max = Math.pow(10, num) - 1;

  let isUnique = false;

  while (!isUnique) {
    const uniqueId = Math.floor(min + Math.random() * (max - min + 1));

    id = `XYX-${uniqueId}`;

    const checkCaseNoExistence = await Case.findOne({ case_number: id });
    if (!checkCaseNoExistence) {
      isUnique = true;
    }
  }

  return id;
};

export { generateCaseId };
