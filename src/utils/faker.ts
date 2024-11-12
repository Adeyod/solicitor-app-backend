import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { generateCaseId } from './functions';

const pass = 'Password@1234';

const hashPass = bcrypt.hashSync(pass, 10);

const generateUsers = (num: number) => {
  const users = [];

  for (let i = 0; i < num; i++) {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const user_name = faker.person.middleName();
    const email = faker.internet.email({
      firstName: first_name,
      lastName: last_name,
    });
    const password = hashPass;
    const phone_number = faker.phone.number();

    users.push({
      first_name,
      last_name,
      user_name,
      email,
      password,
      phone_number,
    });
  }

  return users;
};

const generateCases = async (num: number) => {
  const lawyers = await User.find({ role: 'lawyer' }).limit(10).exec();
  const clients = await User.find({ role: 'client' }).limit(80).exec();

  if (lawyers.length < 10 || clients.length < 80) {
    throw new Error(
      'Not enough users found (12 lawyers or 80 clients are required)'
    );
  }

  const cases = [];

  for (let i = 0; i < num; i++) {
    const case_title = faker.lorem.words(5);
    const case_type = faker.helpers.arrayElement([
      'Civil',
      'Criminal',
      'Family',
      'Corporate',
      'Property',
    ]);
    const description = faker.lorem.paragraph();

    const lawyer_in_charge = faker.helpers.arrayElement(lawyers);

    const client = faker.helpers.arrayElement(clients);

    cases.push({
      case_title,
      case_type,
      description,
      client: client._id,
      lawyer_in_charge: lawyer_in_charge._id,
      case_number: await generateCaseId(6),
    });
  }

  return cases;
};

export { generateUsers, generateCases };
