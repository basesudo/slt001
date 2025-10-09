import { getIsNotice } from "@/utils/index";

export default class PlayAudio {
  /**
   * 音频实例
   */
  audio = null;
  /**
   * 当前播放实例
   */
  currentPlayAudio = null;
  /**
   * 是否在播放中
   */
  isPlay = false;
  /**
   * 播放列表
   */
  playList = [];
  /**
   * 初始化
   */
  constructor(params) {
    if (!this.audio) {
      // 尝试获取已有音频元素，不存在则创建
      this.audio = document.getElementById("audioBeep") || null;
      if (!this.audio) {
        try {
          this.audio = new Audio();
          document.body.append(this.audio);
        } catch (error) {
          console.error("创建音频实例失败：", error);
          return; // 终止初始化，避免后续 null 操作
        }
      }

      // 确保音频实例有效后再进行配置
      this.audio.id = "audioBeep";
      this.audio.muted = false;
      this.audio.currentTime = 0;
      this.audio.volume = 0;
      
      // 绑定事件监听器
      this.audio.addEventListener("play", this.audioPlay);
      this.audio.addEventListener("pause", this.audioPause);
      this.audio.addEventListener("ended", this.audioEnded);
      this.audio.addEventListener("loadedmetadata", this.audioLoadedmetadata);
      this.audio.addEventListener("error", this.audioError);

      // 处理播放授权
      document.addEventListener("click", this.playPermission);
      document.body.click();

      // 初始化播放列表
      this.playList = params?.playList || [];
    }
  }

  /**
   * 播放授权处理
   */
  playPermission = () => {
    document.removeEventListener("click", this.playPermission);
    
    // 尝试播放以获取授权
    this.audio.play().catch((error) => {
      console.log("自动播放授权失败，尝试获取媒体权限：", error);
      this.getUserMediaPermission();
    });

    // 短暂播放后暂停，完成授权流程
    setTimeout(() => {
      this.audio.pause();
      if (this.playList.length) {
        // 有等待播放列表时立即播放
        this.currentPlayAudio = this.playList[0];
        this.play(this.currentPlayAudio, true);
      }
    }, 100);
  };

  /**
   * 获取媒体设备权限（用于解决自动播放限制）
   */
  getUserMediaPermission = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          console.log("媒体设备权限获取成功");
        })
        .catch((error) => {
          console.warn("用户拒绝媒体权限或浏览器不支持：", error);
        });
    }
  };

  /**
   * 播放音频
   * @param {Object} params 播放参数
   * @param {boolean} play 是否直接播放
   */
  play = (
    params = {
      src: "",
      count: 1,
      force: false,
      loop: false,
      currentTime: 0,
      volume: 0.5,
    },
    play = false
  ) => {
    // 检查通知开关状态
    if (!getIsNotice()) {
      return;
    }

    // 校验音频源有效性
    if (!params.src || typeof params.src !== "string" || params.src.trim() === "") {
      console.error("音频播放失败：无效的音频路径", params.src);
      return;
    }

    if (play) {
      // 直接播放逻辑
      if (this.audio.src !== params.src) {
        this.audio.src = params.src;
      }
      this.audio.loop = Boolean(params.loop);
      this.audio.currentTime = Math.max(0, params.currentTime || 0);
      this.audio.volume = Math.min(1, Math.max(0, params.volume || 0.5));
      
      this.audio.play().catch((error) => {
        console.log("播放失败，尝试获取权限：", error);
        this.getUserMediaPermission();
      });
      this.isPlay = true;
    } else {
      // 加入播放队列逻辑
      params.count = Math.max(1, params.count || 1); // 确保播放次数至少为1
      params.force = Boolean(params.force);

      if (params.force) {
        // 强制播放时清空现有队列
        this.resetAudio();
      }

      this.playList.push(params);
      
      // 未在播放状态时立即播放
      if (!this.isPlay) {
        this.currentPlayAudio = this.playList[0];
        this.play(this.currentPlayAudio, true);
      }
    }
  };

  /**
   * 播放下一个音频
   * @param {boolean} flag 是否强制跳过当前
   */
  next = (flag = false) => {
    if (this.playList.length) {
      this.audio.pause();
      this.audioEnded(flag);
    }
  };

  /**
   * 重置播放器状态
   */
  resetAudio = () => {
    this.currentPlayAudio = null;
    this.isPlay = false;
    this.playList.length = 0;
    this.audio.pause();

    // 重置音频属性
    this.audio.currentTime = 0;
    this.audio.src = ""; // 清空路径，避免无效请求
    this.audio.loop = false;
    this.audio.volume = 0;
  };

  /**
   * 音频加载完成回调
   */
  audioLoadedmetadata = () => {
    console.log("音频加载完成");
  };

  /**
   * 音频加载错误回调
   */
  audioError = () => {
    console.error("音频加载失败：", this.audio.src);
    this.audioEnded(true); // 出错时强制进入下一个
  };

  /**
   * 音频开始播放回调
   */
  audioPlay = () => {
    this.isPlay = true;
    console.log("音频开始播放：", this.audio.src);
  };

  /**
   * 音频暂停回调
   */
  audioPause = () => {
    this.isPlay = false;
    console.log("音频已暂停");
  };

  /**
   * 音频播放结束回调
   * @param {boolean} flag 是否强制结束
   */
  audioEnded = (flag = false) => {
    this.isPlay = false;

    // 处理当前播放计数
    if (this.currentPlayAudio && !this.currentPlayAudio.loop) {
      this.currentPlayAudio.count = Math.max(0, (this.currentPlayAudio.count || 1) - 1);
    }

    // 处理播放队列
    if (this.playList.length) {
      // 当计数为0或强制跳过，移除当前项
      if ((this.currentPlayAudio && this.currentPlayAudio.count === 0) || flag) {
        this.playList.shift();
      }

      // 播放下一个
      this.currentPlayAudio = this.playList[0] || null;
      if (this.currentPlayAudio) {
        this.play(this.currentPlayAudio, true);
      } else {
        this.audio.src = ""; // 清空路径
      }
    }
  };

  /**
   * 销毁播放器实例
   */
  remove = () => {
    this.resetAudio();
    
    // 移除音频元素
    const audioElem = document.getElementById("audioBeep");
    if (audioElem && audioElem.parentNode) {
      audioElem.parentNode.removeChild(audioElem);
    }
    
    // 清除引用
    this.audio = null;
  };
}
