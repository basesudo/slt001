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
  // 1. 使用局部变量处理配置，避免全局引用混淆
  const config = {
    // 2. 为API和WSS设置更合理的默认值（或强制要求配置，不设默认）
    _BASE_API: process.env.VUE_APP_BASE_API || "", // 空字符串避免默认路径错误
    _BASE_WSS: process.env.VUE_APP_BASE_WSS || "",  // 空字符串避免协议头错误
  };

  // 3. 精准处理VUE_APP_前缀的环境变量（仅处理VUE_APP_开头的变量）
  for (const key in process.env) {
    if (Object.hasOwnProperty.call(process.env, key) && key.startsWith("VUE_APP_")) {
      // 替换"VUE_APP_"为"_"（如VUE_APP_TEST → _TEST）
      const tempKey = key.replace("VUE_APP_", "_");
      config[tempKey] = process.env[key];
    }
  }

  // 4. 确保关键配置存在，否则报错提示
  if (!config._BASE_API) {
    console.error("请配置VUE_APP_BASE_API环境变量（API基础地址）");
  }
  if (!config._BASE_WSS) {
    console.error("请配置VUE_APP_BASE_WSS环境变量（WebSocket基础地址）");
  }

  // 5. 赋值给window.__config
  window.__config = config;

  // 6. 生产环境冻结（仅当确认环境变量正确配置后）
  if (config._USER_NODE_ENV === "production") {
    Object.freeze(window.__config);
    Object.defineProperty(window, "__config", {
      configurable: false,
      writable: false,
    });
  }

  console.log("加载配置完成：", window.__config);
};

loadAppConfig();