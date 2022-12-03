import NodeMailer from 'nodemailer'
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: __dirname + '/../.env'})
const user_mail=process.env.USER_EMAIL

var transport = NodeMailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: user_mail,
    pass: process.env.API_PASSWORD
  }
});

const sendConfirmationEmail = (name, email, confirmationCode) => {
  transport.sendMail({
      from: user_mail,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:8080/activation/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
  };

const sendChangePasswordName = (email, new_password) => {
  transport.sendMail({
      from: user_mail,
      to: email,
      subject: "Your Password has been Changed!",
      html: `<h1>New Password</h1>
          <h2>New Password</h2>
          <p>Thank you for reaching out. Your password has been changed to the next password: ${new_password}</p>
          </div>`,
    }).catch(err => console.log(err));
  };

export {sendChangePasswordName, sendConfirmationEmail}