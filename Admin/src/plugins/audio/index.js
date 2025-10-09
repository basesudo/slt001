import PlayAudio from "./playAudio.js";

export let _playAudio = null;
/**
 * 初始化
 */
export const _initPlayAudio = () => {
  _playAudio = new PlayAudio();
};
