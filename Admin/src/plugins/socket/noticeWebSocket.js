import store from "@/store";
import { _playAudio } from "@/plugins/audio/index.js";

export default class NoticeWebSocket {
  /**
   * 心跳定时器
   */
  heartbeatTimer = null;
  url = "";
  /**
   * 用户id
   */
  userId = "";
  /**
   * 等待发送列表
   */
  waitSendList = [];
  /**
   * socket 实例
   */
  ws = null;
  // 已连接状态码
  WS_READY_STATE_OPEN = 1;
  /**
   * 重连计数器
   */
  reconnectCount = 0;
  /**
   * 最大重连次数
   */
  maxReconnectCount = 10;

  constructor(userId) {
    // 处理 WebSocket 基础地址，增加容错
    let baseUrl;
    if (window.__config && __config._BASE_WSS) {
      baseUrl = __config._BASE_WSS;
    } else {
      baseUrl = "wss://"; // 替换为实际默认地址
      console.warn("未配置 __config._BASE_WSS，使用默认 WebSocket 地址");
    }
    this.userId = userId;
    this.url = `${baseUrl}/webSocket/notice/${this.userId}/${+new Date()}`;
    this.init();
  }

  init() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
    this.ws.onerror = this.onError;
  }

  /**
   * 发送消息
   */
  send = (data) => {
    try {
      // 统一转换为字符串
      let sendData = typeof data === "string" ? data : JSON.stringify(data);
      if (!sendData) return;

      const isWsReady = this.ws?.readyState === this.WS_READY_STATE_OPEN;
      if (isWsReady) {
        this.ws.send(sendData);
        // 精确匹配移除等待列表
        this.waitSendList = this.waitSendList.filter(elem => elem !== sendData);
      } else {
        // 避免重复添加
        if (!this.waitSendList.includes(sendData)) {
          this.waitSendList.push(sendData);
        }
      }
    } catch (error) {
      console.error("发送消息失败", error);
    }
  };

  /**
   * 连接成功回调
   */
  onOpen = () => {
    this.reconnectCount = 0; // 重置重连计数器
    console.log("WebSocket 连接成功");
    // 发送第一个心跳
    this.send({ message: "ping" });
    // 启动定时心跳
    this.startHeartbeat();
    // 发送等待列表中的消息
    this.waitSendList.forEach((text) => this.send(text));
  };

  /**
   * 启动心跳（客户端主动定时发送）
   */
  startHeartbeat = () => {
    // 清除旧的定时器
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    // 每 30 秒发送一次心跳
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === this.WS_READY_STATE_OPEN) {
        this.send({ message: "ping" });
      }
    }, 30 * 1000);
  };

  /**
   * 消息接收回调
   */
  onMessage = (e) => {
    try {
      let data = JSON.parse(e.data);
      // 处理服务器返回的 pong
      if (data.message === "pong") {
        console.log("收到服务器 pong，连接正常");
        return;
      }
      // 处理业务消息
      console.log("subscribeNotice", data);

      if (data?.verified >= 0) {
        store.commit("SET_VERIFIEDNUM", data.verified);
        if (data?.verified) {
          let src = localStorage.getItem("notice3");
          src && _playAudio.play({ src });
        }
      }
      if (data?.recharge >= 0) {
        store.commit("SET_RECHARGENUM", data.recharge);
        if (data?.recharge) {
          let src = localStorage.getItem("notice1");
          src && _playAudio.play({ src });
        }
      }
      if (data?.withdraw) {
        store.commit("SET_WITHDRAWNUM", data.withdraw);
        if (data?.withdraw) {
          let src = localStorage.getItem("notice2");
          src && _playAudio.play({ src });
        }
      }
    } catch (error) {
      console.error("解析 WebSocket 消息失败", error, e.data);
    }
  };

  /**
   * 主动关闭连接
   */
  close = () => {
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.ws?.close();
  };

  /**
   * 连接错误回调
   */
  onError = () => {
    console.error("WebSocket 连接错误");
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.reconnect();
  };

  /**
   * 连接关闭回调
   */
  onClose = () => {
    console.log("WebSocket 连接关闭");
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.reconnect();
  };

  /**
   * 重连机制（带退避策略）
   */
  reconnect = () => {
    if (this.reconnectCount >= this.maxReconnectCount) {
      console.error(`已超过最大重连次数(${this.maxReconnectCount})，请检查网络`);
      return;
    }
    // 退避策略：间隔 1s → 2s → 4s... 最多 10s
    const delay = Math.min(1000 * Math.pow(2, this.reconnectCount), 10000);
    this.reconnectCount++;
    setTimeout(() => {
      console.log(`第 ${this.reconnectCount} 次重连（延迟 ${delay}ms）...`);
      // 清理旧连接
      if (this.ws) {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.close();
      }
      this.init();
    }, delay);
  };
}
