import Joi from "joi";
import { RequestHandler } from "express";

import logger from "../../../utils/logger";
import { getVideoById } from "./video.controller";
import VideoError from "./video.error";

const bluePrintVideo = Joi.object().keys({
  title: Joi.string().min(5).max(250).required(),
  url: Joi.string().required(),
  description: Joi.string().max(500).required(),
});

export const validateVideo: RequestHandler = (req, res, next) => {
  const videoValidated = bluePrintVideo.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (videoValidated.error != undefined) {
    const errors = videoValidated.error.details.reduce((acumulator, error) => {
      return acumulator + error.message;
    }, "");

    const messageError = `Video validate have same errors please check and try again ${errors}`;
    logger.warn(`${messageError} user from request ${req.user}`);
    throw new VideoError(messageError, "Validation error");
  }
  if (req.body.url.includes("youtube")) {
    logger.info("Video format json is ok");
    return next();
  }

  logger.warn(`Video url is not a youtube video ${req.body.url} `);
  throw new VideoError(`only can use a youtube video.`, "Validation error");
};

export const checkVideoOwner: RequestHandler = async (req, res, next) => {
  const idVideo: string = req.params.id || "";
  const userVideo = req.user?.username;
  try {
    const video = await getVideoById(idVideo, req.user?.username);

    if (video.rows.length>0) {
      logger.info(`el video con id:${idVideo} existe`);
      if (video.rows[0].owner == userVideo) {
        logger.info(
          `Te user with id: ${userVideo} is the owner from video that want to manipulate`
        );
        return next();
      }

      logger.warn(`Video with id: ${idVideo} is not from user id:${userVideo}`);
      throw new VideoError(
        `You only can eraser and modify your own videos.`,
        "Validation error"
      );
    }
  } catch (error) {}
};
