import { pool } from "../../libs/database";
import logger from "../../../utils/logger";
import { config } from "../../../config/index";

declare global {
  namespace Express {
    interface User {
      username?: string;
      _id?: string;
    }
  }
}

function getTimeStampo() {
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}
export const saveVideo = async (
  title: string,
  url: string,
  description: string,
  owner: any
) => {
  logger.info(`User with id: ${owner} try to save a video: ${url}`);
  const video = await pool.query(`INSERT INTO ${config.dataBase.videoTableName} (title,url,description,owner,created_at) VALUES($1,$2,$3,$4,$5);`, [title,url,description,owner,getTimeStampo()])
  
  await pool.query(`INSERT INTO ${config.dataBase.videoTablePersistChangesName} (title,url,description,owner,created_at,videoId) VALUES($1,$2,$3,$4,$5, $6);`, [title,url,description,owner,getTimeStampo(), video.rows[0]._id])
  
  return video.rows[0];
};

export const getAllVideos = () => {
  logger.info("User geted all videos");
  return pool.query(`SELECT * FROM ${config.dataBase.userTablenName}`)
  
};

export const getVideoById = (_id: string, username: string | undefined) => {
  logger.info(`User with username:${username} want video with id:${_id}`);
  return pool.query(`SELECT * FROM ${config.dataBase.userTablenName} WHERE _id= $1; `, [_id]);
  
};
export const getUserVideos = (owner: string | undefined) => {
  return pool.query (`SELECT * FROM ${config.dataBase.videoTableName} WHERE owner = $1 AND state=$2 ORDER BY _id DESC;`, [owner, true]);
 
};

export const deleteVideo = async (_id: string | undefined) => {
  const videoDelete = await pool.query(`UPDATE  ${config.dataBase.userTablenName} SET state=$1 WHERE _id=$2`, [false,_id])
  await pool.query(`INSERT INTO ${config.dataBase.videoTablePersistChangesName} (title,url,description,owner,created_at,videoId) VALUES($1,$2,$3,$4,$5, $6);`, [videoDelete.rows[0].title,videoDelete.rows[0].url,videoDelete.rows[0].description,videoDelete.rows[0].owner,getTimeStampo(), videoDelete.rows[0]._id])
  return videoDelete.rows[0];
};
export const updateVideo = async (
  _id: string | undefined,
  _title: string | undefined,
  _url: string | undefined,
  _description: string | undefined
) => {

  const videoUpdate = await pool.query(`UPDATE ${config.dataBase.userTablenName} SET title= $1 AND url=$2 AND description=$3 WHERE _id=$4`, [_title,_url,_description])
  
  await pool.query(`INSERT INTO ${config.dataBase.videoTablePersistChangesName} (title,url,description,owner,created_at,videoId) VALUES($1,$2,$3,$4,$5, $6);`, [videoUpdate.rows[0].title,videoUpdate.rows[0].url,videoUpdate.rows[0].description,videoUpdate.rows[0].owner,getTimeStampo(), videoUpdate.rows[0]._id])
 
  return videoUpdate.rows[0];
};
