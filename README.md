# 词根驿站

用词根、前缀、后缀拆解学习 2000 个英语单词的闯关网站（上册 a–n、下册 n–z 各 1000 词）。220 个词根站、22 个章节，通关盖站章，章节考验得章节印。

## 运行

```bash
node server.js
```

打开 http://localhost:3000 。不需要安装任何依赖（Node 18 及以上）。

- `PORT`：端口，默认 3000
- `DATA_DIR`：账号数据目录，默认 `./data`（账号和进度存在 `accounts.json`）

## 结构

- `server.js`：静态文件、注册/登录（scrypt 加盐哈希、HttpOnly 会话 Cookie、登录限速）、进度保存
- `public/page.html`、`style.css`、`app.js`：界面和闯关逻辑
- `public/stamps.js`：程序生成的站章和章节印（SVG）
- `public/data.js`：题库（由 `tools/` 生成）
- `tools/parse.js`、`tools/build.js`、`tools/combine.js`：把词根书的 OCR 文本解析成题库（上册必须排在前面，存档按关卡序号记录）

没有后端时（直接把 `public/` 当静态站点托管），账号和进度会改存在浏览器本地。

## 上线前

- 放在 HTTPS 反向代理后面，并给 Cookie 加上 `Secure`
- `accounts.json` 适合个人或小班使用；用户多了请换成数据库
- 题库内容来自《图解词根、词源 10000 单词速记》，公开发布前请确认版权
