import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

export const generateRefreshString = () => {
  return crypto.randomBytes(40).toString("hex");
};
