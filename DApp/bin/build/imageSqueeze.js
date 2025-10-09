const fs = require('fs')
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const directoryPath = './dist/resource/' // 替换为实际目录路径

async function compressImages(dirPath) {
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      // 如果是子文件夹，递归处理
      await compressImages(filePath)
    } else {
      const ext = path.extname(filePath).toLowerCase()

      if (ext === '.svg') {
        // 使用 svgo 压缩 SVG 文件
        const { stdout, stderr } = await exec(
          `svgo "${filePath}" --quiet --multipass --input "${filePath}"`
        )
        if (stderr) {
          console.error(`Error while compressing ${filePath}:`, stderr)
        } else {
          console.log(`Compressed SVG: ${filePath}`)
        }
      } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        // 使用 sharp 压缩 PNG 和 JPG 文件
        const outputPath = filePath
        await sharp(filePath).toFile(outputPath)
        console.log(`Compressed image: ${filePath}`)
      }
    }
  }
}

compressImages(directoryPath)
