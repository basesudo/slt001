import request from "@/utils/request";

/**
 * xxxxxxxxx
 */
export const saveRobotKdata = (params) =>
  request({
    url: "/bussiness/saveRobotKdata",
    method: "post",
    params: params,
  });

/**
 * xxxxxxxxx
 */
export const getRobotKdataList = (params) =>
  request({
    url: "/bussiness/getRobotKdataList",
    method: "post",
    params: params,
  });

/**
 * xxxxxxxxx
 */
export const getCustomCoinPairList = (params) =>
  request({
    url: "/bussiness/getCustomCoinPairList",
    method: "post",
    params: params,
  });

/**
 * xxxxxxxxx
 */
export const saveRobotKdataFlow = (params) =>
  request({
    url: "/bussiness/saveRobotKdataFlow",
    method: "post",
    params: params,
  });

/**
 * xxxxxxxxx
 */
export const getRobotConfig = (params) =>
  request({
    url: "/bussiness/getRobotConfig",
    method: "post",
    params: params,
  });
