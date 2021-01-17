import { Router, Request, Response } from "express";
import passport from "passport";

import { validateVideo, checkVideoOwner } from "./video.validate";
import { errorHandler } from "../../libs/errorHandler";
import {
  saveVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  updateVideo,
} from "./video.controller";
import logger from "../../../utils/logger";
import VideoError from "./video.error";

const videoRouter = Router();
const jwtAuth = passport.authenticate("jwt", { session: false });

videoRouter.post(
  "/add",
  [jwtAuth, validateVideo],
  errorHandler(async (req: Request, res: Response) => {
    const video= await saveVideo(
      req.body.title,
      req.body.url,
      req.body.description,
      req.user?.username
    );
    if (!video.rows) {
      logger.warn(`Error to add a new video.`);
      throw new VideoError("Error to add a new video.", "Error add video");
    }
    logger.info(
      `User with username:${req.user?.username} save a video ${video.rows[0]}`
    );
    return res.status(201).json({
      video:video.rows[0],
    });
  })
);

videoRouter.get(
  "/",
  errorHandler(async (req: Request, res: Response) => {
    const videos = await getAllVideos();
    if (videos.rows.length>0) {
      logger.info(`User get all videos ${videos}`);
      return res.status(200).json({
        videos:videos.rows,
      });
    }
    logger.info("Not videos in database");
    throw new VideoError("User not ha a videos yet", "Not Videos");
  })
);

videoRouter.get(
  "/:id",
  [jwtAuth, checkVideoOwner],
  errorHandler(async (req: Request, res: Response) => {
    const video= await getVideoById(req.params.id, req.user?.username);
    if (video.rows.length>0) {
      return res.status(200).json({
        video:video.rows[0],
      });
    }
  })
);

videoRouter.delete(
  "/:id",
  [jwtAuth, checkVideoOwner],
  errorHandler(async (req: Request, res: Response) => {
    const video = await deleteVideo(req.params.id);
    logger.info(
      `User with id: ${req.user?._id} try to delet video with id:${req.params.id}`
    );
    res.status(200).json({
      video:video.rows[0],
    });
  })
);

videoRouter.put(
  "/:id",
  [jwtAuth, checkVideoOwner],
  errorHandler(async (req: Request, res: Response) => {
    console.log(req.body.title, req.body.url, req.body.description);
    const video = await updateVideo(
      req.params.id,
      req.body.title,
      req.body.url,
      req.body.description
    );
    logger.info(
      `User with id: ${req.user?._id} try to update video with id:${req.params.id}`
    );
    res.status(200).json({
      video: video.rows[0],
    });
  })
);
export default videoRouter;
