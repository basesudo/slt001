import NoticeWebSocket from "./noticeWebSocket.js";

export let _noticeWebSocket = null;
/**
 * 初始化
 */
export const _initNoticeWebSocket = (userId) => {
  _noticeWebSocket = new NoticeWebSocket(userId);
};

/**
 * 关闭socket
 */
export const _closeNoticeWebSocket = () => {
  _noticeWebSocket.close()
};
