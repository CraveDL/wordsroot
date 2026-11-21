# 词根驿站

用词根、前缀、后缀拆解学英语单词的闯关网站。313 个词根、5769 个单词，分成 679 个词根站、69 章；通关盖站章，章节考验得章节印。

## 运行

```bash
node server.js
```

打开 http://localhost:3000 。需要 Node 22.13 及以上（用到内置的 `node:sqlite`），不需要安装依赖。

- `PORT`：端口，默认 3000
- `DATA_DIR`：账号数据库所在目录，默认 `./data`

## 数据

所有数据都在 SQLite 里：

| 文件 | 内容 | 是否提交 |
|---|---|---|
| `data/lexicon.db` | 词库：词根、单词、词缀、关卡 | 提交（由脚本生成） |
| `data/app.db` | 账号、登录会话、学习进度 | 不提交 |

词库表结构（详见 `tools/build-db.js`）：

- `roots`：词根（`key` 如 `cap,cip,cup`）、书中写法、含义、巧记、所属册
- `words`：单词、词性、释义、音标、考试级别、记法、拆解词块（JSON）、例句
- `word_roots`：单词与词根的多对多关系（少数单词同属两个词根）
- `affixes`：前缀、后缀及释义
- `levels` / `level_roots` / `level_words`：关卡划分

重新生成词库：

```bash
node tools/build-db.js
```

它读取 `sources/` 下的源文件，写出 `data/lexicon.db`，再从数据库导出 `public/data.js`（给没有后端的静态托管用）。

### 来源

- `sources/vol1.md`：上册，161 个词根（ac 到 norm）
- `sources/vol2.md`：下册，152 个词根（not 到 zoo）

每个单词的拆解词块按这个顺序得出：书中的记法（如 `cap(抓)+able`）→ 由同词根里已拆解的单词推出（`in` + `capacity`）→ 在单词里找到词根，前后按常见词缀切分。

## 接口

- `GET /api/roots`：全部词根及单词数
- `GET /api/words?root=act`：某个词根下的单词
- `GET /api/words?q=spect`：按单词开头或释义搜索
- `POST /api/register`、`POST /api/login`、`POST /api/logout`、`GET /api/me`、`PUT /api/progress`

学习进度按关卡 key 和单词文本保存，重新生成词库后进度仍能对上；第一版（2000 词）和上一版（4663 词）的旧进度在登录时自动换算到新关卡（见 `data/legacy-*.json`）。旧版的 `data/accounts.json` 会在首次启动时迁移进 `app.db`。

## 上线前

- 放在 HTTPS 反向代理后面，并给 Cookie 加上 `Secure`
- 定期备份 `data/app.db`
- 题库内容来自《图解词根、词源 10000 单词速记》，公开发布前请确认版权
