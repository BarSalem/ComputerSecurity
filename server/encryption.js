import * as crypto from "crypto"
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: __dirname + '/../.env'})

const secret=process.env.HASH_SECRET

const hashPassword = (password) => {
    return crypto.createHmac(process.env.HASH_TYPE, secret).update(password).digest('hex')
}

const verifyPasswordMatchToHash = (password, hashed_password) => {
    return hashPassword(password)==hashed_password
}

const generateRandomString = (password, hashed_password) => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
    }
    return token
}

export {hashPassword, verifyPasswordMatchToHash, generateRandomString}
