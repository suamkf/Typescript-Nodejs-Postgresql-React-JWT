import { pool } from "../../libs/database";
import { config } from "../../../config/index";

export const  createVideoTable = async ()=>{
  await pool.query(`CREATE TABLE ${config.dataBase.videoTableName} (
    _id SERIAL PRIMARY KEY,
    title TEXT, NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL
    state BOOLEAN NOT NULL DEFAULT true,
    owner TEXT NOT NULL
    created_at TIMESTAMP NOT NULL
);`)
};

export const  createVideoPersistTable = async ()=>{
  await pool.query(`CREATE TABLE ${config.dataBase.videoTablePersistChangesName} (
    _id SERIAL PRIMARY KEY,
    title TEXT, NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL
    state BOOLEAN NOT NULL DEFAULT true,
    owner TEXT NOT NULL
    created_at TIMESTAMP NOT NULL
    videoId TEXT NOT NULL
);`)
};
