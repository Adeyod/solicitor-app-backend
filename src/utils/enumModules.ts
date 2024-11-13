const memberRole = ['client', 'worker', 'admin', 'lawyer'] as const;
const caseStatusEnum = ['Open', 'Closed', 'Pending', 'Completed'];
const appointmentPurposeEnum = ['Scheduled', 'Completed', 'Canceled'];
const caseTypeEnum = ['Civil', 'Criminal', 'Family', 'Corporate', 'Property'];
const allowedEmails = ['ayodejiadebolu@gmail.com', 'votinggivers@gmail.com'];

type MemberRole = (typeof memberRole)[number];

export {
  allowedEmails,
  MemberRole,
  caseTypeEnum,
  memberRole,
  caseStatusEnum,
  appointmentPurposeEnum,
};