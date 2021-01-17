import { Pool } from 'pg';

import {config} from "../../config/index";
import {  createUserTable } from "../resurces/user/user.model"
import {createVideoPersistTable, createVideoTable } from "../resurces/video/video.model";

export const pool = new Pool({
    user: config.dataBase.userNameDB,
    host: config.dataBase.uri,
    password: process.env.DATA_BASE_PASSWORD || "",
    database: config.dataBase.dBName,
    port: config.dataBase.dbPort,
});

 createUserTable();
 createVideoPersistTable();
 createVideoTable();

