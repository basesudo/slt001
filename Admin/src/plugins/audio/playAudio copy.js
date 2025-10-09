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
      this.playList = params?.playList || [];
      this.audio = document.getElementById("audioBeep") || null;
      if (!this.audio) {
        this.audio = new Audio();
        document.body.append(this.audio);
      }
      this.audio.id = "audioBeep";
      this.audio.muted = false;
      this.audio.currentTime = 0;
      this.audio.volume = 0;
      // 添加事件监听器
      this.audio.addEventListener("play", this.audioPlay);
      this.audio.addEventListener("pause", this.audioPause);
      this.audio.addEventListener("ended", this.audioEnded);
      this.audio.addEventListener("loadedmetadata", this.audioLoadedmetadata);
      this.audio.addEventListener("error", this.audioError);

      document.addEventListener("click", this.playPermission);
      document.body.click();
    }
  }
  /**
   * 播放授权
   */
  playPermission = () => {
    document.removeEventListener("click", this.playPermission);
    // 播放音频
    this.audio.play().catch((error) => {
      console.log("playPermission", error);
      // 不支持自动播放
      this.getUserMediaPermission();
    });
    setTimeout(() => {
      this.audio.pause();
      console.info("获取完成", this.playList.length);
      if (this.playList.length) {
        // 获取授权完成，存在带播放列表 立即播放
        this.currentPlayAudio = this.playList[0];
        this.play(this.currentPlayAudio, true);
      }
    }, 100);
  };
  /**
   * 获取媒体设备权限
   */
  getUserMediaPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        // console.error("获取媒体设备权限：", stream);
      })
      .catch(function (error) {
        // 用户拒绝或浏览器不支持，您可以在这里处理错误
        // console.error("用户拒绝或浏览器不支持：", error);
      });
  };
  /**
   * 播放
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
    if (!getIsNotice()) {
      return;
    }
    console.log("音频播放", play);
    if (play) {
      if (this.audio.src != params.src) {
        this.audio.src = params.src;
      }
      this.audio.loop = params.loop || false;
      this.audio.currentTime = params.currentTime || 0;
      this.audio.volume = params.volume || 0.5;
      this.audio.play().catch((error) => {
        // console.log("play", error);
        this.getUserMediaPermission();
      });
      this.isPlay = true;
    } else {
      params.count = params.count || 1;
      params.force = params.force || false;
      if (params.src) {
        if (params.force) {
          // 强制播放
          this.resetAudio();
        }
        this.playList.push(params);
        if (!this.isPlay) {
          // 未在播放时立即播放
          this.currentPlayAudio = this.playList[0];
          this.play(this.currentPlayAudio, true);
        }
      }
    }
  };
  /**
   * 播放下一个(包含次数)
   */
  next = (flag = false) => {
    if (this.playList.length) {
      this.audio.pause();
      this.audioEnded(flag);
    }
  };

  /**
   * 重置播放器
   */
  resetAudio = () => {
    this.currentPlayAudio = null;
    this.isPlay = false;
    this.playList.length = 0;
    this.audio.pause();

    this.audio.currentTime = 0;
    this.audio.src = "";
    this.audio.loop = false;
    this.audio.src = 0;
    this.audio.volume = 0;
  };

  /**
   * 音频加载完成
   */
  audioLoadedmetadata = () => {
    // console.log("音频加载完成");
  };
  /**
   * 音频加载失败
   */
  audioError = () => {
    // console.log("音频加载失败");
    this.audioEnded();
  };

  /**
   * 音频播放中
   */
  audioPlay = () => {
    this.isPlay = true;
    // console.log("音频播放中");
  };
  /**
   * 音频暂停
   */
  audioPause = () => {
    this.isPlay = false;
    // console.log("音频暂停");
  };
  /**
   * 音频播放结束
   */
  audioEnded = (flag = false) => {
    // console.log("音频播放结束");
    if (typeof flag == "object") {
      flag = false;
    }
    this.isPlay = false;
    if (this.currentPlayAudio?.count > 0 && !this.currentPlayAudio.loop) {
      this.currentPlayAudio.count--;
    }

    if (this.playList.length) {
      if (!this.currentPlayAudio?.count || flag) {
        this.playList.shift();
      }
      this.currentPlayAudio = this.playList[0] || null;
      if (this.currentPlayAudio) {
        this.play(this.currentPlayAudio, true);
      } else {
        this.audio.src = "";
      }
    }
  };
  /**
   * 销毁
   */
  remove = () => {
    this.resetAudio();
    this.audio = null;
    document.getElementById("beep").remove();
  };
}
