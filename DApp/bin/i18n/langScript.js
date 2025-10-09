/** 语言包同步到多语言js文件

 1.全局安装依赖：npm install node-xlsx --save
 2.运行脚本命令：node langeScript.js **/
const fs = require('fs')
const xlsx = require('node-xlsx')

// 解析得到文档中的所有 sheet
let sheetList = xlsx.parse('./bin/i18n/语言包.xlsx')
// 遍历 sheet
let languageList = []
let languageData = {}

doMain(sheetList)
/**
 * 启动函数
 * @param {*} sheetList
 */
function doMain(sheetList) {
  sheetList.forEach((sheet) => {
    let planform = sheet.name
    console.log('sheet---', sheet.name)

    if (sheet.name == 'default') {
      planform = ''
      // 获取所有语种
      languageList = sheet.data[0].slice(1)
      console.log(JSON.stringify(languageList), `共${languageList.length}种`)
    }
    let key = ''
    let val = ''
    sheet.data.slice(1).forEach((elem) => {
      // 过滤第一行循环
      elem[0] = `${elem[0]}`.trim()
      if (!elem[0]) {
        // key 不存在跳过
        return
      }
      if (planform) {
        // 平台key
        key = `"${planform}_${elem[0]}"`.trim()
      } else {
        key = `"${elem[0]}"`.trim()
      }
      val = ''
      if (elem[0] && aleadyHasKey(key)) {
        languageList.forEach((language, index) => {
          val = elem[index + 1]
          if (!languageData[language]) {
            languageData[language] = ''
          }
          if (val) {
            val = `${val}`.trim()
            languageData[language] += `\n${key}:"${val}",`
          }
        })
      }
    })
    // (elem.title )
  })

  // 更新文件
  updateFile()
}
/**
 * 判断key是否存在
 * @param {*} key
 * @returns
 */
function aleadyHasKey(key) {
  let keyList = Object.keys(languageData)
  if (!keyList.length) {
    return true
  }
  let str = languageData[Object.keys(languageData)[0]]
  if (str.indexOf(`\n${key}:`) === -1) {
    return true
  } else {
    console.log('注意：key重复==>' + key)
    return false
  }
}

/**
 * 更新文件
 */
function updateFile() {
  let count = 0
  languageList.forEach((language) => {
    let publicFileText = '{'
    let filePath = `./src/plugin/i18n/locales/${language}.json`
    // 删除
    fs.writeFile(filePath, '', () => {
      // 写入
      fs.appendFile(filePath, `${publicFileText}${languageData[language]}\n}`, (err) => {
        if (!err) {
          console.log(`${language}包同步完成，已处理${++count}个`)
        }
      })
    })
  })
}
