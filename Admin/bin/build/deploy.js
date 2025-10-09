/**
 * 打包命令
 * node deploy 环境名
 * 运行仅支持单环境
 */
// 压缩插件
const compressing = require("compressing");
const dayjs = require("dayjs");
const fs = require("fs");
const colors = require("colors");
const path = require("path"); //解析需要遍历的文件夹
const { spawnSync } = require("child_process");
const { envList } = require("./env.js");
// 运行文件夹
const cmdPath = `${path.resolve("./")}/node_modules/.bin`;
// 打包文件路径
let vueCliService = "";
if (process.platform.includes("win")) {
  vueCliService = `${cmdPath}/vue-cli-service.cmd`;
} else if (process.platform.includes("linux")) {
  vueCliService = `${cmdPath}/vue-cli-service`;
} else if (process.platform.includes("mac")) {
  vueCliService = `${cmdPath}/vue-cli-service.ps1`;
}
// 获取参数列表
let envKeyList = process.argv.splice(2);
// 当前平台
let nowPlatform = "";
// 当前环境
let nowEnvObj = {};
// 运行类型
let type = "build";
// 打包列表
let nextEnvKeyList = [];

console.log(colors.yellow("------------开始" + JSON.stringify(envKeyList)));
nextEnvKeyList = envKeyList.map((elem) => elem);
nextEnv();

/**
 * 执行下一条
 */
async function nextEnv() {
  if (nextEnvKeyList.length) {
    await runSerivce(nextEnvKeyList[0]);
  }
}
/**
 * 执行 npm run build/serve 命令
 */
async function runSerivce(envKey) {
  nowPlatform = envKey;
  nowEnvObj = envList[envKey] || {};
  if (!nowEnvObj?.VUE_APP_ENV) {
    console.log(colors.red("不存在该环境"));
    return;
  }
  console.log(colors.yellow("执行参数", envKey, JSON.stringify(nowEnvObj)));
  Object.assign(process.env, nowEnvObj);
  console.log(colors.blue("开始运行...", `${vueCliService} ${type}`));
  await build();
}
/**
 * 打包1
 */
async function build() {
  // 同步执行
  try {
    await spawnSync(vueCliService, [type]);
    // 成功
    console.log(colors.yellow("清理多余文件_mini"));
    nextEnvKeyList.shift();
    await miniDist();
    // await addZip()
  } catch (err) {
    console.log(colors.red("运行失败", err));
  }
}

/**
 * 删除不需要的文件
 */
async function filterFileList(src, dist) {
  let docs = fs.readdirSync(src);
  let minDirList = ["resource", "platform"];
  let envKeys = Object.keys(envList).filter(
    (key) => key != nowEnvObj.VUE_APP_ENV
  );
  for (let index = 0; index < docs.length; index++) {
    const doc = docs[index];
    let _src = src + "/" + doc,
      _dist = dist + "/" + doc;
    let st = fs.statSync(_src);
    // 判断是否为文件
    if (st.isFile() && doc !== ".DS_Store") {
      // 常规打包
      if (
        minDirList.some((elem) => _src.indexOf(`/${elem}/`) > -1) &&
        envKeys.some((elem) => _dist.indexOf(`/${elem}/`) > -1)
      ) {
        // 删除其他平台相关文件
        fs.unlinkSync(_src);
      }
    } else if (st.isDirectory()) {
      // 如果是目录则递归调用自身
      if (
        minDirList.some((elem) => _dist.indexOf(`/${elem}/`) > -1) &&
        envKeys.some((elem) => _dist == `/platform/${elem}`)
      ) {
        // 删除其他平台相关文件夹
        fs.rmSync(_src, { recursive: true });
      } else {
        await filterFileList(_src, _dist);
      }
    }
  }
}
/**
 * 压缩软件
 */
async function addZip() {
  await wait(2000);
  await filterFileList(path.resolve("dist"), "");
  let zipName = `./Echo_${nowPlatform}_${dayjs().format("YYYYMMDDHHmmss")}.zip`;
  await compressing.zip.compressDir("dist/", zipName);
  console.log(colors.green("打包成功"));
}

/**
 * 过滤文件
 */
async function miniDist() {
  await wait(2000);
  await filterFileList(path.resolve("dist"), "");
  console.log(
    colors.green(`打包成功_${nowPlatform}_${dayjs().format("YYYYMMDDHHmmss")}`)
  );
}

// 函数实现，参数单位 毫秒 ；
function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
