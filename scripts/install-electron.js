#!/usr/bin/env node
/**
 * Electron 二进制文件下载脚本
 * 使用国内镜像下载，避免官方源下载超时
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const os = require('os')
const { execSync } = require('child_process')

const ELECTRON_VERSION = '28.3.3'
const MIRRORS = [
  'https://npmmirror.com/mirrors/electron/',
  'https://mirrors.huaweicloud.com/electron/',
  'https://cdn.npmmirror.com/binaries/electron/',
  'https://github.com/electron/electron/releases/download/'
]

const electronPkgDir = path.resolve(__dirname, '../node_modules/electron')
const distDir = path.join(electronPkgDir, 'dist')
const pathFile = path.join(electronPkgDir, 'path.txt')

const platform = process.platform
let arch = process.arch
if (arch === 'arm64') arch = 'arm64'
else arch = 'x64'

const electronPlatform = platform === 'win32' ? 'win32' : platform === 'darwin' ? 'darwin' : 'linux'
const electronExt = platform === 'darwin' ? 'dmg' : 'zip'
const fileName = `electron-v${ELECTRON_VERSION}-${electronPlatform}-${arch}.${electronExt}`
const electronExe = platform === 'win32' ? 'electron.exe' : 'electron'

function checkInstalled() {
  try {
    const exePath = path.join(distDir, electronExe)
    return fs.existsSync(exePath) && fs.existsSync(pathFile)
  } catch {
    return false
  }
}

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const timeout = 120000

    const req = client.get(url, { timeout }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307 || res.statusCode === 308) {
        downloadFile(res.headers.location, dest).then(resolve).catch(reject)
        req.destroy()
        return
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }

      const total = parseInt(res.headers['content-length'] || '0', 10)
      let downloaded = 0
      let lastProgress = -1

      mkdir(path.dirname(dest))
      const fileStream = fs.createWriteStream(dest)

      res.on('data', (chunk) => {
        downloaded += chunk.length
        const percent = total ? Math.round((downloaded / total) * 100) : 0
        if (percent !== lastProgress && percent % 10 === 0) {
          lastProgress = percent
          const mb = (downloaded / 1024 / 1024).toFixed(1)
          const totalMb = total ? (total / 1024 / 1024).toFixed(1) : '?'
          process.stdout.write(`  下载中... ${percent}% (${mb}MB / ${totalMb}MB)\r`)
        }
      })

      res.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close(() => {
          process.stdout.write('\n')
          resolve(dest)
        })
      })

      fileStream.on('error', reject)
    })

    req.on('timeout', () => {
      req.destroy(new Error('下载超时 (120s)'))
    })

    req.on('error', reject)
  })
}

function manualUnzip(zipPath, destDir) {
  mkdir(destDir)
  if (platform === 'win32') {
    try {
      execSync(`powershell -NoProfile -NonInteractive -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${destDir}' -Force"`, {
        stdio: 'ignore'
      })
      return true
    } catch (e) {
      console.log('  PowerShell Expand-Archive 失败')
    }
  }
  try {
    const AdmZip = require('adm-zip')
    const zip = new AdmZip(zipPath)
    zip.extractAllTo(destDir, true)
    return true
  } catch (e) {
    console.log('  adm-zip 不可用')
  }
  try {
    require.resolve('unzipper')
    const unzipper = require('unzipper')
    return fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: destDir }))
      .promise()
      .then(() => true)
      .catch(() => false)
  } catch {}
  console.error('\n  警告：无法自动解压，请手动处理')
  return false
}

async function tryMirror(mirror) {
  const url = `${mirror}v${ELECTRON_VERSION}/${fileName}`
  const tempFile = path.join(os.tmpdir(), fileName)
  try {
    fs.unlinkSync(tempFile)
  } catch {}

  console.log(`\n尝试下载: ${url.substring(0, 60)}...`)
  try {
    await downloadFile(url, tempFile)
    return tempFile
  } catch (e) {
    try { fs.unlinkSync(tempFile) } catch {}
    console.log(`  失败: ${e.message}`)
    throw e
  }
}

function findTopLevelDist(dir) {
  const items = fs.readdirSync(dir)
  for (const item of items) {
    if (item === electronExe) return dir
    const full = path.join(dir, item)
    if (fs.statSync(full).isDirectory()) {
      const found = findTopLevelDist(full)
      if (found) return found
    }
  }
  return null
}

async function main() {
  console.log('\n=== 播客工作室 Electron 安装脚本 ===')
  console.log(`版本: v${ELECTRON_VERSION}`)
  console.log(`平台: ${electronPlatform}-${arch}`)

  if (checkInstalled()) {
    console.log('\n✅ Electron 已正确安装，跳过下载')
    process.exit(0)
  }

  console.log('\n开始下载 Electron...')
  mkdir(distDir)

  let zipPath = null
  for (const mirror of MIRRORS) {
    try {
      zipPath = await tryMirror(mirror)
      if (zipPath) break
    } catch {}
  }

  if (!zipPath) {
    console.error('\n❌ 所有镜像源下载失败')
    console.log('\n请手动下载:')
    console.log(`  文件名: ${fileName}`)
    console.log(`  版本: v${ELECTRON_VERSION}`)
    console.log('\n推荐下载地址:')
    MIRRORS.forEach(m => {
      console.log(`  ${m}v${ELECTRON_VERSION}/${fileName}`)
    })
    console.log(`\n  下载后解压到: ${distDir}`)
    console.log(`  然后创建文件: ${pathFile}，内容为: ${electronExe}`)
    process.exit(1)
  }

  console.log('\n正在解压...')
  try {
    const result = await manualUnzip(zipPath, distDir)
    if (!result) throw new Error('解压失败')
  } catch (e) {
    console.error('❌ 解压失败:', e.message)
    try { fs.unlinkSync(zipPath) } catch {}
    process.exit(1)
  }

  const hasExe = findTopLevelDist(distDir)
  if (!hasExe) {
    console.log('  警告: 未检测到 electron.exe，可能解压到了子目录')
  }

  try {
    fs.writeFileSync(pathFile, electronExe, 'utf8')
  } catch (e) {
    console.log('  写入 path.txt 失败:', e.message)
  }

  try {
    fs.unlinkSync(zipPath)
  } catch {}

  console.log('\n✅ Electron 安装成功!')
  process.exit(0)
}

main().catch(err => {
  console.error('\n❌ 安装出错:', err.message)
  process.exit(1)
})
