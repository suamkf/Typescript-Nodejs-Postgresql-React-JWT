import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "../../../config/index";
import logger from "../../../utils/logger";
import { pool } from "../../libs/database";

function hashPassword(password: string) {
  logger.info("Hasing passwrod");
  const hashedPassword: string = bcrypt.hashSync(
    password,
    parseInt(config.bcrypt.saltOrRouds)
  );
  return hashedPassword;
}
function getTimeStampo() {
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}
export const getUserByUsernameAndEmail = (
  username: string | undefined,
  email: string | undefined
) => {
  return pool.query(
    `SELECT * FROM ${config.dataBase.userTablenName} WHERE email = $1   AND username = $2`,
    [email, username]
  );
  //return pool.query('SELECT * FROM users ORDER BY id ASC');
};

export const saveUser = (username: string, email: string, password: string) => {
  return pool.query(
    `INSERT INTO ${config.dataBase.userTablenName} (email, password,username,created_at)
  VALUES ($1, $2,$3,$4);
`,
    [email, hashPassword(password), username, getTimeStampo()]
  );
};

export const hideCriticalInformation = (user: any) => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    created_at: user.created_at,
  };
};

export const createToken = (_id: string) => {
  logger.info("Creating token");
  const token = jwt.sign({ _id }, config.jwt.secretOrKey, {
    expiresIn: config.jwt.expiresIn,
  });
  logger.info(`token created successfully ${token}`);
  return token;
};

export const getUserById = (_id: string | undefined) => {
  return pool.query(
    `Select * FROM ${config.dataBase.userTablenName} WHERE _id = $1`,
    [_id]
  );
};

export const validatePassword = (user: any, password: string) => {
  logger.info("Compare password with database");
  return bcrypt.compareSync(password, user.password);
};
