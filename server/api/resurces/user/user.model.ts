import { pool } from "../../libs/database";
import { config } from "../../../config/index";

export const  createUserTable = async ()=>{
  await pool.query(`CREATE TABLE ${config.dataBase.userTablenName} (
    _id SERIAL PRIMARY KEY,
    email TEXT, NOT NULL,
    password TEXT NOT NULL,
    username:TEXT NOT NULL
    state: BOOLEAN NOT NULL DEFAULT true,
    created_at: TIMESTAMP NOT NULL
);`)
};

