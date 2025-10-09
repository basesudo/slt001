// 默认配置
const getMainDomain = (url = location.host) => {
  const parts = url.split(".");
  if (parts.length >= 2) {
    url = parts.slice(-2).join(".");
  }
  return url;
};
/**
 * 加载配置
 */
export const loadAppConfig = () => {
  window.__config = {
    _BASE_API:
      process.env.VUE_APP_BASE_API || `https://demoadminapi.blockexio.com`,
    _BASE_WSS:
      process.env.VUE_APP_BASE_WSS || `wss://demoadminapi.blockexio.com`,
  };

  for (const key in process.env) {
    if (
      Object.hasOwnProperty.call(process.env, key) &&
      key.indexOf("VUE") > -1
    ) {
      let tempKey = key.replace("VUE", "");
      window.__config[tempKey] = process.env[key];
    }
  }
  window.__config = __config;
  console.log(window.__config);
  if (__config._USER_NODE_ENV == "production") {
    Object.freeze(window.__config);
    Object.defineProperty(window, "__config", {
      configurable: false,
      writable: false,
      enumerable: false,
    });
  }
};
loadAppConfig();
