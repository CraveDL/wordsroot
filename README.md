# 词根驿站

按前缀、词根、后缀闯关学英语单词的网站。词库 7080 个词条（6055 个不重复单词），995 个构词分组，排成三条路线共 1043 个驿站：前缀 166 站、词根 681 站、后缀 196 站。每站先看单词拆成彩色词块，再闯关，通关盖站章；每 10 站一章，过章节考验得章节印。

## 运行

```bash
node server.js
```

打开 http://localhost:3000 。需要 Node 22.13 及以上（用到内置的 `node:sqlite`）。服务器运行时不需要安装依赖，`public/` 里已经是构建好的页面。

## 开发

```bash
npm install
npm run build-all   # 从 sources/lexicon.xlsx 重建数据库，再构建前端到 public/
npm run dev         # 前端热更新（另开一个终端运行 node server.js 提供接口和数据）
```

前端在 `web/`：React 19 + Vite，动效用 GSAP（ScrollTrigger、Flip、DrawSVG、SplitText）和 Lenis 平滑滚动，部分组件来自 React Bits（`web/src/components/rb/`，许可见同目录 LICENSE.md）。

- 首页：单词自动拆开成前缀、词根、后缀再合拢；标题逐字浮现；数字滚动计数；区块随滚动出现
- 路线图：每章的道路用 DrawSVG 画出，已通关的部分上色，当前站有脉冲光圈
- 拼词块：词块用 Flip 从下方飞进拼写槽
- 结算：站章砸下盖印、星星依次弹出、经验数字滚动；点击处有火花（ClickSpark）

## 数据

所有数据都在 SQLite 里：

| 文件 | 内容 | 是否提交 |
|---|---|---|
| `data/lexicon.db` | 词库：构词分组、分义、词条、驿站 | 提交（由脚本生成） |
| `data/app.db` | 账号、登录会话、学习进度 | 不提交 |

来源是 `sources/lexicon.xlsx`（词条、分组索引、例句等工作表）。词库表结构（详见 `tools/build-db.js`）：

- `groups`：构词分组，类别（p 前缀 / s 后缀 / r 词根）、书中编号、词缀写法和变体、英文释义、中文意思
- `senses`：分组下的分义（①②③）
- `entries`：词条，单词、音标、原书星级、词性及释义、构词记忆、引申路径、例句、用法搭配、词源故事，以及拆好的词块（JSON）
- `stations` / `station_groups` / `station_entries`：驿站划分。一个分组一站；超过 14 个词的分组按分义拆成多站；相邻的很小的分组合成一站

词块的来源：先按书里的「构词记忆」（如 `a＋moral（道德的）`）切分并对齐到单词拼写，认出其中属于本分组的词缀；没有构词记忆或对不上时，在单词里找本分组的词缀切开。

`node tools/build-db.js` 会重建 `data/lexicon.db` 并导出 `public/data.json`；服务器启动时也会从数据库生成同样的数据。

## 接口

- `GET /api/groups?category=p`：构词分组及词条数（category 可省略）
- `GET /api/words?category=r&group=626`：某个分组的词条
- `GET /api/words?q=spect`：按单词开头或释义搜索
- 账号：`POST /api/email-code`（`purpose`：register / reset / bind）、`POST /api/register`、`POST /api/login`、`POST /api/reset-password`、`POST /api/bind-email`、`POST /api/logout`、`GET /api/me`、`PUT /api/progress`

学习进度按驿站 key、章节 key 和单词保存，并记下词库版本。用旧词库存的进度在登录时按单词换算：新驿站里有一半以上的词在旧版通关过，就算已通关（对照表在 `data/legacy.json`）。

### 发布成 claude.ai 页面

`npm run build` 会同时生成 `public/artifact.html`（去掉外层 html 标签的页面），连同 `public/assets/` 和 `public/data.json` 一起发布即可。那里没有服务器，用访问者的 Claude 账号保存进度。

## 部署到公网

仓库里已经带了 `Dockerfile`，任何能跑 Docker 的地方都能部署。账号数据库放在容器的 `/data` 目录，必须挂一块持久磁盘，否则重启后账号会清空。

### 方式一：Render（海外，最省事）

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/CraveDL/wordsroot)

1. 打开 https://dashboard.render.com/blueprints ，点 **New Blueprint Instance**。
2. 连接 GitHub，选这个仓库，Render 会读取 `render.yaml`，点 **Apply**。
3. 几分钟后得到形如 `https://wordsroot.onrender.com` 的网址。

`render.yaml` 用的是付费的 Starter 实例加 1GB 磁盘（约每月 7 美元多一点），因为免费实例不能挂磁盘。只想先试用的话，把 `plan` 改成 `free` 并删掉 `disk` 一段，但这样每次重启或重新部署后账号都会清空，而且 15 分钟没人访问就会休眠。

### 方式二：自己的云服务器（中国大陆访问更快）

```bash
git clone https://github.com/CraveDL/wordsroot.git && cd wordsroot
docker compose up -d
```

网站在服务器的 80 端口。要用 HTTPS，在前面放 Caddy 或 nginx 反向代理，并把 `docker-compose.yml` 里的 `TRUST_PROXY` 改成 `"1"`。在大陆用域名访问需要先备案。

### 邮箱注册和发信

用户用邮箱注册：填邮箱、收 6 位验证码、设昵称和密码。登录用邮箱和密码，忘记密码可以用邮箱验证码重设。早期用用户名注册的账号仍能用用户名登录，并可以在「我的」里绑定邮箱。

验证码通过 SMTP 发出，需要一个发信邮箱：

| 邮箱 | SMTP_HOST | 密码填什么 |
|---|---|---|
| QQ 邮箱 | `smtp.qq.com` | 邮箱设置里开启 SMTP 后生成的授权码 |
| 163 邮箱 | `smtp.163.com` | 开启 SMTP 后生成的授权码 |
| Gmail | `smtp.gmail.com` | 应用专用密码 |

没有配置 SMTP 时，验证码不会真的发出，只打印在服务器日志里，方便本地测试。

规则：验证码 10 分钟内有效，输错 5 次作废；同一邮箱 60 秒内只能发一次，同一网络每小时最多发 10 封；重设密码后其他设备上的登录会退出。

### 环境变量

- `PORT`：端口，默认 3000
- `DATA_DIR`：账号数据库目录，容器里是 `/data`
- `TRUST_PROXY=1`：在 HTTPS 反向代理后面时开启，从代理头读取访问者 IP 和协议，登录 Cookie 会带上 `Secure`
- `COOKIE_SECURE=1`：直接给 Cookie 加 `Secure`
- `SMTP_HOST`、`SMTP_PORT`（默认 465）、`SMTP_USER`、`SMTP_PASS`：发验证码用的邮箱
- `MAIL_FROM`：发件地址，默认同 `SMTP_USER`
- `SMTP_SECURE=0`：用 587 或 25 端口时设置（服务器支持时会自动升级 STARTTLS）

## 上线前

- 定期备份 `/data/app.db`
- 题库内容来自《图解词根、词源 10000 单词速记》，公开发布前请确认版权
