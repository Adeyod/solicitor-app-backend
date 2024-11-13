import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmailType } from '../constants/types';

require('dotenv').config();

// const getMailTemplate = (filePath: string, data: {}) => {
//   const templatePath = path.join(__dirname, './templates', filePath);
//   const template = fs.readFileSync(templatePath, 'utf8');
//   return ejs.render(template, data);
// };

// const getMailTemplate = (filePath: string, data: {}) => {
//   // Adjust the path according to your directory structure
//   const templatePath = path.join(
//     __dirname,
//     '..',
//     'utils',
//     'templates',
//     filePath
//   );
//   console.log('Resolved template path:', templatePath);

//   if (!fs.existsSync(templatePath)) {
//     throw new Error(`Template file not found: ${templatePath}`);
//   }

//   const template = fs.readFileSync(templatePath, 'utf8');
//   return ejs.render(template, data);
// };

const getMailTemplate = (filePath: string, data: {}) => {
  const templatePath = path.resolve(
    __dirname,
    '..',
    'utils',
    'templates',
    filePath
  );

  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found at ${templatePath}`);
    throw new Error('Template file not found!');
  }

  console.log('Resolved template path:', templatePath);
  const template = fs.readFileSync(templatePath, 'utf8');
  console.log('THE TEMPLATE:', template);
  return ejs.render(template, data);
};

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: process.env.NODEMAILER_SECURE,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
} as SMTPTransport.Options);

const sendEmailVerification = async ({
  email,
  first_name,
  link,
}: EmailType) => {
  try {
    // const emailVerificationContent = getMailTemplate('emailTemplate.ejs', {
    //   first_name,
    //   link,
    // });
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: 'Email verification',
      // html: emailVerificationContent,

      html: `${first_name}, please verify your email by clicking this link ${link}
      `,
    });

    return info;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

const sendPasswordReset = async ({ first_name, email, link }: EmailType) => {
  try {
    const passwordResetContent = getMailTemplate('resetPasswordTemplate.ejs', {
      first_name,
      link,
    });

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: 'Password reset',
      html: passwordResetContent,
    });

    return info;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { sendEmailVerification, sendPasswordReset };
