已根据提供的文件内容，参考目录中的词根顺序，对正文的所有**词根（含含义与记忆巧记）**、**主词与关联词（含词性、释义、拆解）**、**引申词/派生词**、**难度级别标签**（初/四/六/研/托/G等）以及**对应例句**进行了完整系统化提取。

为了方便您后期程序解析（Python/Pandas、JSON转换、导入数据库或制卡软件如 Anki），以下提供 **结构化 JSON 格式** 与 **易读的 Markdown 结构表** 两种呈现方式。

---

### 一、 提取规范字段说明

* `root`：核心词根及同源/变体词根
* `meaning`：词根核心中文释义
* `mnemonic`：书中的谐音/联想巧记法
* `words`：收录单词列表
  * `word`：英文单词
  * `level`：书中标注的考试级别难度（如：初、四、六、研、托、G，无标注记为`-`）
  * `phonetic`：音标（正文中包含的提供）
  * `pos`：词性（n. / v. / a. / ad. 等）
  * `cn`：中文释义
  * `analysis`：词根词缀拆解或联想剖析
  * `derivatives`：同一体系下的派生/引申/同根词
  * `example_en`：英文例句（若正文有收录）
  * `example_cn`：例句中文翻译

---

### 二、 核心词根全量格式化提取数据 (JSON)

```json
[
  {
    "root": "not",
    "meaning": "知道，注意",
    "mnemonic": "单词not是“不”的意思→“不知者不怪”把“不”和“知道”联系在一起→知道、注意",
    "words": [
      {
        "word": "note",
        "level": "初",
        "phonetic": "nəut",
        "pos": "n.",
        "cn": "笔记；注解",
        "analysis": "not(知道) + e → 想知道就得记笔记",
        "derivatives": ["noted (a. 著名的 [初])", "notate (v. 写成标志)", "notation (n. 标记法)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "notify",
        "level": "-",
        "phonetic": "'nəutifai",
        "pos": "vt.",
        "cn": "布告；通知",
        "analysis": "not(知道) + ify(使……动) → 使……知道",
        "derivatives": ["notification (n. 通知；通告)"],
        "example_en": "She notified us that she would accept the position.",
        "example_cn": "她通知我们她愿意接受这份工作。"
      },
      {
        "word": "notion",
        "level": "-",
        "phonetic": "'nəuʃən",
        "pos": "n.",
        "cn": "见解；观念",
        "analysis": "not(知道) + ion(名词后缀) → 知道后才有见解",
        "derivatives": [],
        "example_en": "I have no notion of what it means.",
        "example_cn": "我不知道这意味着什么。"
      },
      {
        "word": "notice",
        "level": "-",
        "phonetic": "'nəutis",
        "pos": "n.",
        "cn": "注意；通知；警告",
        "analysis": "not(注意) + ice(名词后缀)",
        "derivatives": ["noticeable (a. 显而易见的)", "unnoticed (a. 不被注意的)", "unnoticeable (a. 不引人注意的)"],
        "example_en": "Did you notice anything peculiar?",
        "example_cn": "你注意到有什么异常的事吗？"
      },
      {
        "word": "notable",
        "level": "-",
        "phonetic": "-",
        "pos": "a.",
        "cn": "值得注意的",
        "analysis": "not(注意) + able(能……的)",
        "derivatives": ["notability (n. 著名人物)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "notarize",
        "level": "G",
        "phonetic": "'nəutəraiz",
        "pos": "v.",
        "cn": "证明；确认",
        "analysis": "not(知道) + arize(动词后缀) → 让大家知道",
        "derivatives": ["notary (n. 公证人)", "notarization (n. 公证状)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "notorious",
        "level": "-",
        "phonetic": "nəu'to:riəs",
        "pos": "a.",
        "cn": "臭名昭著的",
        "analysis": "not(不) + or(人) + i + ous(形容词后缀) → 不是人的",
        "derivatives": ["notoriety (n. 臭名昭著)"],
        "example_en": "He is notorious for his goings-on.",
        "example_cn": "他因行为不检点而声名狼藉。"
      },
      {
        "word": "annotate",
        "level": "研",
        "phonetic": "'ænəuteit",
        "pos": "v.",
        "cn": "注解",
        "analysis": "an(强调) + not(知道) + ate(动词后缀) → 强调让人知道",
        "derivatives": ["annotation (n. 注解 [研])"],
        "example_en": "Some people annotate as they read.",
        "example_cn": "有的人一面读书一面做注解。"
      },
      {
        "word": "denote",
        "level": "研",
        "phonetic": "di'nəut",
        "pos": "vt.",
        "cn": "指示；表示",
        "analysis": "de(加强) + not(注意) + e → 加强注意 → 做出指示",
        "derivatives": ["denotation (n. 指示；意义)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "connote",
        "level": "-",
        "phonetic": "-",
        "pos": "v.",
        "cn": "意味着",
        "analysis": "con(一起) + note(知道) → 一起知道 → 意味着",
        "derivatives": ["connotation (n. 含蓄；内涵)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "nov",
    "meaning": "新",
    "mnemonic": "联想单词novel（新奇的、小说）",
    "words": [
      {
        "word": "novel",
        "level": "四",
        "phonetic": "'novəl",
        "pos": "a. / n.",
        "cn": "新奇的；小说",
        "analysis": "nov(新) + el(形容词后缀)",
        "derivatives": ["novelty (n. 新奇事情)", "novelist (n. 小说家 [四])", "novelette (n. 短/中篇小说)", "novella (n. 短篇故事 [四])"],
        "example_en": "She came up with a novel solution to the problem.",
        "example_cn": "她想出了一个解决问题的新奇的办法。"
      },
      {
        "word": "novice",
        "level": "四",
        "phonetic": "'novis",
        "pos": "n.",
        "cn": "新手",
        "analysis": "nov(新) + ice(名词后缀：人) → 新人",
        "derivatives": ["novation (n. 更替；更新 [六])"],
        "example_en": "I'm a novice at bridge.",
        "example_cn": "我是个桥牌新手。"
      },
      {
        "word": "nova",
        "level": "四",
        "phonetic": "'nəuvə",
        "pos": "n.",
        "cn": "新星",
        "analysis": "nov(新) + a(名词后缀：物体) → 新天体",
        "derivatives": ["supernova (n. 超新星)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "innovate",
        "level": "-",
        "phonetic": "'inəuveit",
        "pos": "vt.",
        "cn": "革新；改革",
        "analysis": "in(内) + nov(新) + ate(动词后缀) → 内部创新",
        "derivatives": ["innovation (n. 制度等革新)", "innovative (a. 革新的；创新的)"],
        "example_en": "It is necessary to innovate and develop military theories.",
        "example_cn": "创新和发展军事理论是很必要的。"
      },
      {
        "word": "renovate",
        "level": "研",
        "phonetic": "'renəuveit",
        "pos": "vt.",
        "cn": "翻新",
        "analysis": "re(再) + nov(新) + ate(动词后缀) → 再次变新",
        "derivatives": ["renovation (n. 翻新；修理 [G])"],
        "example_en": "Whenever foreign technology is introduced, we should first master it and then upgrade or renovate it.",
        "example_cn": "引进技术改造企业：第一要学会；第二要提高或创新。"
      }
    ]
  },
  {
    "root": "numer",
    "meaning": "数目",
    "mnemonic": "由单词number去掉辅音b衍生而来",
    "words": [
      {
        "word": "numerable",
        "level": "四",
        "phonetic": "'nju:mərəbl",
        "pos": "a.",
        "cn": "可数的；可计算的",
        "analysis": "numer(数目) + able(能)",
        "derivatives": ["innumerable (a. 数不清的 [四])", "numeral (n. 数字；数)", "numerical (a. 数字的 [四])"],
        "example_en": "The stars in the night sky are innumerable.",
        "example_cn": "夜空中的星星数不清。"
      },
      {
        "word": "numerous",
        "level": "-",
        "phonetic": "'nju:mərəs",
        "pos": "a.",
        "cn": "数目众多的",
        "analysis": "numer(数目) + ous(多……的)",
        "derivatives": [],
        "example_en": "He has a numerous collection of stamps.",
        "example_cn": "他收藏着许多邮票。"
      },
      {
        "word": "numerate",
        "level": "-",
        "phonetic": "'nju:məreit",
        "pos": "v.",
        "cn": "读数；计算",
        "analysis": "numer(数) + ate(动词后缀)",
        "derivatives": ["numerator (n. 分子；计算器)", "numeration (n. 记数；计算 [托])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "enumerate",
        "level": "-",
        "phonetic": "i'nju:məreit",
        "pos": "v.",
        "cn": "列举；计算；枚举",
        "analysis": "e(出) + numer(数目) + ate(动词后缀) → 按数目列出",
        "derivatives": ["enumeration (n. 计算；列举 [G])"],
        "example_en": "He enumerated the facts to the jury.",
        "example_cn": "他向陪审团列举了事实。"
      },
      {
        "word": "numerology",
        "level": "-",
        "phonetic": ",nju:mə'rolədʒi",
        "pos": "n.",
        "cn": "命理学",
        "analysis": "numer(数目) + o + logy(学科) → 以数字推断人命运的学问",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "supernumerary",
        "level": "-",
        "phonetic": ",sju:pə'nju:mərəri",
        "pos": "n. / a.",
        "cn": "多余的人或物；额外的",
        "analysis": "super(超出) + numer(数目) + ary(形容词后缀)",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "alphanumeric",
        "level": "G",
        "phonetic": "ælfənju:'merik",
        "pos": "a.",
        "cn": "字母数字的",
        "analysis": "alpha(字母) + numer(数目) + ic(形容词后缀)",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "nunci, nounce",
    "meaning": "讲话，说出",
    "mnemonic": "nun（喃）+ ci（词）→ 喃喃有词 → 讲话、说出",
    "words": [
      {
        "word": "announce",
        "level": "初",
        "phonetic": "ə'nauns",
        "pos": "vt.",
        "cn": "宣布；发表",
        "analysis": "an(强调) + nounce(说出) → 强调说出来",
        "derivatives": ["announcement (n. 通告)", "announcer (n. 广播员)", "unannounced (a. 未经宣布的)", "annunciate (v. 报告；通知 [G])", "annunciation (n. 通告 [G])"],
        "example_en": "He announced that she would give one extra song.",
        "example_cn": "他宣布说她将再唱一首歌。"
      },
      {
        "word": "denounce",
        "level": "-",
        "phonetic": "di'nauns",
        "pos": "vt.",
        "cn": "抨击；指责",
        "analysis": "de(向下) + nounce(讲话) → 向下讲话",
        "derivatives": ["denouncement (n. 公开抨击)", "denunciate (v. 抨击；指责)", "denunciation (n. 谴责)"],
        "example_en": "The minister's action was denounced in the newspapers.",
        "example_cn": "这位部长的行为在报纸上受到谴责。"
      },
      {
        "word": "pronounce",
        "level": "初",
        "phonetic": "prə'nauns",
        "pos": "vt.",
        "cn": "发音；宣告",
        "analysis": "pro(在前面) + nounce(讲话) → 在前面讲话",
        "derivatives": ["pronunciation (n. 发音 [初])", "mispronounce (v. 发错音)", "mispronunciation (n. 发错音 [初])", "pronouncement (n. 宣布；宣告)", "pronounced (a. 著名的；显著的)", "unpronounceable (a. 不能发音的)"],
        "example_en": "She knows a lot of French words but pronounces them incorrectly.",
        "example_cn": "她认识很多法语单词,但发音不准确。"
      },
      {
        "word": "renounce",
        "level": "G",
        "phonetic": "ri'nauns",
        "pos": "vt.",
        "cn": "否认；抛弃",
        "analysis": "re(回) + nounce(讲话) → 收回讲话",
        "derivatives": ["renouncement (n. 放弃)", "renunciation (n. 放弃；废弃 [G])"],
        "example_en": "He renounced his claim to the inheritance.",
        "example_cn": "他声明放弃对遗产的要求。"
      },
      {
        "word": "enunciate",
        "level": "-",
        "phonetic": "i'nansieit",
        "pos": "v.",
        "cn": "发音；清楚表达",
        "analysis": "e(出) + nunci(讲话) + ate(动词后缀) → 说出来",
        "derivatives": ["enunciation (n. 阐明；发表)"],
        "example_en": "That actor enunciates very well.",
        "example_cn": "那演员发音很清晰。"
      },
      {
        "word": "nuncio",
        "level": "G",
        "phonetic": "-",
        "pos": "n.",
        "cn": "罗马教皇使节",
        "analysis": "说话算数的人",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "onym",
    "meaning": "名字",
    "mnemonic": "on(在……上) + ym(yu men 郁闷) → 名字的问题令人郁闷 → 名字",
    "words": [
      {
        "word": "onymous",
        "level": "-",
        "phonetic": "'oniməs",
        "pos": "a.",
        "cn": "署名的；有名字的",
        "analysis": "onym(名字) + ous(形容词后缀)",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "anonymous",
        "level": "-",
        "phonetic": "ə'noniməs",
        "pos": "a.",
        "cn": "匿名的；无名的",
        "analysis": "an(无) + onym(名字) + ous(形容词后缀)",
        "derivatives": ["anonymity (n. 无名；匿名)"],
        "example_en": "An anonymous author wrote this book.",
        "example_cn": "这本书出自无名氏之手。"
      },
      {
        "word": "homonymous",
        "level": "G",
        "phonetic": "ho'moniməs",
        "pos": "a.",
        "cn": "同音异义的；同名的",
        "analysis": "homo(同) + onym(名字) + ous(形容词后缀)",
        "derivatives": ["homonym (n. 同音异义字)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "pseudonym",
        "level": "研",
        "phonetic": "'psju:dənim",
        "pos": "n.",
        "cn": "匿名；假名；笔名",
        "analysis": "pseud(假) + onym(名字)",
        "derivatives": [],
        "example_en": "She writes under a pseudonym.",
        "example_cn": "她用笔名发表作品。"
      },
      {
        "word": "patronymic",
        "level": "G",
        "phonetic": "pætrə'nimik",
        "pos": "a.",
        "cn": "源于父名的；取自教父名的",
        "analysis": "patro(父亲) + onym(名字) + ic(形容词后缀)",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "synonym",
        "level": "-",
        "phonetic": "'sinənim",
        "pos": "n.",
        "cn": "同义词",
        "analysis": "syn(同) + onym(名)",
        "derivatives": [],
        "example_en": "Don't mix up this pair of synonyms.",
        "example_cn": "别把这两个同义词混淆了。"
      },
      {
        "word": "acronym",
        "level": "G",
        "phonetic": "'ækrənim",
        "pos": "n.",
        "cn": "缩写字；字头语",
        "analysis": "acr(尖) + onym(名) → 名字的“尖”",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "antonym",
        "level": "-",
        "phonetic": "'æntənim",
        "pos": "n.",
        "cn": "反义词",
        "analysis": "ant(反) + onym(名)",
        "derivatives": [],
        "example_en": "\"Fast\" is the antonym of \"slow\".",
        "example_cn": "“快”是“慢”的反义词。"
      }
    ]
  },
  {
    "root": "oper",
    "meaning": "工作",
    "mnemonic": "oper读：“袄破”→ 穿破袄干活 → 工作",
    "words": [
      {
        "word": "opera",
        "level": "-",
        "phonetic": "'opərə",
        "pos": "n.",
        "cn": "歌剧",
        "analysis": "oper(工作) + a(名词后缀) → 来源于生活(工作)",
        "derivatives": ["opus (n. 著作 [四])", "operatic (a. 歌剧的 [四])", "operatta (n. 小歌剧)"],
        "example_en": "Have you heard the opera sung in French?",
        "example_cn": "你听过用法语唱的这场歌剧吗？"
      },
      {
        "word": "operate",
        "level": "-",
        "phonetic": "'opəreit",
        "pos": "v.",
        "cn": "操作；运转；动手术",
        "analysis": "oper(工作) + ate(动词后缀)",
        "derivatives": ["operation (n. 操作；手术)", "operating (a. 操作的)", "operational (a. 操作的)", "operative (a. 动作的 [四])", "operator (n. 操作员 [四])"],
        "example_en": "Who operates that machine?",
        "example_cn": "那台机器由谁操作？"
      },
      {
        "word": "operose",
        "level": "-",
        "phonetic": "'opərəus",
        "pos": "a.",
        "cn": "费力的；吃力的；勤勉的",
        "analysis": "oper(工作) + ose(多……的) → 工作过多的",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "cooperate",
        "level": "-",
        "phonetic": "kəu'opəreit",
        "pos": "v.",
        "cn": "合作；协力",
        "analysis": "co(一起) + oper(工作) + ate(动词后缀)",
        "derivatives": ["cooperation (n. 合作)", "cooperative (n. 合作社)", "uncooperative (a. 不合作的)", "noncooperation (n. 不合作 [四])"],
        "example_en": "Let's all cooperate to get the work done quickly.",
        "example_cn": "让我们一起同心协力把这工作快点做完。"
      },
      {
        "word": "operable",
        "level": "G",
        "phonetic": "'opərəbl",
        "pos": "a.",
        "cn": "能做手术的；切实可行的",
        "analysis": "oper(工作/手术) + able(能)",
        "derivatives": ["inoperable (a. 不能动手术的 [G])", "inoperative (a. 不活动的 [G])", "preoperative (a. 外科手术前的 [G])", "postoperative (a. 手术后的)"],
        "example_en": "The tumour is operable.",
        "example_cn": "这肿瘤可动手术割除。"
      }
    ]
  },
  {
    "root": "opt",
    "meaning": "选择、视力",
    "mnemonic": "opt读：“袄破他”→ 他视力不好，选了一件破袄 → 选择、视力",
    "words": [
      {
        "word": "opt",
        "level": "四",
        "phonetic": "-",
        "pos": "v.",
        "cn": "选择",
        "analysis": "根词直用",
        "derivatives": ["option (n. 选择 [四])", "optional (a. 可任意选择的)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "option",
        "level": "四",
        "phonetic": "'opʃən",
        "pos": "n.",
        "cn": "选择",
        "analysis": "opt(选择) + ion(名词后缀)",
        "derivatives": [],
        "example_en": "He had no option but to agree.",
        "example_cn": "他除了同意外别无选择。"
      },
      {
        "word": "adopt",
        "level": "四",
        "phonetic": "ə'dopt",
        "pos": "v.",
        "cn": "采纳；收养",
        "analysis": "ad(强调) + opt(选择) → 强调选出",
        "derivatives": ["adoption (n. 采用；采纳)", "adoptive (a. 采用的)", "adoptable (a. 可采纳的)", "co-opt (v. 由现会员选举)"],
        "example_en": "After much deliberation, the president decided to adopt her suggestion.",
        "example_cn": "总经理再三考虑之后，决定采纳她的建议。"
      },
      {
        "word": "optic",
        "level": "-",
        "phonetic": "'optik",
        "pos": "a. / n.",
        "cn": "眼的；视力的；镜片",
        "analysis": "opt(视力) + ic(形容词后缀)",
        "derivatives": ["optical (a. 眼睛的 [四])", "optics (n. 光学)", "optician (n. 光学仪器商 [G])", "optometrist (n. 验光师)"],
        "example_en": "His optic nerve was hurt in an accident.",
        "example_cn": "他的视神经在一次事故中受到损伤。"
      },
      {
        "word": "optometer",
        "level": "-",
        "phonetic": "op'tomitə",
        "pos": "n.",
        "cn": "视力计",
        "analysis": "opt(视力) + o + meter(测量)",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "synopsis",
        "level": "-",
        "phonetic": "si'nopsis",
        "pos": "n.",
        "cn": "摘要；概要",
        "analysis": "syn(综合) + op(看) + sis(名词后缀)",
        "derivatives": [],
        "example_en": "The synopsis of the book is very good.",
        "example_cn": "这本书的梗概非常好。"
      },
      {
        "word": "myopia",
        "level": "-",
        "phonetic": "mai'əupiə",
        "pos": "n.",
        "cn": "近视",
        "analysis": "my(我的) + op(眼睛) + ia(病)",
        "derivatives": ["myopic (a. 近视的 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "biopsy",
        "level": "-",
        "phonetic": "bai'opsi",
        "pos": "n.",
        "cn": "活组织检查",
        "analysis": "bio(生物) + op(看) + sy",
        "derivatives": ["autopsy (n. 验尸 [G])"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "ora",
    "meaning": "嘴，说",
    "mnemonic": "or（嗷）+ a（啊）→ 小朋友“嗷、啊”地学说话 → 说",
    "words": [
      {
        "word": "oral",
        "level": "初",
        "phonetic": "'o:rəl",
        "pos": "a. / n.",
        "cn": "口头的；口试",
        "analysis": "or(说) + al(形容词后缀)",
        "derivatives": [],
        "example_en": "He will take an oral examination.",
        "example_cn": "他将参加口试。"
      },
      {
        "word": "orate",
        "level": "四",
        "phonetic": "o:'reit",
        "pos": "v.",
        "cn": "演说；演讲",
        "analysis": "ora(说) + ate(动词后缀)",
        "derivatives": ["oration (n. 演说；致辞)", "orator (n. 演说家)", "oratory (n. 演讲术)", "peroration (n. 结语；结论)"],
        "example_en": "It certainly is a fine thing to be able to orate.",
        "example_cn": "能说会道当然是好事。"
      },
      {
        "word": "adore",
        "level": "-",
        "phonetic": "ə'do:",
        "pos": "v.",
        "cn": "热爱；崇拜",
        "analysis": "ad(强调) + or(说) + e → 强调说出赞美",
        "derivatives": ["adoration (n. 崇拜；爱慕)", "adorable (a. 可崇拜的/可爱的)"],
        "example_en": "People adore him for his noble character.",
        "example_cn": "人们因他人格高贵而敬重他。"
      },
      {
        "word": "oracle",
        "level": "-",
        "phonetic": "'orəkl",
        "pos": "n.",
        "cn": "神谕；先知",
        "analysis": "ora(说) + cle(东西) → 神说出的话",
        "derivatives": ["oracular (a. 神谕的)"],
        "example_en": "In times of difficulty, she pray for an oracle to guide her.",
        "example_cn": "在困难的时候，她祈祷神谕来指引她。"
      },
      {
        "word": "exorable",
        "level": "-",
        "phonetic": "'eksərəbl",
        "pos": "a.",
        "cn": "可说服的",
        "analysis": "ex(出) + or(说) + able(能) → 能说动其出山的",
        "derivatives": ["inexorable (a. 说不动的；不为所动的)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "orifice",
        "level": "G",
        "phonetic": "'ərifis",
        "pos": "n.",
        "cn": "孔口",
        "analysis": "or(说/嘴) + i + fic(做) + e → 作说话之器官 → 孔口",
        "derivatives": ["orison (n. 祈祷 [研])"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "ordin",
    "meaning": "命令，顺序",
    "mnemonic": "ord(order 命令/顺序) + in(里面) → 里面的命令、顺序",
    "words": [
      {
        "word": "order",
        "level": "-",
        "phonetic": "-",
        "pos": "n.",
        "cn": "次序；命令",
        "analysis": "根词基础",
        "derivatives": ["orderly (n. 传令兵 [四])", "disorder (n. 杂乱；混乱 [四])", "disordered (a. 混乱的)", "disorderly (a. 无秩序的 [四])", "reorder (n. 重新排序)"],
        "example_en": "His room was in disorder.",
        "example_cn": "他房间里很乱。"
      },
      {
        "word": "ordain",
        "level": "正",
        "phonetic": "o:'dein",
        "pos": "v. / n.",
        "cn": "命令；任命",
        "analysis": "ordin变体",
        "derivatives": ["preordain (v. 预定 [G])", "ordinance (n. 训令；法令)"],
        "example_en": "He was an ordained priest.",
        "example_cn": "他被委任为牧师。"
      },
      {
        "word": "ordinary",
        "level": "初",
        "phonetic": "'o:dinəri",
        "pos": "a.",
        "cn": "普通的",
        "analysis": "ordin(命令) + ary(形容词后缀) → 听命令的常人",
        "derivatives": ["ordinarily (ad. 通常 [初])", "extraordinary (a. 特别的；超常的)"],
        "example_en": "She had on an ordinary dress.",
        "example_cn": "她穿着平常的衣服。"
      },
      {
        "word": "subordinate",
        "level": "-",
        "phonetic": "sə'bo:dənit",
        "pos": "a. / n.",
        "cn": "下级的；属下",
        "analysis": "sub(下面) + ordin(顺序) + ate → 顺序在下",
        "derivatives": ["subordination (n. 次级地位)", "insubordinate (a. 不服从的)", "insubordination (n. 不顺从)"],
        "example_en": "He was always friendly to his subordinates.",
        "example_cn": "他对下级一向和蔼可亲。"
      },
      {
        "word": "coordinate",
        "level": "-",
        "phonetic": "kəu'o:dinit",
        "pos": "v. / a.",
        "cn": "协调；同等的",
        "analysis": "co(一起) + ordin(命令) + ate → 一起发布命令协调",
        "derivatives": ["coordination (n. 同等；调和)", "coordinator (n. 协调者)", "uncoordinated (a. 不同等的 [四])"],
        "example_en": "This is a coordinate clause.",
        "example_cn": "这是一个并列子句。"
      },
      {
        "word": "ordinal",
        "level": "-",
        "phonetic": "'o:dinəl",
        "pos": "a. / n.",
        "cn": "顺序的；序数",
        "analysis": "ordin(顺序) + al",
        "derivatives": ["ordination (n. 排成等级)", "inordinate (a. 过度的；无法无天的 [正])", "primordial (a. 原始的)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "ori, orig",
    "meaning": "升起，开始",
    "mnemonic": "o（圆圆太阳）+ ri（日）→ 太阳升起 → 升起、开始",
    "words": [
      {
        "word": "origin",
        "level": "-",
        "phonetic": "'oridʒin",
        "pos": "n.",
        "cn": "起源；出身",
        "analysis": "ori(开始) + gin(gen 产生) → 开始产生",
        "derivatives": ["original (a. 起源的；独创的 [四])", "originally (ad. 原来 [四])", "originality (n. 创造力)", "originate (v. 起源；发明)", "originator (n. 创作者)"],
        "example_en": "He is a Dane by origin.",
        "example_cn": "他原籍丹麦。"
      },
      {
        "word": "orient",
        "level": "-",
        "phonetic": "'o:riənt",
        "pos": "n.",
        "cn": "东方；亚洲",
        "analysis": "ori(升起) + ent → 太阳升起之处",
        "derivatives": ["oriental (a. 东方的)", "orientate (v. 使向东)", "orientation (n. 定位；适应 [六])", "disorient (v. 使迷失方向)", "reorient (v. 重定方向 [四])", "reorientation (n. 重新定向)"],
        "example_en": "Ian is a dab hand at the orient art.",
        "example_cn": "伊恩是东方艺术的行家。"
      },
      {
        "word": "aborigine",
        "level": "G",
        "phonetic": "æbə'ridʒini",
        "pos": "n.",
        "cn": "土著居民",
        "analysis": "ab(强调) + origin(起源) + e",
        "derivatives": ["aboriginal (a. 土著的；原始的 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "abort",
        "level": "G",
        "phonetic": "-",
        "pos": "v.",
        "cn": "流产；打胎",
        "analysis": "ab(偏离) + ori(产生/升起) → 未升起即落",
        "derivatives": ["abortion (n. 小产；流产)", "abortive (a. 流产的)", "antiabortion (a. 反对堕胎的)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "orn",
    "meaning": "装饰",
    "mnemonic": "or（或者）+ n（门）→ 或者安装一扇门装饰一下？ → 装饰",
    "words": [
      {
        "word": "adorn",
        "level": "-",
        "phonetic": "ə'do:n",
        "pos": "v.",
        "cn": "装饰；佩戴",
        "analysis": "ad(强调) + orn(装饰)",
        "derivatives": ["adornment (n. 装饰)", "unadorned (a. 没有装饰的)"],
        "example_en": "The book is adorned with excellent illustrations.",
        "example_cn": "书内有精美插图。"
      },
      {
        "word": "ornate",
        "level": "正",
        "phonetic": "o:'neit",
        "pos": "a.",
        "cn": "华丽的；装饰的",
        "analysis": "orn(装饰) + ate(形容词后缀)",
        "derivatives": ["inornate (a. 朴素的；不加修饰的 [G])"],
        "example_en": "The parks of this city are famous for their ornate fountains.",
        "example_cn": "这个城市的公园以其华丽的喷泉而著名。"
      },
      {
        "word": "ornament",
        "level": "-",
        "phonetic": "'o:nəmənt",
        "pos": "n. / v.",
        "cn": "装饰（品）",
        "analysis": "orn(装饰) + a + ment(名词后缀)",
        "derivatives": ["ornamental (a. 装饰的)", "ornamentation (n. 装饰品)"],
        "example_en": "I like pearly ornament.",
        "example_cn": "我喜欢珍珠饰物。"
      },
      {
        "word": "suborn",
        "level": "G",
        "phonetic": "sə'bo:n",
        "pos": "v.",
        "cn": "收买；贿赂；唆使",
        "analysis": "sub(下面) + orn(装饰) → 私底下给好处装饰",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "par",
    "meaning": "平等",
    "mnemonic": "读：“怕”→ 不怕贫怕不平等（不患贫而患不均）→ 平等",
    "words": [
      {
        "word": "parity",
        "level": "托",
        "phonetic": "'pærəti",
        "pos": "n.",
        "cn": "同等；同样",
        "analysis": "par(平等) + ity(名词后缀)",
        "derivatives": ["par (n. 标准；同等 [四])", "imparity (n. 不平等 [四])", "disparity (n. 不同；不等 [研])"],
        "example_en": "The two currencies have now reached parity.",
        "example_cn": "这两种货币现已达到同等价值。"
      },
      {
        "word": "compare",
        "level": "初",
        "phonetic": "kəm'peə",
        "pos": "v.",
        "cn": "比较；对照",
        "analysis": "com(一起) + par(平等) + e → 放在一起看是否平等",
        "derivatives": ["comparison (n. 比较)", "comparable (a. 可比较的)", "comparative (a. 比较的)", "incomparable (a. 无比的)"],
        "example_en": "Life is poetically compared to the morning dew.",
        "example_cn": "在诗歌中，人生被比喻为朝露。"
      },
      {
        "word": "nonpareil",
        "level": "-",
        "phonetic": "'nonpərəl",
        "pos": "a. / n.",
        "cn": "无比的；无与伦比的",
        "analysis": "non(无) + par(平等) + e + il → 无法平等的（太卓越）",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "disparage",
        "level": "-",
        "phonetic": "dis'pæridʒ",
        "pos": "v.",
        "cn": "轻视；贬抑",
        "analysis": "dis(不) + par(平等) + age → 待遇不平等 → 受到轻视",
        "derivatives": ["disparagement (n. 轻视)", "disparaging (a. 蔑视的)"],
        "example_en": "The woman always disparages my achievements.",
        "example_cn": "那个女人常贬低我的成就。"
      },
      {
        "word": "peer",
        "level": "四",
        "phonetic": "-",
        "pos": "n.",
        "cn": "同辈",
        "analysis": "par变体(a→ee) → 地位平等的人",
        "derivatives": ["peerless (a. 出类的 [四])", "peerage (n. 贵族阶级)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "pair",
        "level": "初",
        "phonetic": "-",
        "pos": "n.",
        "cn": "双；对",
        "analysis": "par变体(a→ai) → 成对平等",
        "derivatives": ["parade (n. 游行)", "apparel (n. 衣服 [初])", "apparatus (n. 仪器 [四])", "separate (v. 分开 [初])", "prepare (v. 准备 [初])"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "pass",
    "meaning": "通过、感情",
    "mnemonic": "单词pass（通过）→ 感情是要通过考验的 → 感情",
    "words": [
      {
        "word": "passport",
        "level": "初",
        "phonetic": "'pa:spo:t",
        "pos": "n.",
        "cn": "护照",
        "analysis": "pass(通过) + port(港口)",
        "derivatives": ["passable (a. 可通行的 [初])", "passe (a. 过盛年的)", "passing (n. 经过)"],
        "example_en": "My passport is due to expire in two months.",
        "example_cn": "我的护照再过两个月就到期了。"
      },
      {
        "word": "compass",
        "level": "四",
        "phonetic": "'kʌmpəs",
        "pos": "n.",
        "cn": "范围；指南针",
        "analysis": "com(一起) + pass(通过) → 一起绕行走过",
        "derivatives": ["encompass (v. 包围；环绕 [托])"],
        "example_en": "Such things aren't within the compass of my power.",
        "example_cn": "这些事不在我力所能及的范围之内。"
      },
      {
        "word": "bypass",
        "level": "四",
        "phonetic": "'baipa:s",
        "pos": "n.",
        "cn": "支路；旁道",
        "analysis": "by(旁) + pass(通过)",
        "derivatives": ["overpass (n. 天桥)", "underpass (n. 地下道 [四])"],
        "example_en": "We took the bypass to avoid the town center.",
        "example_cn": "我们走旁边的道路绕开市中心。"
      },
      {
        "word": "passage",
        "level": "初",
        "phonetic": "'pæsidʒ",
        "pos": "n.",
        "cn": "通过；通行；航线",
        "analysis": "pass(通过) + age(名词后缀)",
        "derivatives": ["passenger (n. 乘客 [初])", "passerby (n. 过路人 [四])"],
        "example_en": "He knew the passage like the palm of his hand.",
        "example_cn": "他对这条航线了如指掌。"
      },
      {
        "word": "surpass",
        "level": "六",
        "phonetic": "sə'pa:s",
        "pos": "v.",
        "cn": "超越；胜过",
        "analysis": "sur(上) + pass(通过)",
        "derivatives": ["impasse (n. 僵局；死路 [四])", "impassable (a. 不可通行的)"],
        "example_en": "Men surpass women in strength.",
        "example_cn": "男人比女人力气大。"
      },
      {
        "word": "trespass",
        "level": "-",
        "phonetic": "-",
        "pos": "v.",
        "cn": "侵入；打扰",
        "analysis": "tres(trans 横过) + pass(通过)",
        "derivatives": ["Passover (n. 逾越节 [四])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "passion",
        "level": "四",
        "phonetic": "'pæʃən",
        "pos": "n.",
        "cn": "激情；热情",
        "analysis": "pass(感情) + ion(名词后缀)",
        "derivatives": ["passionate (a. 热情的)", "dispassion (n. 冷静)", "dispassionate (a. 冷静的)", "impassion (v. 激动 [四])", "impassioned (a. 充满激情 [四])"],
        "example_en": "They sang with great passion.",
        "example_cn": "他们满怀激情地歌唱。"
      },
      {
        "word": "compassion",
        "level": "四",
        "phonetic": "kəm'pæʃən",
        "pos": "n.",
        "cn": "同情；怜悯",
        "analysis": "com(共同) + pass(感情) + ion → 共同的感情",
        "derivatives": ["compassionate (a. 有同情心的 [托])"],
        "example_en": "I had compassion for him.",
        "example_cn": "我怜悯他。"
      },
      {
        "word": "passive",
        "level": "四",
        "phonetic": "'pæsiv",
        "pos": "a. / n.",
        "cn": "被动的；消极的",
        "analysis": "pass(感情) + ive → 感情用事任人摆布",
        "derivatives": ["passivity (n. 被动)", "impassive (a. 冷漠的)"],
        "example_en": "He played a passive role in the marriage.",
        "example_cn": "他在婚姻中扮演了一个被动的角色。"
      },
      {
        "word": "patient",
        "level": "初",
        "phonetic": "-",
        "pos": "a. / n.",
        "cn": "有耐心的；病人",
        "analysis": "pass/pat(感情/忍受) + ient",
        "derivatives": ["patience (n. 耐心 [四])", "impatient (a. 不耐烦的)", "compatible (a. 和谐的 [托])", "compatibility (n. 和谐共处)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "path",
    "meaning": "感情，痛苦",
    "mnemonic": "path单词是“小路”，漫步小路上是交流感情的好地方",
    "words": [
      {
        "word": "sympathy",
        "level": "四",
        "phonetic": "'simpəθi",
        "pos": "n.",
        "cn": "同情；怜悯",
        "analysis": "sym(共同) + path(感情) + y",
        "derivatives": ["sympathetic (a. 同情的)", "unsympathetic (a. 不表同情的 [四])", "sympathize (v. 同情)"],
        "example_en": "The story stirred her sympathy.",
        "example_cn": "这故事激起了她的同情心。"
      },
      {
        "word": "antipathy",
        "level": "G",
        "phonetic": "æn'tipəθi",
        "pos": "n.",
        "cn": "反感；憎恶",
        "analysis": "anti(反) + path(感情) + y → 反对的感情",
        "derivatives": ["antipathetic (a. 讨厌的)"],
        "example_en": "He felt a strong antipathy towards them.",
        "example_cn": "他对他们非常反感。"
      },
      {
        "word": "empathy",
        "level": "G",
        "phonetic": "'empəθi",
        "pos": "n.",
        "cn": "移情作用；神入",
        "analysis": "em(入) + path(感情) + y",
        "derivatives": ["empathize (v. 移情)", "empathetic (a. 移情作用的)"],
        "example_en": "There is a strange empathy between the old lady and her grandson.",
        "example_cn": "老妇人和她孙子间有种莫名其妙的心灵相通的感觉。"
      },
      {
        "word": "pathos",
        "level": "-",
        "phonetic": "'peiθos",
        "pos": "n.",
        "cn": "悲哀；感伤",
        "analysis": "path(感情/痛苦) + os(名词后缀)",
        "derivatives": [],
        "example_en": "The play is notable for the pathos of its final scene.",
        "example_cn": "该剧以最后一场的哀婉动人而著称。"
      },
      {
        "word": "pathetic",
        "level": "-",
        "phonetic": "pə'θetik",
        "pos": "a.",
        "cn": "可怜的；动情的",
        "analysis": "path(感情) + etic(形容词后缀)",
        "derivatives": [],
        "example_en": "We saw the pathetic sight of starving children.",
        "example_cn": "我们看到挨饿的儿童悲惨可怜的样子。"
      },
      {
        "word": "apathy",
        "level": "正",
        "phonetic": "'æpəθi",
        "pos": "n.",
        "cn": "冷淡；冷漠",
        "analysis": "a(无) + path(感情) + y",
        "derivatives": ["apathetic (a. 冷漠的)"],
        "example_en": "She heard the story with apathy.",
        "example_cn": "她无动于衷地听了这个故事。"
      },
      {
        "word": "telepathy",
        "level": "-",
        "phonetic": "ti'lepəθi",
        "pos": "n.",
        "cn": "心灵感应",
        "analysis": "tele(远) + path(感情) + y → 远距离感情传导",
        "derivatives": ["telepathic (a. 心灵感应术的 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "pathology",
        "level": "G",
        "phonetic": "-",
        "pos": "n.",
        "cn": "病理学",
        "analysis": "path(痛苦/疾病) + o + logy(学科)",
        "derivatives": ["pathologist (n. 病理学者)", "sociopath (n. 反社会者)", "psychopath (n. 精神病人)", "psychopathic (a. 精神病的 [G])", "homeopathy (n. 顺势疗法 [G])", "electropathy (n. 电疗法)", "osteopathy (n. 骨疗法 [G])"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "patr(i)",
    "meaning": "父亲",
    "mnemonic": "pa（怕）+ t（他）+ r（人）→ 他最怕的人是父亲",
    "words": [
      {
        "word": "patron",
        "level": "-",
        "phonetic": "'peitrən",
        "pos": "n.",
        "cn": "赞助人；保护人；恩人",
        "analysis": "patr(父亲) + on → 像父亲一般照顾的人",
        "derivatives": ["patronage (n. 赞助；光顾)", "patronize (v. 赞助；光顾 [四])", "patronizing (a. 要人领情的 [G])"],
        "example_en": "He was lucky to have found a millionaire patron.",
        "example_cn": "他有幸找到了一位百万富翁赞助人。"
      },
      {
        "word": "patriot",
        "level": "-",
        "phonetic": "'peitriət",
        "pos": "n.",
        "cn": "爱国者",
        "analysis": "patr(父亲/祖国) + i + ot → 爱如父亲的祖国者",
        "derivatives": ["patriotism (n. 爱国主义)", "compatriot (n. 同胞；同国人)"],
        "example_en": "He was anxious to show himself patriot.",
        "example_cn": "他急于表明自己是个爱国者。"
      },
      {
        "word": "patriarch",
        "level": "-",
        "phonetic": "'peitria:k",
        "pos": "n.",
        "cn": "家长；元老；大主教",
        "analysis": "patr(父亲) + i + arch(统治)",
        "derivatives": ["patriarchy (n. 父权政治)"],
        "example_en": "Her patriarch is strict with her.",
        "example_cn": "她的家长对她要求很严。"
      },
      {
        "word": "patrimony",
        "level": "G",
        "phonetic": "'pætriməni",
        "pos": "n.",
        "cn": "祖传财产；遗产",
        "analysis": "patri(父亲) + mony(物质/状态)",
        "derivatives": ["patrimonial (a. 祖传的 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "repatriate",
        "level": "-",
        "phonetic": "ri:'pætrieit",
        "pos": "v.",
        "cn": "遣返回国",
        "analysis": "re(回) + patr(父亲/祖国) + i + ate",
        "derivatives": ["repatriation (n. 遣送回国 [G])", "expatriate (v. 逐出国门)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "patrician",
        "level": "-",
        "phonetic": "pə'triʃən",
        "pos": "n.",
        "cn": "贵族",
        "analysis": "patr(父亲) + ician(人) → 像大爷/父亲一样的人",
        "derivatives": ["paternal (a. 父亲的 [G])", "paternity (n. 父系 [G])", "paternalism (n. 家长式管理 [G])", "paternalistic (a. 家长作风的)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "ped",
    "meaning": "脚、儿童",
    "mnemonic": "ped读“派的”→ 派你去哪儿都得用脚走（脚）；读“拍的”→ 儿童需要拍拍抚慰（儿童，引申为教育）",
    "words": [
      {
        "word": "expedition",
        "level": "四",
        "phonetic": "ekspi'diʃən",
        "pos": "n.",
        "cn": "远征；探险",
        "analysis": "ex(出) + ped(脚) + ition → 出去用脚丈量世界",
        "derivatives": ["expeditionary (a. 远征的)", "expedite (v. 加快；促进)", "expeditious (a. 迅速的)", "expediter (n. 促进者)"],
        "example_en": "They did an expedition to the Himalayas.",
        "example_cn": "他们到喜马拉雅山去考察了一次。"
      },
      {
        "word": "pedal",
        "level": "-",
        "phonetic": "'pedl",
        "pos": "a. / n. / v.",
        "cn": "脚的；踏板；骑车",
        "analysis": "ped(脚) + al(形容词/名词后缀)",
        "derivatives": ["backpedal (v. 倒踏脚踏板)"],
        "example_en": "I saw him pedal to school every morning.",
        "example_cn": "我看到他每天早晨骑自行车上学。"
      },
      {
        "word": "peddle",
        "level": "-",
        "phonetic": "'pedl",
        "pos": "v.",
        "cn": "挑卖；挨门叫卖",
        "analysis": "ped(脚/走) + dle → 走街串巷",
        "derivatives": ["peddler (n. 小贩)"],
        "example_en": "He peddled ice cream on the street corner.",
        "example_cn": "他在街角叫卖冰淇淋。"
      },
      {
        "word": "pedestal",
        "level": "四",
        "phonetic": "'pedistəl",
        "pos": "n.",
        "cn": "基架；底座",
        "analysis": "ped(脚) + est + al → 最底下像脚一样的东西",
        "derivatives": [],
        "example_en": "The statue reposes on a pedestal.",
        "example_cn": "塑像安放在台座上。"
      },
      {
        "word": "expedient",
        "level": "六",
        "phonetic": "iks'pi:diənt",
        "pos": "a.",
        "cn": "方便的；权宜的",
        "analysis": "ex(出) + ped(脚) + i + ent → 迈出脚而不走",
        "derivatives": ["expediency (n. 权宜；方便)"],
        "example_en": "I thought it expedient to tell her about it.",
        "example_cn": "我认为将此事告诉她为好。"
      },
      {
        "word": "centipede",
        "level": "-",
        "phonetic": "'sentipi:d",
        "pos": "n.",
        "cn": "蜈蚣",
        "analysis": "centi(百) + ped(脚)",
        "derivatives": ["biped (a. 两足的 [四])", "bipedal (a. 两足动物的)", "quadruped (a. 四足动物)", "millipede (n. 百足虫)"],
        "example_en": "A centipede snaked swiftly away.",
        "example_cn": "一只蜈蚣飞快地爬开了。"
      },
      {
        "word": "impede",
        "level": "-",
        "phonetic": "im'pi:d",
        "pos": "vt.",
        "cn": "妨碍；阻碍",
        "analysis": "im(里) + ped(脚) + e → 伸一只脚在里面绊倒",
        "derivatives": ["impediment (n. 阻碍；阻碍物 [G])", "pedestrian (a. 步行的；步行者 [初])"],
        "example_en": "The attempt to rescue the climbers was impeded by bad weather.",
        "example_cn": "救援登山者的努力因天气恶劣而受阻。"
      },
      {
        "word": "pedagogy",
        "level": "G",
        "phonetic": "'pedəgogi",
        "pos": "n.",
        "cn": "教学法；教育学",
        "analysis": "ped(儿童/教育) + agog(引导) + y",
        "derivatives": ["pedant (n. 书呆子 [托])", "pedantry (n. 迁腐；假学问 [G])", "pedantic (a. 卖弄学问的 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "pediatrics",
        "level": "-",
        "phonetic": "pi:di'ætriks",
        "pos": "n.",
        "cn": "小儿科",
        "analysis": "ped(儿童) + i + atrics(医学)",
        "derivatives": ["pediatrician (n. 儿科医生)", "pediatrist (n. 儿科医生)", "pedology (n. 儿科学)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "encyclopedia",
        "level": "-",
        "phonetic": "en,saikləu'pi:djə",
        "pos": "n.",
        "cn": "百科全书",
        "analysis": "en(使) + cycl(圈) + o + ped(教育) + ia → 全方位教育之书",
        "derivatives": ["encyclopedist (n. 百科全书编纂者)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "orthopedics",
        "level": "-",
        "phonetic": "o:θəu'pi:diks",
        "pos": "n.",
        "cn": "矫形术；骨科",
        "analysis": "orth(正) + o + ped(儿童/发育) + ics → 把骨骼发育归正",
        "derivatives": ["orthopedist (n. 整形外科医生 [G])", "podiatrist (n. 足病医生)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "pel, puls",
    "meaning": "驱动，推",
    "mnemonic": "pel读“派呦”→ 强行派出去；puls形似 pull（拉扯）→ 驱动、推",
    "words": [
      {
        "word": "compel",
        "level": "四",
        "phonetic": "kəm'pel",
        "pos": "vt.",
        "cn": "强迫",
        "analysis": "com(一起) + pel(推)",
        "derivatives": ["compulsion (n. 强制)", "compulsive (a. 强制的 [四])", "compulsory (a. 强制性的)", "compelling (a. 激发兴趣的 [四])"],
        "example_en": "They often compelled us to work twelve or fourteen hours a day.",
        "example_cn": "他们常常强迫我们每天工作十二或十四小时。"
      },
      {
        "word": "expel",
        "level": "-",
        "phonetic": "iks'pel",
        "pos": "vt.",
        "cn": "开除；驱逐",
        "analysis": "ex(出) + pel(推)",
        "derivatives": ["expulsion (n. 驱逐)"],
        "example_en": "He was expelled from the club.",
        "example_cn": "他被俱乐部除名了。"
      },
      {
        "word": "propel",
        "level": "四",
        "phonetic": "prə'pel",
        "pos": "vt.",
        "cn": "推进",
        "analysis": "pro(向前) + pel(推)",
        "derivatives": ["propulsion (n. 推进)", "propulsive (a. 推进的)", "propeller (n. 推进器)", "propellant (n. 推进物)"],
        "example_en": "We are propelled to go forward.",
        "example_cn": "我们被推着向前走。"
      },
      {
        "word": "repel",
        "level": "四",
        "phonetic": "ri'pel",
        "pos": "vt.",
        "cn": "击退；排斥；使反感",
        "analysis": "re(回) + pel(推)",
        "derivatives": ["repulse (n./v. 打退；击退)", "repulsion (n. 拒绝；反感)", "repulsive (a. 排斥的)", "repellent (n. 防水剂；排斥物)"],
        "example_en": "A country must have the will to repel any invader.",
        "example_cn": "一个国家得有决心击退任何入侵者。"
      },
      {
        "word": "impel",
        "level": "-",
        "phonetic": "im'pel",
        "pos": "vt.",
        "cn": "推进；驱动",
        "analysis": "im(内) + pel(推) → 从内向外推动",
        "derivatives": ["impulse (n. 冲动；刺激)", "impulsive (a. 冲动的)"],
        "example_en": "The wind impelled the boat toward the shore.",
        "example_cn": "风把船吹向岸边。"
      },
      {
        "word": "dispel",
        "level": "-",
        "phonetic": "-",
        "pos": "v.",
        "cn": "驱散",
        "analysis": "dis(分开) + pel(推) → 推开分散",
        "derivatives": ["pulse (n. 脉搏；脉冲 [四])", "pulsation (n. 悸动)", "pulsate (v. 颤动 [G])", "pulsar (n. 脉冲星 [G])", "appellant (n. 上诉人)", "appellate (a. 上诉的 [G])", "appellation (n. 称呼；名称 [G])"],
        "example_en": "The sun soon dispelled the mist.",
        "example_cn": "太阳不久就驱散了薄雾。"
      }
    ]
  },
  {
    "root": "pen, pun",
    "meaning": "惩罚",
    "mnemonic": "pen读“判”→ 判刑是对罪犯的惩罚；pun拼音“曝”+门 → 曝尸于门 → 惩罚",
    "words": [
      {
        "word": "punish",
        "level": "初",
        "phonetic": "'pʌniʃ",
        "pos": "v.",
        "cn": "惩罚",
        "analysis": "pun(惩罚) + ish(动词后缀)",
        "derivatives": ["impunity (n. 不受刑罚；免罚)"],
        "example_en": "If it were not for his presence, I would punish you.",
        "example_cn": "要不是他在场，我会处罚你的。"
      },
      {
        "word": "penal",
        "level": "-",
        "phonetic": "'pi:nəl",
        "pos": "a.",
        "cn": "刑罚的；受刑的",
        "analysis": "pen(惩罚) + al(形容词后缀)",
        "derivatives": ["penalty (n. 惩罚 [初])", "penalize (v. 宣告有罪；处罚)", "penology (n. 刑罚学 [G])", "penologist (n. 刑罚学者 [G])"],
        "example_en": "I do not wish, however, to embark upon the subject of penal reform.",
        "example_cn": "但我并不想在此谈论刑法改革。"
      },
      {
        "word": "penitence",
        "level": "-",
        "phonetic": "'penitəns",
        "pos": "n.",
        "cn": "忏悔；后悔",
        "analysis": "pen(惩罚) + it + ence → 惩罚后深省",
        "derivatives": ["penitent (a. 后悔的 [G])", "impenitent (a. 无悔意的；顽迷的)", "penitentiary (n. 听悔僧；监狱/感化院)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "repent",
        "level": "四",
        "phonetic": "ri'pent",
        "pos": "vi.",
        "cn": "后悔；悔改",
        "analysis": "re(反复) + pen(惩罚) + t → 反复惩罚内心",
        "derivatives": ["repentance (n. 悔改)", "repentant (a. 悔改的)"],
        "example_en": "You should repent and start anew.",
        "example_cn": "你应悔过自新。"
      },
      {
        "word": "subpoena",
        "level": "G",
        "phonetic": "səb'pi:nə",
        "pos": "n.",
        "cn": "传票",
        "analysis": "sub(在……下) + pen(惩罚) + a → 不从则在法律下受惩罚",
        "derivatives": ["penance (n. 赎罪；自我惩罚)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "pend, pens (1)",
    "meaning": "花费",
    "mnemonic": "pend读：“盼的”→ 盼望发工资，不够花费；pens读：“盼死”",
    "words": [
      {
        "word": "expend",
        "level": "四",
        "phonetic": "iks'pend",
        "pos": "v.",
        "cn": "花费；消耗；支出",
        "analysis": "ex(出) + pend(花费) → 花钱出去",
        "derivatives": ["expenditure (n. 支出；开销)", "expendable (a. 可消耗的)", "expense (n. 费用；代价 [四])", "expensive (a. 昂贵的 [初])", "inexpensive (a. 便宜的 [四])"],
        "example_en": "He lived high and expended largely.",
        "example_cn": "他生活讲究，花费很大。"
      },
      {
        "word": "spend",
        "level": "初",
        "phonetic": "spend",
        "pos": "v.",
        "cn": "花费",
        "analysis": "expend变体(ex→s)",
        "derivatives": ["spending (n. 花费)", "misspend (v. 浪费)", "overspend (v. 超支)", "outspend (v. 过度使用)"],
        "example_en": "I spent $100 on the bike.",
        "example_cn": "我花了一百美元买下那辆自行车。"
      },
      {
        "word": "pension",
        "level": "四",
        "phonetic": "'penʃən",
        "pos": "n.",
        "cn": "年金；养老金；退休金",
        "analysis": "pens(花费) + ion → 养老花费的钱",
        "derivatives": ["pensioner (n. 领养老金的人 [四])"],
        "example_en": "She supplements her pension by taking in washing.",
        "example_cn": "她在家里替人洗衣服以贴补养老金之不足。"
      },
      {
        "word": "pensive",
        "level": "G",
        "phonetic": "'pensiv",
        "pos": "a.",
        "cn": "沉思的；愁眉苦脸的",
        "analysis": "pens(花费) + ive → 想到花费发愁",
        "derivatives": [],
        "example_en": "The painting can inspire a pensive mood.",
        "example_cn": "这幅画能引人沉思。"
      },
      {
        "word": "dispense",
        "level": "四",
        "phonetic": "dis'pens",
        "pos": "v.",
        "cn": "分配；分发；配药",
        "analysis": "dis(分开) + pens(花费) + e → 把钱财/药物分发",
        "derivatives": ["dispenser (n. 药剂师)", "dispensary (n. 药房 [四])", "dispensation (n. 分配；施与)", "indispensable (a. 不可缺少的 [四])"],
        "example_en": "The doctor dispensed a prescription to his patient.",
        "example_cn": "医生开处方给病人配药。"
      },
      {
        "word": "compensate",
        "level": "四",
        "phonetic": "'kompənseit",
        "pos": "v.",
        "cn": "补偿；赔偿；酬劳",
        "analysis": "com(全部) + pens(花费) + ate → 花费全部获得补足",
        "derivatives": ["compensation (n. 补偿；赔偿)", "compensatory (a. 赔偿的)", "overcompensate (v. 补偿过度)", "overcompensation (n. 过度补偿)"],
        "example_en": "Who will compensate for the losses?",
        "example_cn": "谁将赔偿损失？"
      },
      {
        "word": "recompense",
        "level": "-",
        "phonetic": "'rekəmpəns",
        "pos": "n. / v.",
        "cn": "回报；报酬；赔偿",
        "analysis": "re(回) + compense(报酬)",
        "derivatives": ["propensity (n. 倾向；习性)", "propend (ad. 倾向于)", "stipend (n. 津贴；奖学金)"],
        "example_en": "The insurance company will recompense his loss.",
        "example_cn": "保险公司将赔偿他的损失。"
      }
    ]
  },
  {
    "root": "pend, pens (2)",
    "meaning": "悬挂，引申为称重",
    "mnemonic": "心悬挂着如盼望（pend），挂秤砣引申为称重（pond）",
    "words": [
      {
        "word": "suspend",
        "level": "四",
        "phonetic": "səs'pend",
        "pos": "v.",
        "cn": "悬吊；暂停；中止",
        "analysis": "sus(下) + pend(挂) → 挂在下面",
        "derivatives": ["suspension (n. 悬挂；中止)", "suspense (n. 悬念；焦虑)", "suspenseful (a. 悬疑的)", "suspenders (n. 吊裤带)"],
        "example_en": "The policeman was suspended while the complaint was investigated.",
        "example_cn": "因该警察遭投诉，在调查期间已令其暂停职务。"
      },
      {
        "word": "pendent",
        "level": "G",
        "phonetic": "'pendənt",
        "pos": "a.",
        "cn": "下垂的；吊着的",
        "analysis": "pend(挂) + ent(形容词后缀)",
        "derivatives": ["pendant (n. 下垂物；垂饰)", "pendulous (a. 下垂的)", "pendulum (n. 钟摆)"],
        "example_en": "My necklace has a heart pendant, but I don't wear it everyday.",
        "example_cn": "我的项链有一个心形的垂饰，但我并非每天都戴它。"
      },
      {
        "word": "append",
        "level": "-",
        "phonetic": "ə'pend",
        "pos": "v.",
        "cn": "附加；添加；悬挂",
        "analysis": "ap(强调) + pend(挂)",
        "derivatives": ["appendix (n. 附录；阑尾)", "appendage (n. 附属物 [G])", "appendicitis (n. 阑尾炎)", "appendectomy (n. 阑尾切除术)"],
        "example_en": "A new clause was appended to the treaty.",
        "example_cn": "条约上附加了一项新条款。"
      },
      {
        "word": "depend",
        "level": "初",
        "phonetic": "di'pend",
        "pos": "v.",
        "cn": "依靠；信赖",
        "analysis": "de(强调) + pend(挂) → 紧紧挂在上面",
        "derivatives": ["dependent (a. 依赖的)", "dependence (n. 依赖)", "dependency (n. 属国)", "dependable (a. 可靠的)", "dependability (n. 可靠性 [四])", "independent (a. 独立的 [研])", "independence (n. 独立 [研])", "interdependent (a. 相互依赖的)", "interdependence (n. 相互依赖)"],
        "example_en": "I knew he wasn't to be depended upon.",
        "example_cn": "我知道他不可信赖。"
      },
      {
        "word": "ponder",
        "level": "四",
        "phonetic": "'pondə",
        "pos": "v.",
        "cn": "沉思；考虑",
        "analysis": "pond(pend变体：悬挂/称量) → 在心里面称量",
        "derivatives": ["ponderable (a. 可称的 [研])", "imponderable (a. 不可估计的)", "ponderous (a. 笨重的 [托])", "preponderate (v. 占优势 [正])", "preponderance (n. 优势)", "preponderant (a. 占优势的 [研])", "ponderance (n. 重要)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "perpendicular",
        "level": "-",
        "phonetic": "pə:pən'dikjulə",
        "pos": "a. / n.",
        "cn": "垂直的；直立的；垂直线",
        "analysis": "per(全部) + pend(挂) + icular → 竖直下垂",
        "derivatives": ["pending (a. 悬而未决的)", "impending (a. 即将发生的；迫切的)", "compendium (n. 简要；概略 [G])"],
        "example_en": "The wall is a little out of the perpendicular.",
        "example_cn": "那墙有点斜。"
      }
    ]
  },
  {
    "root": "per",
    "meaning": "冒险，危险",
    "mnemonic": "per读“魄”→ 冒险需要魄力",
    "words": [
      {
        "word": "experience",
        "level": "初",
        "phonetic": "iks'piəriəns",
        "pos": "n. / v.",
        "cn": "经历；经验",
        "analysis": "ex(出) + per(冒险) + ience → 尝试冒险得来的东西",
        "derivatives": ["experienced (a. 有经验的 [初])", "inexperience (n. 无经验 [初])"],
        "example_en": "She had no experience of life at all.",
        "example_cn": "她毫无生活经验。"
      },
      {
        "word": "experiment",
        "level": "初",
        "phonetic": "iks'perimənt",
        "pos": "n. / v.",
        "cn": "实验；尝试",
        "analysis": "ex(出) + per(冒险) + i + ment",
        "derivatives": ["experimentation (n. 实验)", "experimentalism (n. 经验主义)"],
        "example_en": "We will do a chemical experiment this Friday.",
        "example_cn": "这个周五我们要做化学实验。"
      },
      {
        "word": "peril",
        "level": "四",
        "phonetic": "'peril",
        "pos": "n. / v.",
        "cn": "危险；冒险",
        "analysis": "per(冒险) + il",
        "derivatives": ["perilous (a. 危险的)", "imperil (v. 使陷于危险)"],
        "example_en": "You are in great peril.",
        "example_cn": "你的处境极其危险。"
      },
      {
        "word": "empiric",
        "level": "-",
        "phonetic": "em'pirik",
        "pos": "n.",
        "cn": "经验主义者",
        "analysis": "em(使) + pir(per 经验) + ic",
        "derivatives": ["empirical (a. 靠经验办事的)", "empiricism (n. 经验主义)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "pet",
    "meaning": "追寻，寻求",
    "mnemonic": "单词pet（宠物）→ 宠物永远追寻主人 → 追寻",
    "words": [
      {
        "word": "compete",
        "level": "初",
        "phonetic": "kəm'pi:t",
        "pos": "v.",
        "cn": "竞争；竞赛",
        "analysis": "com(共同) + pet(寻求) + e → 共同追求同一目标",
        "derivatives": ["competition (n. 比赛 [四])", "competitor (n. 竞争者 [四])", "competitive (a. 竞争性的)", "noncompetitive (a. 非竞争性的)", "competence (n. 资格能力)", "competent (a. 有能力的 [四])", "incompetence (n. 无能)", "incompetent (a. 无能的)"],
        "example_en": "Companies must be able to compete in the market.",
        "example_cn": "公司一定要在市场中有竞争力。"
      },
      {
        "word": "appetite",
        "level": "四",
        "phonetic": "'æpitait",
        "pos": "n.",
        "cn": "欲望；胃口；嗜好",
        "analysis": "ap(强调) + pet(寻求) + ite → 极力追寻想要的东西",
        "derivatives": ["appetizer (n. 开胃食品)", "appetizing (a. 开胃的)", "unappetizing (a. 引不起食欲的)"],
        "example_en": "At the moment she had no appetite for gossip.",
        "example_cn": "此时此刻她无心闲聊。"
      },
      {
        "word": "petition",
        "level": "-",
        "phonetic": "pi'tiʃən",
        "pos": "n.",
        "cn": "请愿；申请",
        "analysis": "pet(寻求) + ition",
        "derivatives": ["petitioner (n. 请愿者)"],
        "example_en": "Many subscribers' names are in the petition.",
        "example_cn": "请愿书上有很多签名者的名字。"
      },
      {
        "word": "impetus",
        "level": "-",
        "phonetic": "'impitəs",
        "pos": "n.",
        "cn": "冲力；推动力",
        "analysis": "im(使) + pet(寻求) + us",
        "derivatives": ["impetuous (a. 冲动的)", "impetigo (n. 小脓疱疹 [六])", "centripetal (a. 向心的)"],
        "example_en": "The president's plan gave fresh impetus to industry.",
        "example_cn": "总统的计划进一步推动了工业的发展。"
      },
      {
        "word": "perpetual",
        "level": "六",
        "phonetic": "pə'petjuəl",
        "pos": "a.",
        "cn": "永久的；长期的",
        "analysis": "per(自始至终) + pet(寻求) + u + al → 从头到尾追寻",
        "derivatives": ["perpetuate (v. 使永久；不朽)", "perpetuation (n. 永存)", "perpetuity (n. 永恒 [六])"],
        "example_en": "Double agents live in a perpetual state of fear.",
        "example_cn": "两面派永远过着提心吊胆的生活。"
      },
      {
        "word": "petulant",
        "level": "-",
        "phonetic": "'petjulənt",
        "pos": "a.",
        "cn": "暴躁的；易怒的",
        "analysis": "pet(寻求) + ulant(多) → 追求太多太急导致性子急躁",
        "derivatives": ["petulance (n. 易怒)"],
        "example_en": "The expression around her mouth was petulant.",
        "example_cn": "她的嘴角露出一种任性的表情。"
      },
      {
        "word": "repeat",
        "level": "初",
        "phonetic": "-",
        "pos": "v.",
        "cn": "重复；反复",
        "analysis": "re(反复) + peat(pet变体 寻求)",
        "derivatives": ["repetition (n. 重复)", "repeated (a. 重复的 [四])", "repeatedly (ad. 重复地)", "repetitive (a. 重复的 [托])", "repetitious (a. 啰嗦反复的)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "propitiate",
        "level": "G",
        "phonetic": "prə'piʃieit",
        "pos": "v.",
        "cn": "抚慰；安抚；取悦",
        "analysis": "pro(前) + pit(pet) + i + ate → 寻求回到以前的友好",
        "derivatives": ["propitious (a. 吉利的；顺利的)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "phag",
    "meaning": "吃",
    "mnemonic": "读：“佛格”→ 佛龛的格子上摆满了吃的供品",
    "words": [
      {
        "word": "zoophagous",
        "level": "G",
        "phonetic": "zəu'ofəgəs",
        "pos": "a.",
        "cn": "食肉的；食肉动物的",
        "analysis": "zoo(动物) + phag(吃) + ous",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "phytophagous",
        "level": "G",
        "phonetic": "fai'tofəgəs",
        "pos": "a.",
        "cn": "食植物的；食叶类的",
        "analysis": "phyto(植物) + phag(吃) + ous",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "anthropophagous",
        "level": "-",
        "phonetic": "ænθrə'pofəgəs",
        "pos": "a.",
        "cn": "食人肉的",
        "analysis": "anthrop(人类) + o + phag(吃) + ous",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "esophagus",
        "level": "-",
        "phonetic": "i(:)'sofəgəs",
        "pos": "n.",
        "cn": "食道",
        "analysis": "eso(通道) + phag(吃) + us",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "sarcophagus",
        "level": "G",
        "phonetic": "sa:'kofəgəs",
        "pos": "n.",
        "cn": "石棺",
        "analysis": "sarc(肉) + o + phag(吃) + us → 吞噬尸肉之石",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "phil",
    "meaning": "爱",
    "mnemonic": "来自Philip（飞利浦）→ 飞利浦家电人人爱 → 爱",
    "words": [
      {
        "word": "philosophy",
        "level": "-",
        "phonetic": "fi'losəfi",
        "pos": "n.",
        "cn": "哲学",
        "analysis": "phil(爱) + o + soph(智慧) + y → 爱智慧",
        "derivatives": [],
        "example_en": "He majors in philosophy.",
        "example_cn": "他主修哲学。"
      },
      {
        "word": "philanthropy",
        "level": "六",
        "phonetic": "fi'lænθrəpi",
        "pos": "n.",
        "cn": "博爱；慈善",
        "analysis": "phil(爱) + anthrop(人类) + y",
        "derivatives": [],
        "example_en": "She committed herself to philanthropy.",
        "example_cn": "她专心从事慈善事业。"
      },
      {
        "word": "zoophilous",
        "level": "-",
        "phonetic": "zəu'ofiləs",
        "pos": "a.",
        "cn": "爱护动物的",
        "analysis": "zoo(动物) + phil(爱) + ous",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "philology",
        "level": "研",
        "phonetic": "fi'lolədʒi",
        "pos": "n.",
        "cn": "语言学",
        "analysis": "philo(爱) + log(语言/说话) + y",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "neophilia",
        "level": "-",
        "phonetic": "ni:əu'filia",
        "pos": "n.",
        "cn": "喜新成癖",
        "analysis": "neo(新) + phil(爱) + ia(病态)",
        "derivatives": ["philogynist (n. 喜爱女人者 [G])", "bibliophile (n. 爱书者 [托])", "bibliophilist (n. 爱书者 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "hemophilia",
        "level": "G",
        "phonetic": ",hi:mə'filiə",
        "pos": "n.",
        "cn": "血友病",
        "analysis": "hemo(血) + phil(爱/亲和) + ia(病)",
        "derivatives": ["hemophilic (a. 血友病的 [G])", "hemophiliac (a. 血友病的 [G])"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "phon",
    "meaning": "声音",
    "mnemonic": "phon读“风”→ 声音是由风（空气振动）发出的",
    "words": [
      {
        "word": "microphone",
        "level": "四",
        "phonetic": "'maikrəfəun",
        "pos": "n.",
        "cn": "麦克风；话筒",
        "analysis": "micro(微小) + phon(声音) + e → 把小声音放大",
        "derivatives": ["megaphone (n. 扩音器 [G])", "phone (n. 电话 [初])", "telephone (n. 电话 [四])", "radiotelephone (n. 无线电话)", "phonograph (n. 留声机 [初])"],
        "example_en": "He is talking into a microphone.",
        "example_cn": "他正在对着麦克风讲话。"
      },
      {
        "word": "symphony",
        "level": "-",
        "phonetic": "'simfəni",
        "pos": "n.",
        "cn": "交响乐；交响乐团",
        "analysis": "sym(一起) + phon(声音) + y → 所有乐器一同发声",
        "derivatives": [],
        "example_en": "He conducts a symphony.",
        "example_cn": "他指挥一个交响乐团。"
      },
      {
        "word": "phonetics",
        "level": "-",
        "phonetic": "fəu'netiks",
        "pos": "n.",
        "cn": "语音学",
        "analysis": "phon(声音) + etics(学科)",
        "derivatives": ["phonetic (a. 语音的 [G])", "phonics (n. 拼音教学法)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "euphony",
        "level": "G",
        "phonetic": "'ju:fəni",
        "pos": "n.",
        "cn": "好听的声音；和谐的声音",
        "analysis": "eu(优美) + phon(声音) + y",
        "derivatives": ["euphonious (a. 声音悦耳的 [四])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "cacophony",
        "level": "-",
        "phonetic": "kæ'kofəni",
        "pos": "n.",
        "cn": "刺耳的声音；杂音",
        "analysis": "caco(卡壳/坏) + phon(声音) + y",
        "derivatives": [],
        "example_en": "From its cacophony of sound, the room has suddenly become very still.",
        "example_cn": "本来众声嘈杂的屋子里，突然变得非常肃静。"
      },
      {
        "word": "homophone",
        "level": "-",
        "phonetic": "'homəfəun",
        "pos": "n.",
        "cn": "同音字",
        "analysis": "homo(相同) + phon(声音) + e",
        "derivatives": ["monophonic (a. 单声道的)", "stereophonic (a. 立体声的 [G])", "phony (a. 假的 [G])"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "plat",
    "meaning": "平坦",
    "mnemonic": "形似 flat（平坦的）",
    "words": [
      {
        "word": "plate",
        "level": "初",
        "phonetic": "pleit",
        "pos": "n. / v.",
        "cn": "盘子；电镀；金属板",
        "analysis": "plat(平坦) + e → 中间平坦之器皿",
        "derivatives": ["plated (a. 镀金的 [初])", "plating (n. 镀金 [四])", "electroplate (v. 电镀)", "electroplating (v. 电镀 [正])"],
        "example_en": "His plate was piled high with rice.",
        "example_cn": "他的盘子里盛满了米饭。"
      },
      {
        "word": "plateau",
        "level": "-",
        "phonetic": "'plætəu",
        "pos": "n.",
        "cn": "高原；平顶",
        "analysis": "plat(平坦) + eau(名词后缀)",
        "derivatives": [],
        "example_en": "They have been herding cattle on the plateau for generations.",
        "example_cn": "他们世世代代在这高原上放牧。"
      },
      {
        "word": "platitude",
        "level": "正",
        "phonetic": "'plætitju:d",
        "pos": "n.",
        "cn": "陈词滥调",
        "analysis": "plat(平坦) + itude(状态) → 语言平铺直叙毫无波澜新意",
        "derivatives": [],
        "example_en": "It's no more than a platitude.",
        "example_cn": "无非是老生常谈。"
      },
      {
        "word": "platform",
        "level": "初",
        "phonetic": "'plætfo:m",
        "pos": "n.",
        "cn": "月台；讲台；平台",
        "analysis": "plat(平坦) + form(形状)",
        "derivatives": [],
        "example_en": "Please buy me a platform ticket.",
        "example_cn": "请给我买张站台票。"
      }
    ]
  },
  {
    "root": "ple, pli, ply",
    "meaning": "满，填满",
    "mnemonic": "ple（pao le 跑了）→ 水满了溢出跑了；pli/ply 发音近 ple",
    "words": [
      {
        "word": "plenty",
        "level": "初",
        "phonetic": "'plenti",
        "pos": "n.",
        "cn": "大量；丰富",
        "analysis": "ple(满) + n + ty",
        "derivatives": ["plentiful (a. 丰富的)", "plenteous (a. 许多的 [G])", "plentitude (n. 充足)", "plenary (a. 充分的 [四])", "aplenty (a. 丰富的 [四])"],
        "example_en": "He has plenty of humorous stories to tell.",
        "example_cn": "他有许多幽默故事可讲。"
      },
      {
        "word": "replenish",
        "level": "四",
        "phonetic": "ri'pleniʃ",
        "pos": "v.",
        "cn": "补充；再装满",
        "analysis": "re(再) + plen(满) + ish",
        "derivatives": ["replenishment (n. 再次装满)", "deplenish (v. 倒空；弄空)"],
        "example_en": "We need to replenish our stocks of coal.",
        "example_cn": "我们需要再次补充煤的储备。"
      },
      {
        "word": "complete",
        "level": "四",
        "phonetic": "kəm'pli:t",
        "pos": "a. / v.",
        "cn": "完全的；完成",
        "analysis": "com(全部) + ple(满) + te → 全部装满不留缝隙",
        "derivatives": ["incomplete (a. 不完全的)", "completion (n. 完成)"],
        "example_en": "A more complete study of the subject is needed.",
        "example_cn": "对这个问题需要做更加彻底的研究。"
      },
      {
        "word": "replete",
        "level": "G",
        "phonetic": "ri'pli:t",
        "pos": "a.",
        "cn": "充满的；吃饱的",
        "analysis": "re(再) + ple(满) + te",
        "derivatives": ["repletion (n. 充满)", "expletive (a. 填补的 n. 填补物 [G])", "plethora (n. 过量；过剩)"],
        "example_en": "His story was replete with falsehood.",
        "example_cn": "他的报道充满了虚伪。"
      },
      {
        "word": "complement",
        "level": "四",
        "phonetic": "'komplimənt",
        "pos": "n.",
        "cn": "补足；补全",
        "analysis": "com(全部) + ple(满) + ment",
        "derivatives": ["complementary (a. 补充的)"],
        "example_en": "Homework is a necessary complement to classroom study.",
        "example_cn": "家庭作业是课堂教学的必要补充。"
      },
      {
        "word": "supplement",
        "level": "-",
        "phonetic": "'sʌplimənt",
        "pos": "n.",
        "cn": "增补；补充",
        "analysis": "sup(下) + ple(填满) + ment → 从下面补满",
        "derivatives": ["supplementary (a. 补足的)", "supplemental (a. 补充的)"],
        "example_en": "The money they get from fruit-picking is often a supplement to incomes earned in the town.",
        "example_cn": "他们靠采摘水果所得的钱是城里所挣收入的补贴。"
      },
      {
        "word": "supply",
        "level": "初",
        "phonetic": "sə'plai",
        "pos": "v. / n.",
        "cn": "供给；补给",
        "analysis": "sup(下) + ply(填满)",
        "derivatives": ["supplier (n. 供应者)"],
        "example_en": "We supply power to the three nearby towns.",
        "example_cn": "我们对附近的三个城镇提供电力。"
      },
      {
        "word": "implement",
        "level": "四",
        "phonetic": "'implimənt",
        "pos": "n. / vt.",
        "cn": "工具；实施；执行",
        "analysis": "im(强调) + ple(填满) + ment → 落实填满",
        "derivatives": ["implementation (n. 实行 [四])"],
        "example_en": "We need money to implement the program.",
        "example_cn": "我们需要钱来实行这个计划。"
      },
      {
        "word": "accomplish",
        "level": "四",
        "phonetic": "ə'kʌmpliʃ",
        "pos": "v.",
        "cn": "实现；达到；完成",
        "analysis": "ac(强调) + com(全) + pli(装满) + ish",
        "derivatives": ["accomplishment (n. 成就)", "accomplished (a. 有成就的)", "unaccomplished (a. 未完成的 [四])"],
        "example_en": "They didn't accomplish the purpose desired.",
        "example_cn": "他们没有达到预期的目的。"
      },
      {
        "word": "compliment",
        "level": "四",
        "phonetic": "'komplimənt",
        "pos": "v.",
        "cn": "赞扬；恭维",
        "analysis": "com(一起) + pli(装满/赞美) + ment",
        "derivatives": ["complimentary (a. 称赞的)", "uncomplimentary (a. 贬降的)", "deplete (v. 耗尽)"],
        "example_en": "She gave a coy smile when he paid her a compliment.",
        "example_cn": "他恭维她时，她扭捏作态地笑了笑。"
      }
    ]
  },
  {
    "root": "plor",
    "meaning": "喊，哭",
    "mnemonic": "读：“扑老”→ 扑到老人怀里大哭",
    "words": [
      {
        "word": "explore",
        "level": "-",
        "phonetic": "iks'plo:",
        "pos": "v.",
        "cn": "探险；探测；探究",
        "analysis": "ex(出) + plor(喊) + e → 边大喊壮胆边走向野外",
        "derivatives": ["explorer (n. 探险家)", "exploration (n. 探索)", "exploratory (a. 探险的)"],
        "example_en": "He had an itch to get away and explore.",
        "example_cn": "他等不及要动身去探险。"
      },
      {
        "word": "implore",
        "level": "-",
        "phonetic": "im'plo:",
        "pos": "v.",
        "cn": "恳求；哀求",
        "analysis": "im(在内) + plor(喊) + e → 心中哭喊哀求",
        "derivatives": [],
        "example_en": "I implore you to go now.",
        "example_cn": "我恳求你现在就走吧。"
      },
      {
        "word": "deplore",
        "level": "-",
        "phonetic": "di'plo:",
        "pos": "v.",
        "cn": "悲悼；哀叹；痛惜",
        "analysis": "de(坏) + plor(哭喊) + e → 因坏事而哀痛大哭",
        "derivatives": ["deplorable (a. 悲惨的)"],
        "example_en": "We deplore the accident.",
        "example_cn": "我们对这一事故表示悲悼。"
      }
    ]
  },
  {
    "root": "ply, plex, plic",
    "meaning": "重叠，折叠",
    "mnemonic": "ply读：“铺来”→ 铺平别叠在一起；plex=ple(满)+x(+) 满了再加即重叠；plic同音变体",
    "words": [
      {
        "word": "apply",
        "level": "-",
        "phonetic": "ə'plai",
        "pos": "v.",
        "cn": "应用；申请",
        "analysis": "ap(强调) + ply(重叠) → 反复将理论叠加到实践中",
        "derivatives": ["application (n. 申请；应用 [四])", "appliance (n. 器具 [四])", "applicant (n. 申请人 [四])", "applicable (a. 适用的 [六])", "inapplicable (a. 不能应用的 [G])", "applied (a. 实用的 [四])"],
        "example_en": "In this way they can better apply theory to practice.",
        "example_cn": "这样他们就能更好地把理论运用到实践中去。"
      },
      {
        "word": "imply",
        "level": "-",
        "phonetic": "im'plai",
        "pos": "v.",
        "cn": "暗示；意味",
        "analysis": "im(里) + ply(重叠) → 叠在内心底层",
        "derivatives": ["implication (n. 暗示；牵连 [四])", "implicit (a. 含蓄的 [六])", "implicate (v. 牵连；含蓄表达 [研])"],
        "example_en": "I don't wish to imply that you are wrong.",
        "example_cn": "我无意暗示你错了。"
      },
      {
        "word": "reply",
        "level": "-",
        "phonetic": "ri'plai",
        "pos": "n. / v.",
        "cn": "回答；答复",
        "analysis": "re(回) + ply(折叠) → 折叠回信",
        "derivatives": [],
        "example_en": "I had no reply to my letter.",
        "example_cn": "我没收到回信。"
      },
      {
        "word": "comply",
        "level": "-",
        "phonetic": "kəm'plai",
        "pos": "v.",
        "cn": "顺从；答应；遵守",
        "analysis": "com(一起) + ply(重叠) → 思想重叠一致",
        "derivatives": ["compliance (n. 顺从 [四])", "compliant (a. 服从的 [四])", "noncompliance (n. 不服从)"],
        "example_en": "We comply with all fire safety rules.",
        "example_cn": "我们遵守有关消防安全的全部条例。"
      },
      {
        "word": "simply",
        "level": "初",
        "phonetic": "'simpli",
        "pos": "ad.",
        "cn": "简单地；完全",
        "analysis": "sim(单一) + ply(叠) → 单一不复杂重叠",
        "derivatives": ["simple (a. 简单的)", "simplicity (n. 简单 [G])", "simplify (v. 简化 [六])", "oversimplify (v. 过于简单化)"],
        "example_en": "The holidays simply sped by.",
        "example_cn": "假期简直是一晃而过。"
      },
      {
        "word": "complex",
        "level": "-",
        "phonetic": "'kompleks",
        "pos": "a.",
        "cn": "复杂的",
        "analysis": "com(一起) + plex(重叠) → 全重叠交织",
        "derivatives": ["complexity (n. 复杂度 [六])", "complexion (n. 肤色；局面)"],
        "example_en": "The army is an extremely complex organism.",
        "example_cn": "军队是极其复杂的组织。"
      },
      {
        "word": "multiply",
        "level": "-",
        "phonetic": "'mʌltiplai",
        "pos": "v.",
        "cn": "繁殖；增加；乘",
        "analysis": "multi(多) + ply(重叠)",
        "derivatives": ["multiple (a. 复合的 [G])", "multiplex (a. 多样的)", "multiplication (n. 增多；繁殖 [G])", "multiplicity (n. 多样性)", "multiplier (n. 乘数)"],
        "example_en": "Such examples could be multiplied indefinitely.",
        "example_cn": "这样的例子不胜枚举。"
      },
      {
        "word": "perplex",
        "level": "G",
        "phonetic": "pə'pleks",
        "pos": "v.",
        "cn": "使复杂化；使困惑",
        "analysis": "per(完全) + plex(重叠)",
        "derivatives": ["perplexing (a. 令人费解的)", "perplexity (n. 困惑 [六])"],
        "example_en": "His strange behavior had greatly perplexed her.",
        "example_cn": "他的古怪行为使她大惑不解。"
      },
      {
        "word": "supple",
        "level": "G",
        "phonetic": "'sʌpl",
        "pos": "a.",
        "cn": "柔软的；易弯曲的；柔顺的",
        "analysis": "sup(下) + ple(重叠) → 在下面易折叠",
        "derivatives": ["suppliant (a. 哀恳的 [G])", "supplicate (v. 乞求 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "explicate",
        "level": "-",
        "phonetic": "'eksplikeit",
        "pos": "v.",
        "cn": "详细解说；阐明",
        "analysis": "ex(出) + plic(折叠) + ate → 展开解开折叠",
        "derivatives": ["explication (n. 说明 [正])", "explicable (a. 可解释的 [G])", "inexplicable (a. 不能说明的 [正])", "explicit (a. 明白的 [四])", "inexplicit (a. 不明了的)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "duplicate",
        "level": "日",
        "phonetic": "-",
        "pos": "a. / n. / v.",
        "cn": "复制品；二倍的",
        "analysis": "du(二) + plic(重叠) + ate",
        "derivatives": ["duplication (n. 复制)", "duplicative (a. 二重的)", "duplicity (n. 欺骗；狡猾 [G])", "duplicitous (a. 奸诈的)", "duplex (a. 双重的 [六])", "triple (a. 三倍的)", "triplex (a. 三重的)", "triplicate (a. 一式三份的)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "polic, polis, polit",
    "meaning": "国家，城市",
    "mnemonic": "polic读：“坡立四”→ 山坡上耸立着四个城邦城市",
    "words": [
      {
        "word": "police",
        "level": "初",
        "phonetic": "pə'li:s",
        "pos": "n.",
        "cn": "警察；警方",
        "analysis": "polic(城市) + e → 维护城市治安者",
        "derivatives": ["policeman (n. 警察 [初])", "policewoman (n. 女警察)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "politics",
        "level": "初",
        "phonetic": "'politiks",
        "pos": "n.",
        "cn": "政治",
        "analysis": "polit(国家) + ics(学科/事务)",
        "derivatives": ["political (a. 政治的 [初])", "politician (n. 政客 [四])", "politicize (v. 搞政治 [四])", "apolitical (a. 不关心政治的)", "geopolitics (n. 地缘政治学 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "policy",
        "level": "初",
        "phonetic": "'poləsi",
        "pos": "n.",
        "cn": "政策；方针",
        "analysis": "polic(国家) + y → 管理国家的方针",
        "derivatives": ["polity (n. 政府制度 [四])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "metropolis",
        "level": "四",
        "phonetic": "mi'tropəlis",
        "pos": "n.",
        "cn": "大都市；首府",
        "analysis": "metro(母亲) + polis(城市) → 母城、枢纽城市",
        "derivatives": ["metropolitan (n. 大都市居民 [四])", "megalopolis (n. 特大都市)"],
        "example_en": "Beijing is a metropolis in China.",
        "example_cn": "北京是中国的大都市。"
      },
      {
        "word": "cosmopolis",
        "level": "-",
        "phonetic": "koz'mopəlis",
        "pos": "n.",
        "cn": "国际都市",
        "analysis": "cosm(宇宙/世界) + o + polis(城市)",
        "derivatives": ["cosmopolitan (a. 世界性的 [G])", "cosmopolitism (n. 世界主义 [G])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "acropolis",
        "level": "G",
        "phonetic": "ə'kropəlis",
        "pos": "n.",
        "cn": "雅典卫城；城堡",
        "analysis": "acr(高/尖) + o + polis(城市) → 建在最高处的城堡",
        "derivatives": ["necropolis (n. 大墓地 [G])", "politic (a. 精明的 [四])", "impolitic (a. 失策的 [四])"],
        "example_en": "The Acropolis dominates the city of Athens.",
        "example_cn": "雅典的卫城高耸于雅典全城之上。"
      }
    ]
  },
  {
    "root": "pon, pound",
    "meaning": "放置",
    "mnemonic": "pon（破门）→ 踢足球破门就是把球放进门里；pound（英镑）要放置在安全处",
    "words": [
      {
        "word": "propound",
        "level": "研",
        "phonetic": "prə'paund",
        "pos": "v.",
        "cn": "提出；提议",
        "analysis": "pro(提前) + pound(放) → 提前放置出来供讨论",
        "derivatives": ["propone (v. 提议)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "compound",
        "level": "-",
        "phonetic": "'kompaund",
        "pos": "n.",
        "cn": "混合物；化合物",
        "analysis": "com(一起) + pound(放) → 放到一起混合",
        "derivatives": [],
        "example_en": "Medicines are usually compounds.",
        "example_cn": "药品通常是化合物。"
      },
      {
        "word": "expound",
        "level": "G",
        "phonetic": "iks'paund",
        "pos": "v.",
        "cn": "详细说明",
        "analysis": "ex(出) + pound(放) → 把含义讲出来放置于眼前",
        "derivatives": ["exponent (n. 讲解者；指数)", "exponential (a. 指数的 [四])"],
        "example_en": "He expounded the reasons why he did it.",
        "example_cn": "他阐述了他做这件事的理由。"
      },
      {
        "word": "impound",
        "level": "G",
        "phonetic": "im'paund",
        "pos": "v.",
        "cn": "扣押；没收；充公",
        "analysis": "im(里) + pound(放) → 放置到库房/监狱里",
        "derivatives": [],
        "example_en": "The custom impound the whole cargo.",
        "example_cn": "海关扣押了全部的船货。"
      },
      {
        "word": "postpone",
        "level": "初",
        "phonetic": "pəust'pəun",
        "pos": "vt.",
        "cn": "推迟；延期",
        "analysis": "post(后) + pon(放) + e → 往后放",
        "derivatives": ["postponement (n. 推迟)"],
        "example_en": "Our visit to the museum is postponed.",
        "example_cn": "参观博物馆被推迟了。"
      },
      {
        "word": "opponent",
        "level": "-",
        "phonetic": "ə'pəunənt",
        "pos": "n. / a.",
        "cn": "对手；对立的",
        "analysis": "op(反) + pon(放) + ent → 站在对立面放置的人",
        "derivatives": ["component (n. 成分；组成部分 [四])", "proponent (n. 提倡者)"],
        "example_en": "His opponent did not stand a chance.",
        "example_cn": "他的对手毫无取胜的机会。"
      }
    ]
  },
  {
    "root": "popul, publ",
    "meaning": "人民",
    "mnemonic": "源自单词 population（人口）与 public（公众）",
    "words": [
      {
        "word": "population",
        "level": "初",
        "phonetic": "pəpju'leiʃən",
        "pos": "n.",
        "cn": "人口",
        "analysis": "popul(人民) + ation",
        "derivatives": ["populace (n. 平民；大众 [初])", "populate (v. 居住于)", "depopulate (v. 减少人口)", "depopulation (n. 人口减少)", "overpopulate (v. 人口过剩 [G])", "overpopulation (n. 人口过剩)"],
        "example_en": "What is the population of this country?",
        "example_cn": "这个国家的人口是多少?"
      },
      {
        "word": "popular",
        "level": "初",
        "phonetic": "'popjulə",
        "pos": "a.",
        "cn": "大众的；流行的",
        "analysis": "popul(人民) + ar → 人民喜闻乐见的",
        "derivatives": ["popularity (n. 流行)", "popularize (v. 推广)", "popularization (n. 通俗化 [初])", "unpopular (a. 不受欢迎的)"],
        "example_en": "Do you like popular music?",
        "example_cn": "你喜欢流行音乐吗？"
      },
      {
        "word": "populous",
        "level": "-",
        "phonetic": "'popjuləs",
        "pos": "a.",
        "cn": "人口稠密的",
        "analysis": "popul(人民) + ous(多……的)",
        "derivatives": ["populism (n. 平民主义 [正])", "populist (n. 平民主义者 [正])"],
        "example_en": "We live in a populous area near the coast.",
        "example_cn": "我们生活在沿海人口稠密的地区。"
      },
      {
        "word": "public",
        "level": "初",
        "phonetic": "'pʌblik",
        "pos": "a. / n.",
        "cn": "公众的；公共的；民众",
        "analysis": "publ(人民) + ic",
        "derivatives": ["publicity (n. 公开；宣传)", "publish (v. 出版；发行 [初])", "publication (n. 出版 [初])"],
        "example_en": "He has published quite a lot of articles.",
        "example_cn": "他发表了不少文章。"
      }
    ]
  },
  {
    "root": "port",
    "meaning": "搬，运",
    "mnemonic": "单词port（港口）→ 港口有大量码头工人搬运货物",
    "words": [
      {
        "word": "portable",
        "level": "四",
        "phonetic": "'po:təbl",
        "pos": "a.",
        "cn": "可携带的；手提的",
        "analysis": "port(搬) + able(能)",
        "derivatives": ["portability (n. 可携带 [四])", "porter (n. 搬运工 [四])", "portage (n. 搬运；运费)"],
        "example_en": "He found that little TV extremely portable.",
        "example_cn": "他觉得那台小小的电视机携带极其方便。"
      },
      {
        "word": "comport",
        "level": "-",
        "phonetic": "kəm'po:t",
        "pos": "v.",
        "cn": "举止；相称",
        "analysis": "com(一起) + port(运/动作) → 动作运止在一块",
        "derivatives": ["comportment (n. 举止)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "export",
        "level": "四",
        "phonetic": "eks'po:t",
        "pos": "v. / n.",
        "cn": "输出；出口",
        "analysis": "ex(出) + port(运)",
        "derivatives": ["exporter (n. 出口商)", "exportation (n. 出口)"],
        "example_en": "Africa is exporting beef to Europe.",
        "example_cn": "非洲向欧洲出口牛肉。"
      },
      {
        "word": "import",
        "level": "四",
        "phonetic": "im'po:t",
        "pos": "v. / n.",
        "cn": "进口；输入",
        "analysis": "im(进) + port(运)",
        "derivatives": ["importation (n. 进口)", "important (a. 重要的 [四])", "importance (n. 重要性)", "unimportant (a. 不重要的)"],
        "example_en": "It is profitable to import food.",
        "example_cn": "进口食品可赚钱。"
      },
      {
        "word": "transport",
        "level": "四",
        "phonetic": "træns'po:t",
        "pos": "v. / n.",
        "cn": "运输；客运",
        "analysis": "trans(跨越) + port(运)",
        "derivatives": ["transportation (n. 运输)", "transporter (n. 运送者 [四])"],
        "example_en": "The transport of goods by air is very expensive.",
        "example_cn": "空运货物费用十分昂贵。"
      },
      {
        "word": "deport",
        "level": "-",
        "phonetic": "di'po:t",
        "pos": "v.",
        "cn": "驱逐出境；举止",
        "analysis": "de(向下/移走) + port(运)",
        "derivatives": ["deportation (n. 驱逐出境)", "deportment (n. 举止行为)", "deportable (a. 可驱逐的)"],
        "example_en": "She is declared an undesirable alien and deport.",
        "example_cn": "她被宣布是不受欢迎的外国人并被驱逐出境。"
      },
      {
        "word": "support",
        "level": "初",
        "phonetic": "sə'po:t",
        "pos": "vt. / n.",
        "cn": "支援；支持；抚养",
        "analysis": "sup(下面) + port(搬/托运) → 从下往上托举运力",
        "derivatives": ["supporter (n. 支持者 [初])", "insupportable (a. 忍受不住的)"],
        "example_en": "Which football team do you support?",
        "example_cn": "你支持哪个足球队？"
      },
      {
        "word": "report",
        "level": "初",
        "phonetic": "ri'po:t",
        "pos": "n. / v.",
        "cn": "报告；报道",
        "analysis": "re(回) + port(运) → 搬运信息回来汇报",
        "derivatives": ["reporter (n. 记者 [四])", "reportage (n. 报告文学)"],
        "example_en": "He is reading a report of the state of the roads.",
        "example_cn": "他正在看一篇关于道路状况的报告。"
      },
      {
        "word": "opportune",
        "level": "G",
        "phonetic": "'opətju:n",
        "pos": "a.",
        "cn": "恰好的；适宜的",
        "analysis": "op(对着) + port(港口) → 船正好对准港口进入 → 适时的",
        "derivatives": ["opportunity (n. 机会 [初])", "inopportune (a. 不合时宜的 [G])", "importune (v. 强求；缠扰 [G])", "importunate (a. 缠扰不休的 [G])"],
        "example_en": "The call came at an opportune moment for me.",
        "example_cn": "这个电话对我来说来得正是时候。"
      }
    ]
  },
  {
    "root": "pos, posit",
    "meaning": "放，摆",
    "mnemonic": "摆 pose（姿势）即摆、放；posit = pos + it(它) 放置它",
    "words": [
      {
        "word": "compose",
        "level": "四",
        "phonetic": "kəm'pəuz",
        "pos": "vt.",
        "cn": "组成；作曲；使镇定",
        "analysis": "com(一起) + pos(摆) + e → 有条理地摆在一块",
        "derivatives": ["composition (n. 作文；组合)", "composer (n. 作曲家 [四])", "composure (n. 镇静；沉着)", "decompose (v. 分解 [四])", "decomposition (n. 分解)"],
        "example_en": "He spent his spare time composing poetry.",
        "example_cn": "他用空余时间写诗。"
      },
      {
        "word": "impose",
        "level": "四",
        "phonetic": "im'pəuz",
        "pos": "vt.",
        "cn": "强加；征税",
        "analysis": "im(强调/在上面) + pos(放) + e → 硬放上去",
        "derivatives": ["imposition (n. 强加；征税)", "imposing (a. 壮观的 [四])"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "oppose",
        "level": "四",
        "phonetic": "ə'pəuz",
        "pos": "v.",
        "cn": "反对；对抗",
        "analysis": "op(反) + pos(放) + e → 摆在对立面",
        "derivatives": ["opposite (a. 相对的 [四])", "opposition (n. 反对；敌对)"],
        "example_en": "I am opposed to going shopping with others.",
        "example_cn": "我反对与他人一起外出购物。"
      },
      {
        "word": "propose",
        "level": "四",
        "phonetic": "prə'pəuz",
        "pos": "v.",
        "cn": "提议；计划；求婚",
        "analysis": "pro(前面) + pos(放) + e → 摆到前面让大家看",
        "derivatives": ["proposal (n. 建议；提议 [四])", "proposition (n. 命题；建议)"],
        "example_en": "I wish to propose a toast to our friendship.",
        "example_cn": "我提议为我们的友谊干杯。"
      },
      {
        "word": "suppose",
        "level": "初",
        "phonetic": "sə'pəuz",
        "pos": "v.",
        "cn": "推想；假设",
        "analysis": "sup(下) + pos(放) + e → 垫在底下的初步设想",
        "derivatives": ["supposition (n. 猜想)", "presuppose (v. 预先假定 [G])", "presupposition (n. 前提)"],
        "example_en": "I suppose he is still in town.",
        "example_cn": "我想他还在城里。"
      },
      {
        "word": "expose",
        "level": "四",
        "phonetic": "iks'pəuz",
        "pos": "vt.",
        "cn": "暴露；揭露",
        "analysis": "ex(出) + pos(摆) + e → 摆出来",
        "derivatives": ["exposure (n. 暴露 [四])", "exposition (n. 展览；阐释)", "overexpose (v. 使感光过度)"],
        "example_en": "Their scheme was exposed.",
        "example_cn": "他们的阴谋被暴露了。"
      },
      {
        "word": "dispose",
        "level": "四",
        "phonetic": "dis'pəuz",
        "pos": "vt.",
        "cn": "处理；排列；布置",
        "analysis": "dis(分开) + pos(放) + e → 分门别类放好",
        "derivatives": ["disposal (n. 处理 [四])", "disposition (n. 性情；安排 [正])", "indisposed (a. 不愿意的；不舒服的)"],
        "example_en": "They disposed troops along the river.",
        "example_cn": "他们沿河布置了军队。"
      },
      {
        "word": "deposit",
        "level": "四",
        "phonetic": "-",
        "pos": "v. / n.",
        "cn": "储存；存款；押金",
        "analysis": "de(下) + posit(放) → 放下去留存",
        "derivatives": ["depository (n. 贮藏所 [四])", "depot (n. 仓库；驻扎所)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "prais, preci",
    "meaning": "价值",
    "mnemonic": "谐音单词 price（价格/价值）",
    "words": [
      {
        "word": "appreciate",
        "level": "初",
        "phonetic": "ə'pri:ʃieit",
        "pos": "v.",
        "cn": "欣赏；鉴赏；感激；升值",
        "analysis": "ap(强调) + preci(价值) + ate → 赋予充分的价值",
        "derivatives": ["appreciation (n. 欣赏；感谢)", "appreciable (a. 可估计的 [初])", "appreciative (a. 有欣赏力的 [初])"],
        "example_en": "Land will continue to appreciate.",
        "example_cn": "土地将继续增值。"
      },
      {
        "word": "precious",
        "level": "初",
        "phonetic": "'preʃəs",
        "pos": "a.",
        "cn": "宝贵的；珍贵的",
        "analysis": "prec(价值) + i + ous(多……的)",
        "derivatives": ["semiprecious (a. 半珍贵的 [G])", "preciosity (n. 过分讲究)"],
        "example_en": "That old book is my most precious possession.",
        "example_cn": "那本旧书是我最珍贵的财产。"
      },
      {
        "word": "depreciate",
        "level": "-",
        "phonetic": "di'pri:ʃieit",
        "pos": "v.",
        "cn": "贬值；轻视",
        "analysis": "de(向下/去掉) + prec(价值) + iate",
        "derivatives": ["depreciation (n. 贬值)"],
        "example_en": "Our currency will not be depreciated.",
        "example_cn": "我们的货币不会贬值。"
      },
      {
        "word": "appraise",
        "level": "-",
        "phonetic": "ə'preiz",
        "pos": "v.",
        "cn": "评估；鉴定",
        "analysis": "ap(强调) + praise(价值/评定)",
        "derivatives": ["appraisal (n. 评估；评价 [六])"],
        "example_en": "It would be unwise to buy the house before having it appraised.",
        "example_cn": "买房子不事先估价是不明智的。"
      }
    ]
  },
  {
    "root": "prehens, prehend",
    "meaning": "抓住",
    "mnemonic": "p + re + hand（手）→ 用手反复抓 → 抓住",
    "words": [
      {
        "word": "comprehend",
        "level": "六",
        "phonetic": "kompri'hend",
        "pos": "vt.",
        "cn": "理解；包含",
        "analysis": "com(全部) + prehend(抓住) → 思维全部抓住",
        "derivatives": ["comprehension (n. 理解 [六])", "comprehensive (a. 综合性的 [六])", "comprehensible (a. 可理解的)", "incomprehensible (a. 不能理解的)"],
        "example_en": "I cannot comprehend this phrase.",
        "example_cn": "我无法理解这个短语。"
      },
      {
        "word": "apprehend",
        "level": "六",
        "phonetic": "æpri'hend",
        "pos": "v.",
        "cn": "理解；忧虑；逮捕",
        "analysis": "ap(强调) + prehend(抓住)",
        "derivatives": ["apprehension (n. 理解；忧虑 [六])", "apprehensive (a. 忧虑的；敏悟的 [G])", "apprentice (n. 学徒)"],
        "example_en": "You are, I apprehend, ready to renew the contract.",
        "example_cn": "据我理解,你愿意续订这个合同。"
      },
      {
        "word": "reprehend",
        "level": "G",
        "phonetic": "repri'hend",
        "pos": "v.",
        "cn": "谴责；责难",
        "analysis": "re(反) + prehend(抓住) → 反过来抓住别人的把柄不放",
        "derivatives": ["reprehensible (a. 应受责难的)", "reprehension (n. 非难)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "prem, prim",
    "meaning": "第一，首要",
    "mnemonic": "pre（在前面）+ m（门）→ 站在第一道门前 → 第一、首要",
    "words": [
      {
        "word": "prime",
        "level": "四",
        "phonetic": "praim",
        "pos": "a. / n.",
        "cn": "最初的；首要的；青春",
        "analysis": "prim(第一) + e",
        "derivatives": ["primarily (ad. 首先 [四])", "primary (a. 最初的；基本的 [四])", "primal (a. 原始的)", "primacy (n. 主要地位)", "primer (n. 初级读本)"],
        "example_en": "What was said was of prime importance.",
        "example_cn": "说过的那件事是很重要的。"
      },
      {
        "word": "premier",
        "level": "六",
        "phonetic": "'premjə",
        "pos": "n.",
        "cn": "总理；首相",
        "analysis": "prim(首要) + i + er(人) → 国家的领军人物",
        "derivatives": ["premiere (v. 初次公演 [四])"],
        "example_en": "Premier Zhou is a distinguished politician.",
        "example_cn": "周总理是一位卓越的政治家。"
      },
      {
        "word": "primitive",
        "level": "-",
        "phonetic": "'primitiv",
        "pos": "a. / n.",
        "cn": "原始的；原始人",
        "analysis": "prim(第一) + itive(复合后缀) → 最初状态的",
        "derivatives": ["primeval (a. 远古的 [六])", "primogenitor (n. 始祖 [G])", "primate (n. 灵长目动物)", "pristine (a. 原来的；原始的 [G])"],
        "example_en": "Small seashells were often used as a primitive kind of money.",
        "example_cn": "小贝壳常被用作简单的原始货币。"
      }
    ]
  },
  {
    "root": "press",
    "meaning": "挤压",
    "mnemonic": "单词press（压迫/新闻界）",
    "words": [
      {
        "word": "compress",
        "level": "-",
        "phonetic": "kəm'pres",
        "pos": "v.",
        "cn": "压缩；压榨",
        "analysis": "com(一起) + press(压)",
        "derivatives": ["compression (n. 压缩)", "compressible (a. 可压缩的)", "decompress (v. 减压)", "decompression (n. 解压)"],
        "example_en": "Wood cuttings and sawdust can be compressed into boards.",
        "example_cn": "木屑和锯末可压制成板。"
      },
      {
        "word": "impress",
        "level": "四",
        "phonetic": "im'pres",
        "pos": "v.",
        "cn": "盖印；使感动；给深刻印象",
        "analysis": "im(入/内) + press(压) → 压入心坎里",
        "derivatives": ["impression (n. 印象 [四])", "impressive (a. 印象深刻的 [四])", "impressionable (a. 易受影响的)", "impressionism (n. 印象主义)", "impressionist (n. 印象派画家)"],
        "example_en": "I was very impressed by his story.",
        "example_cn": "他的故事深深打动了我。"
      },
      {
        "word": "express",
        "level": "初",
        "phonetic": "iks'pres",
        "pos": "v. / a.",
        "cn": "表达；特快",
        "analysis": "ex(出) + press(压) → 把内心情感挤压表达出来",
        "derivatives": ["expression (n. 表达；表情 [初])", "expressive (a. 表达的)", "expressly (ad. 明白地 [四])", "inexpressible (a. 无法形容的)"],
        "example_en": "She is the express image of her mother.",
        "example_cn": "她和她母亲长得一模一样。"
      },
      {
        "word": "oppress",
        "level": "-",
        "phonetic": "ə'pres",
        "pos": "vt.",
        "cn": "压迫；虐待",
        "analysis": "op(强调) + press(压) → 严酷挤压",
        "derivatives": ["oppression (n. 压迫)", "oppressive (a. 压制性的)"],
        "example_en": "The tyrant who oppressed the people was finally overthrown.",
        "example_cn": "压迫人民的暴君终于被推翻了。"
      },
      {
        "word": "depress",
        "level": "六",
        "phonetic": "di'pres",
        "pos": "v.",
        "cn": "压下；使沮丧",
        "analysis": "de(向下) + press(压)",
        "derivatives": ["depression (n. 萧条；沮丧)", "depressing (a. 令人沮丧的 [四])", "depressive (a. 压抑的)", "antidepressant (n. 抗抑郁剂)"],
        "example_en": "The thought of having to take the exam again depressed me.",
        "example_cn": "想到还需重新考试,我就感到沮丧。"
      },
      {
        "word": "suppress",
        "level": "四",
        "phonetic": "sə'pres",
        "pos": "v.",
        "cn": "镇压；忍住",
        "analysis": "sup(向下) + press(压)",
        "derivatives": ["suppression (n. 镇压)", "repress (v. 镇压；抑制 [六])", "repression (n. 压抑 [G])", "irrepressible (a. 抑制不住的 [G])"],
        "example_en": "The revolt was suppressed in a couple of days.",
        "example_cn": "叛乱在几天之内就被镇压下去了。"
      }
    ]
  },
  {
    "root": "pris",
    "meaning": "拿住，抓住",
    "mnemonic": "pr（仆人）+ is（是）→ 仆人是被抓住的俘虏",
    "words": [
      {
        "word": "prison",
        "level": "初",
        "phonetic": "'prizən",
        "pos": "n.",
        "cn": "监狱",
        "analysis": "pris(抓) + on → 关押抓获之人的场所",
        "derivatives": ["prisoner (n. 囚犯)", "imprison (v. 监禁 [四])", "imprisonment (n. 监禁 [四])"],
        "example_en": "Those prodigals were put into prison.",
        "example_cn": "那些挥霍者被关进监狱。"
      },
      {
        "word": "surprise",
        "level": "初",
        "phonetic": "sə'praiz",
        "pos": "v. / n.",
        "cn": "使惊奇；惊喜",
        "analysis": "sur(在下) + pris(抓) + e → 出其不意从下方突袭抓住",
        "derivatives": ["surprised (a. 感到惊讶的 [初])", "surprising (a. 令人惊讶的)"],
        "example_en": "The news greatly surprised them.",
        "example_cn": "这消息使他们大为吃惊。"
      },
      {
        "word": "comprise",
        "level": "四",
        "phonetic": "kəm'praiz",
        "pos": "v.",
        "cn": "包含；构成",
        "analysis": "com(全部) + prise(抓) → 全部抓揽囊括",
        "derivatives": [],
        "example_en": "This month's figures are comprised in the total.",
        "example_cn": "这个月的数字已包含在总数之内。"
      },
      {
        "word": "enterprise",
        "level": "-",
        "phonetic": "'entəpraiz",
        "pos": "n.",
        "cn": "企业；事业；进取心",
        "analysis": "enter(进入) + pris(抓住) + e → 参与并抓住机遇",
        "derivatives": ["enterprising (a. 有进取心的)"],
        "example_en": "He is a man of great enterprise.",
        "example_cn": "他是个事业心很强的人。"
      },
      {
        "word": "apprise",
        "level": "G",
        "phonetic": "ə'praiz",
        "pos": "vt.",
        "cn": "告知；通知；评价",
        "analysis": "ap(强调) + pris(抓) + e → 强调抓住信息告知",
        "derivatives": ["prize (n. 奖品 [初])", "reprisal (n. 报复；赔偿 [G])", "reprise (n. 年金；重演 [G])", "reprieve (n. 缓刑)"],
        "example_en": "I was apprised of the committee's decision.",
        "example_cn": "我已获悉委员会的通知。"
      }
    ]
  },
  {
    "root": "priv",
    "meaning": "个人，私人",
    "mnemonic": "联想单词 private（私人的）",
    "words": [
      {
        "word": "private",
        "level": "初",
        "phonetic": "'praivit",
        "pos": "a. / n.",
        "cn": "私人的；秘密的；私下",
        "analysis": "priv(私人) + ate",
        "derivatives": ["privacy (n. 隐私)", "privately (ad. 私下)", "privatize (v. 私有化)", "privatization (n. 私有化)", "semiprivate (a. 半私用的)"],
        "example_en": "That's my private view.",
        "example_cn": "那是我个人的观点。"
      },
      {
        "word": "privilege",
        "level": "-",
        "phonetic": "'privilidʒ",
        "pos": "n.",
        "cn": "特权",
        "analysis": "priv(私人) + i + leg(法律) + e → 专属个人的特殊法律优待",
        "derivatives": ["privateer (n. 私有武装船)"],
        "example_en": "He enjoys diplomatic privileges.",
        "example_cn": "他享有外交特权。"
      },
      {
        "word": "privy",
        "level": "四",
        "phonetic": "'privi",
        "pos": "a.",
        "cn": "秘密的；私人的；知情的",
        "analysis": "priv(私人) + y",
        "derivatives": ["privity (n. 私事；默契)"],
        "example_en": "Very few of them were privy to the details of the conspiracy.",
        "example_cn": "他们之中很少人知道密谋的详情。"
      },
      {
        "word": "deprive",
        "level": "-",
        "phonetic": "di'praiv",
        "pos": "vt.",
        "cn": "剥夺；夺去",
        "analysis": "de(去掉) + priv(私人) + e → 剥夺个人拥有的财物",
        "derivatives": ["deprivation (n. 剥夺；丧失)", "deprived (a. 贫困的)", "privation (n. 缺乏；贫困)"],
        "example_en": "The new laws deprived many people of the most elementary freedoms.",
        "example_cn": "新法律剥夺了许多人的最基本的自由。"
      }
    ]
  },
  {
    "root": "prob, prov",
    "meaning": "测试，证明",
    "mnemonic": "prov源自单词 prove（证明）；prob为辅音音变（v→b）",
    "words": [
      {
        "word": "prove",
        "level": "初",
        "phonetic": "pru:v",
        "pos": "v.",
        "cn": "证明；查验",
        "analysis": "prov(证明) + e",
        "derivatives": ["proof (n. 证据；证明 [初])", "approve (v. 赞同；核准 [四])", "approval (n. 赞成)", "disapprove (v. 不赞成 [四])", "disapproval (n. 不称赞)", "reprove (v. 责备 [六])", "disprove (v. 反证 [六])", "improve (v. 改善 [初])", "improvement (n. 改进 [四])"],
        "example_en": "He has proved his courage in the battle.",
        "example_cn": "他已在这场战斗中证明了自己的勇气。"
      },
      {
        "word": "probe",
        "level": "四",
        "phonetic": "prəub",
        "pos": "n. / v.",
        "cn": "探索；调查",
        "analysis": "prob(测试/证明) + e → 为证明真相而探索",
        "derivatives": ["probing (a. 探索的)"],
        "example_en": "At first two chess players probe mutually.",
        "example_cn": "起先两个棋手互相试探。"
      },
      {
        "word": "probable",
        "level": "初",
        "phonetic": "'probəbl",
        "pos": "a.",
        "cn": "很可能的",
        "analysis": "prob(证明) + able(能) → 能证明的",
        "derivatives": ["probably (ad. 大概 [初])", "probability (n. 可能性)", "improbable (a. 不可能的 [四])", "improbability (n. 不大可能)"],
        "example_en": "It's highly probable that they will win the match.",
        "example_cn": "他们很可能会赢这场比赛。"
      },
      {
        "word": "probation",
        "level": "日",
        "phonetic": "prə'beiʃən",
        "pos": "n.",
        "cn": "试用；鉴定；缓刑",
        "analysis": "prob(测试) + ation",
        "derivatives": ["probate (v. 检验 n. 遗嘱检验 [国])", "probationary (a. 验证的)", "probationer (n. 试用人员)", "probity (n. 诚实；廉洁)"],
        "example_en": "The probation officer reported on the progress of the two young criminal.",
        "example_cn": "监督缓刑官员对两个青少年犯的进步作了汇报。"
      },
      {
        "word": "approbation",
        "level": "正",
        "phonetic": "-",
        "pos": "n.",
        "cn": "认可；许可；赞许",
        "analysis": "ap(强调) + prob(证明) + ation",
        "derivatives": ["approbate (v. 许可)", "approbatory (a. 赞许的 [G])", "reprobate (v. 谴责 n. 恶棍 [G])", "reprobation (n. 谴责)"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "proper, propr",
    "meaning": "拥有，恰当的",
    "mnemonic": "pro(前面) + per(每个) → 跑在前面的每个人都拥有恰当的奖品",
    "words": [
      {
        "word": "property",
        "level": "四",
        "phonetic": "'propəti",
        "pos": "n.",
        "cn": "财产；所有物；性质",
        "analysis": "proper(拥有) + ty",
        "derivatives": ["proper (a. 适当的 [初])", "propertied (a. 有产的 [四])", "proprietor (n. 所有者 [初])", "proprietory (a. 私有的)"],
        "example_en": "This small house is my only property.",
        "example_cn": "这所小房子是我的唯一财产。"
      },
      {
        "word": "propriety",
        "level": "-",
        "phonetic": "prə'praiəti",
        "pos": "n.",
        "cn": "适当；礼节",
        "analysis": "propr(恰当) + iety",
        "derivatives": ["improper (a. 不适当的)", "impropriety (n. 不得体)"],
        "example_en": "I doubt the propriety of such a remark.",
        "example_cn": "我怀疑这样的话是否得体。"
      },
      {
        "word": "appropriate",
        "level": "四",
        "phonetic": "ə'prəupriət",
        "pos": "v. / a.",
        "cn": "拨出；挪用；适当的",
        "analysis": "ap(强调) + propr(恰当/占有) + iate",
        "derivatives": ["appropriation (n. 拨款；挪用)", "inappropriate (a. 不适当的)", "misappropriate (v. 侵吞；滥用)", "expropriate (v. 没收；征用)"],
        "example_en": "The manager was found to have appropriated store money.",
        "example_cn": "那位经理曾经挪用店里的钱。"
      }
    ]
  },
  {
    "root": "pugn",
    "meaning": "打斗",
    "mnemonic": "读：“胖嗯”→ 一顿胖揍，相互打斗",
    "words": [
      {
        "word": "pugnacious",
        "level": "G",
        "phonetic": "pʌg'neiʃəs",
        "pos": "a.",
        "cn": "好斗的",
        "analysis": "pugn(打斗) + acious(多……的)",
        "derivatives": ["pugnacity (n. 好斗性 [G])", "pugilism (n. 拳击)", "pugilistic (a. 拳击的)"],
        "example_en": "My normally easygoing personality turned pugnacious.",
        "example_cn": "我惯常随和的性情变得好斗了。"
      },
      {
        "word": "impugn",
        "level": "G",
        "phonetic": "im'pju:n",
        "pos": "v.",
        "cn": "抨击；责难；攻击",
        "analysis": "im(向内/使) + pugn(打斗)",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "repugnance",
        "level": "G",
        "phonetic": "ri'pʌgnəns",
        "pos": "n.",
        "cn": "厌恶；反感；抵触",
        "analysis": "re(反) + pugn(打斗) + ance → 反复格挡打斗因为反感",
        "derivatives": ["repugnant (a. 反感的 [G])", "expugnable (a. 可克服的 [G])"],
        "example_en": "I cannot overcome my repugnance to eating snails.",
        "example_cn": "真厌恶吃蜗牛，我可受不了。"
      }
    ]
  },
  {
    "root": "pur, purg",
    "meaning": "使净化",
    "mnemonic": "pur（仆人）打扫房间；purg（仆人干活）→ 使房间干净纯洁",
    "words": [
      {
        "word": "pure",
        "level": "初",
        "phonetic": "pjuə",
        "pos": "a.",
        "cn": "纯的；纯洁的",
        "analysis": "pur(净)",
        "derivatives": ["purely (ad. 纯粹地 [四])", "purity (n. 纯净 [四])", "purism (n. 纯粹主义)", "purist (n. 纯粹主义者)", "puritan (n. 清教徒)", "impure (a. 不纯的)", "impurity (n. 不纯)"],
        "example_en": "She is a pure girl.",
        "example_cn": "她是一个纯洁的女孩。"
      },
      {
        "word": "purify",
        "level": "-",
        "phonetic": "'pjuərifai",
        "pos": "v.",
        "cn": "净化；精炼",
        "analysis": "pur(净) + ify(使……化)",
        "derivatives": ["purification (n. 洗净)", "purifier (n. 清洗装置)"],
        "example_en": "You can purify the water by distilling.",
        "example_cn": "你可以通过蒸馏来净化水。"
      },
      {
        "word": "purge",
        "level": "-",
        "phonetic": "pə:dʒ",
        "pos": "n. / v.",
        "cn": "净化；清除；泻药",
        "analysis": "purg(净) + e",
        "derivatives": ["purgation (n. 清洗)", "purgative (n. 泻药 a. 清洗的)", "purgatory (n. 炼狱/灵魂净化)", "unpurged (a. 未净化的)"],
        "example_en": "We may purge water by distillation.",
        "example_cn": "我们可以用蒸馏法使水净化。"
      },
      {
        "word": "expurgate",
        "level": "G",
        "phonetic": "'ekspə:geit",
        "pos": "v.",
        "cn": "订正；删除；净化",
        "analysis": "ex(出) + purg(净) + ate → 净化并把不洁处删掉",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "put",
    "meaning": "认为，思考",
    "mnemonic": "单词put（放置）→ 放在别人的位置上 → 换位思考",
    "words": [
      {
        "word": "compute",
        "level": "-",
        "phonetic": "kəm'pju:t",
        "pos": "v.",
        "cn": "计算；估算",
        "analysis": "com(一起) + put(思考) + e → 汇集在一起核算",
        "derivatives": ["computer (n. 计算机 [初])", "computation (n. 计算 [四])", "computable (a. 可计算的 [四])", "computerize (v. 用电脑处理 [四])", "minicomputer (n. 微型计算机)", "microcomputer (n. 微计算机)"],
        "example_en": "He computed his losses at USD5,000.",
        "example_cn": "他估计自己损失5000美元。"
      },
      {
        "word": "putative",
        "level": "四",
        "phonetic": "'pju:tətiv",
        "pos": "a.",
        "cn": "假定的；被公认的",
        "analysis": "put(思考/认为) + ative",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "dispute",
        "level": "四",
        "phonetic": "dis'pju:t",
        "pos": "n. / v.",
        "cn": "争论；反驳",
        "analysis": "dis(分开/相异) + put(思考) + e → 思考想法不一致产生争执",
        "derivatives": ["disputation (n. 争辩)", "disputable (a. 能反驳的)", "indisputable (a. 无可置疑的)", "undisputed (a. 无争议的)"],
        "example_en": "His honesty is beyond dispute.",
        "example_cn": "他的诚实是无可争议的。"
      },
      {
        "word": "repute",
        "level": "-",
        "phonetic": "ri'pju:t",
        "pos": "n.",
        "cn": "名誉；声望",
        "analysis": "re(反复) + put(思考) + e → 众人反复赞扬思索的",
        "derivatives": ["reputation (n. 名誉 [四])", "reputable (a. 有声望的)", "disrepute (n. 坏名声 [四])", "disreputable (a. 声名狼藉的)"],
        "example_en": "He is held in high repute.",
        "example_cn": "他名声很好。"
      },
      {
        "word": "impute",
        "level": "-",
        "phonetic": "im'pju:t",
        "pos": "v.",
        "cn": "归咎于",
        "analysis": "im(向内) + put(思考) + e",
        "derivatives": ["imputation (n. 归罪)"],
        "example_en": "The police impute the rise in crime to high unemployment.",
        "example_cn": "警方把犯罪增加的原因归咎于失业率太高。"
      },
      {
        "word": "depute",
        "level": "G",
        "phonetic": "di'pju:t",
        "pos": "v.",
        "cn": "指定代理人",
        "analysis": "de(下) + put(思考) + e",
        "derivatives": ["deputy (n. 代理人)", "deputize (v. 指定代理)", "deputation (n. 委派)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "amputate",
        "level": "-",
        "phonetic": "-",
        "pos": "v.",
        "cn": "切断；截肢",
        "analysis": "am(周围) + put(修剪/思考) + ate",
        "derivatives": ["amputation (n. 截肢)", "amputee (n. 被截肢者 [G])"],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "quest, quer",
    "meaning": "寻求，询问",
    "mnemonic": "源自单词 question（问题）",
    "words": [
      {
        "word": "question",
        "level": "初",
        "phonetic": "'kwestʃən",
        "pos": "n. / v.",
        "cn": "问题；怀疑；审问",
        "analysis": "quest(问) + ion",
        "derivatives": ["questionable (a. 可疑的 [六])", "unquestionable (a. 确实无疑的 [四])", "questionnaire (n. 问卷 [四])"],
        "example_en": "May I ask a question?",
        "example_cn": "我可以问一个问题吗？"
      },
      {
        "word": "conquest",
        "level": "-",
        "phonetic": "'konkwest",
        "pos": "n.",
        "cn": "征服",
        "analysis": "con(一起) + quest(寻求) → 共同去攻取获取",
        "derivatives": ["conquer (v. 征服 [国])"],
        "example_en": "The Normans ruled England by right of conquest.",
        "example_cn": "诺曼人征服了英格兰成了统治者。"
      },
      {
        "word": "inquest",
        "level": "-",
        "phonetic": "'inkwest",
        "pos": "n.",
        "cn": "审问；验尸审查",
        "analysis": "in(进) + quest(询问)",
        "derivatives": [],
        "example_en": "The inquest will be held next Thursday.",
        "example_cn": "下星期四举行审讯。"
      },
      {
        "word": "request",
        "level": "初",
        "phonetic": "ri'kwest",
        "pos": "n. / vt.",
        "cn": "请求；要求",
        "analysis": "re(反复) + quest(询问)",
        "derivatives": [],
        "example_en": "Your presence is requested at the meeting.",
        "example_cn": "请你务必出席会议。"
      },
      {
        "word": "acquire",
        "level": "四",
        "phonetic": "ə'kwaiə",
        "pos": "v.",
        "cn": "获得；学到",
        "analysis": "ac(强调) + quir(寻求) + e",
        "derivatives": ["acquisition (n. 获得 [六])", "acquired (a. 后天习得的 [四])", "acquisitive (a. 贪婪的)"],
        "example_en": "Gradually we acquired experience in how to do the work.",
        "example_cn": "我们逐步获得了做这工作的经验。"
      },
      {
        "word": "inquire",
        "level": "四",
        "phonetic": "in'kwaiə",
        "pos": "v.",
        "cn": "盘问；查问；调查",
        "analysis": "in(深入) + quir(询问) + e",
        "derivatives": ["inquiry (n. 询问；调查 [四])", "inquisition (n. 审问)"],
        "example_en": "She inquired why he had not thought of that before.",
        "example_cn": "她查问为何他以前没想到那一点。"
      },
      {
        "word": "require",
        "level": "四",
        "phonetic": "ri'kwaiə",
        "pos": "v.",
        "cn": "需要；要求；命令",
        "analysis": "re(反复) + quir(寻求) + e",
        "derivatives": ["requisite (a. 必需的 [六])", "requisition (n. 正式请求；征用)"],
        "example_en": "The director required that we should work all night.",
        "example_cn": "主任要求我们通宵工作。"
      }
    ]
  },
  {
    "root": "quiet, qui",
    "meaning": "静",
    "mnemonic": "源自单词 quiet（安静）",
    "words": [
      {
        "word": "quiet",
        "level": "初",
        "phonetic": "'kwaiət",
        "pos": "n. / a.",
        "cn": "安静；寂静的",
        "analysis": "根词直用",
        "derivatives": ["quietly (ad. 寂静地 [初])", "quietude (n. 安静)", "inquietude (n. 焦虑；不安 [托])", "quietus (n. 寂灭；死；终结 [G])"],
        "example_en": "Quietude is the crown of life.",
        "example_cn": "人生何为先，宁静为桂冠。"
      },
      {
        "word": "disquiet",
        "level": "研",
        "phonetic": "dis'kwaiət",
        "pos": "v. / n.",
        "cn": "使不安；焦虑",
        "analysis": "dis(不) + quiet(平静)",
        "derivatives": ["disquieting (a. 引起不安的)"],
        "example_en": "Rumors of war disquieted the people.",
        "example_cn": "战争的流言使人们心感焦虑。"
      },
      {
        "word": "quiescence",
        "level": "-",
        "phonetic": "kwai'esəns",
        "pos": "n.",
        "cn": "静止；沉默",
        "analysis": "qui(静) + escence(状态)",
        "derivatives": ["quiescent (a. 静止的)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "acquiesce",
        "level": "-",
        "phonetic": "ækwi'es",
        "pos": "v.",
        "cn": "默许；顺从",
        "analysis": "ac(加强) + qui(静) + esce → 安静不反抗",
        "derivatives": ["acquiescence (n. 默许)", "acquiescent (a. 默许的)"],
        "example_en": "He did it under the acquiescence of his boss.",
        "example_cn": "他是在上司的默许下做这件事的。"
      },
      {
        "word": "requiem",
        "level": "-",
        "phonetic": "'rekwiəm",
        "pos": "n.",
        "cn": "安魂曲",
        "analysis": "re(回) + qui(安静) + em → 回归安宁",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      }
    ]
  },
  {
    "root": "quit",
    "meaning": "自由，免除，离开",
    "mnemonic": "qu（去）+ it（它）→ 去掉束缚它的东西 → 自由、放弃",
    "words": [
      {
        "word": "quit",
        "level": "-",
        "phonetic": "kwit",
        "pos": "v.",
        "cn": "离开；停止；辞职",
        "analysis": "获得自由而离职",
        "derivatives": ["quitter (n. 懦夫；轻易停止的人 [四])", "quitclaim (n. 放弃权利)"],
        "example_en": "He quitted Paris after a week.",
        "example_cn": "他一周后离开了巴黎。"
      },
      {
        "word": "acquit",
        "level": "-",
        "phonetic": "ə'kwit",
        "pos": "v.",
        "cn": "开释；免罪；宣告无罪",
        "analysis": "ac(强调) + quit(自由) → 给予人身自由",
        "derivatives": ["acquittal (n. 释放；赦免)"],
        "example_en": "He was acquitted of the crime.",
        "example_cn": "他被宣告无罪。"
      },
      {
        "word": "requite",
        "level": "研",
        "phonetic": "ri'kwait",
        "pos": "v.",
        "cn": "报答；回报",
        "analysis": "re(回) + quit(免除/结清) + e → 结清恩怨使解脱",
        "derivatives": ["requital (n. 报答)", "unrequited (a. 无回报的)"],
        "example_en": "I'll requite you for your help.",
        "example_cn": "我想报答你的帮助。"
      },
      {
        "word": "ubiquitous",
        "level": "正",
        "phonetic": "ju:'bikwitəs",
        "pos": "a.",
        "cn": "无处不在的；遍在的",
        "analysis": "ubi(任何地方) + quit(自由出入) + ous",
        "derivatives": [],
        "example_en": "Is there no escape from the ubiquitous cigarette smoke in restaurants?",
        "example_cn": "餐厅里吸烟的烟雾就没有地方躲得过去吗?"
      }
    ]
  },
  {
    "root": "rad, radic",
    "meaning": "根、放射",
    "mnemonic": "源自单词 radar（雷达）→ 雷达波呈放射状；树根也呈放射状散开",
    "words": [
      {
        "word": "radical",
        "level": "六",
        "phonetic": "'rædikəl",
        "pos": "a. / n.",
        "cn": "根本的；激进的；激进分子",
        "analysis": "radic(根) + al → 抓根本的/过激的",
        "derivatives": ["radicalize (v. 使激进化)", "radicalism (n. 激进主义)", "radicalization (n. 激进化)"],
        "example_en": "I do not share his radical views.",
        "example_cn": "我不同意他的激进观点。"
      },
      {
        "word": "eradicate",
        "level": "研",
        "phonetic": "i'rædikeit",
        "pos": "v.",
        "cn": "根除；扑灭",
        "analysis": "e(出) + radic(根) + ate → 连根拔起拔出来",
        "derivatives": ["eradication (n. 根除)", "eradicable (a. 可根除的)"],
        "example_en": "Smallpox has almost been eradicated.",
        "example_cn": "天花几乎已经被根除了。"
      },
      {
        "word": "radiate",
        "level": "-",
        "phonetic": "-",
        "pos": "v.",
        "cn": "辐射；发光",
        "analysis": "rad(放射) + i + ate",
        "derivatives": ["radiation (n. 辐射)", "radiant (a. 发光的；光芒四射的)", "radiance (n. 光辉)", "radiator (n. 暖气片；散热器)", "radial (a. 放射状的 [四])", "radium (n. 镭)", "radius (n. 半径)"],
        "example_en": "His face was irradiated by happiness.",
        "example_cn": "他的面容闪露着幸福。"
      }
    ]
  },
  {
    "root": "rupt",
    "meaning": "破裂",
    "mnemonic": "ru（汝）+ pt（破它）→ 汝破它 → 破裂",
    "words": [
      {
        "word": "interrupt",
        "level": "四",
        "phonetic": "intə'rʌpt",
        "pos": "v. / n.",
        "cn": "打断；中断；插嘴",
        "analysis": "inter(在中间) + rupt(破裂) → 中途破裂",
        "derivatives": ["interruption (n. 中断 [四])", "uninterrupted (a. 不中断的)"],
        "example_en": "Traffic was interrupted by a dense fog.",
        "example_cn": "交通因浓雾而受阻。"
      },
      {
        "word": "rupture",
        "level": "-",
        "phonetic": "'rʌptʃə",
        "pos": "n. / v.",
        "cn": "破裂；断裂",
        "analysis": "rupt(破裂) + ure",
        "derivatives": [],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "abrupt",
        "level": "-",
        "phonetic": "ə'brʌpt",
        "pos": "a.",
        "cn": "突然的；唐突的",
        "analysis": "ab(强调) + rupt(破裂) → 突兀破开",
        "derivatives": [],
        "example_en": "The abrupt change of schedule gave me lots of trouble.",
        "example_cn": "行程突然改变给我造成许多麻烦。"
      },
      {
        "word": "bankrupt",
        "level": "四",
        "phonetic": "'bæŋkrʌpt",
        "pos": "a. / v. / n.",
        "cn": "破产的；使破产",
        "analysis": "bank(银行) + rupt(破裂) → 银行资金链断裂",
        "derivatives": ["bankruptcy (n. 破产 [四])"],
        "example_en": "That company made him bankrupt.",
        "example_cn": "是那家公司让他破产的。"
      },
      {
        "word": "corrupt",
        "level": "-",
        "phonetic": "kə'rʌpt",
        "pos": "a. / v.",
        "cn": "腐败的；败坏；使腐烂",
        "analysis": "cor(全部) + rupt(破裂) → 品格操守全碎了",
        "derivatives": ["corruption (n. 腐败)", "corruptible (a. 易腐败的)", "incorruptible (a. 不易腐败的)"],
        "example_en": "Bad habit corrupt good manners.",
        "example_cn": "坏习惯败坏好风俗。"
      },
      {
        "word": "erupt",
        "level": "六",
        "phonetic": "i'rʌpt",
        "pos": "v.",
        "cn": "爆发；喷出",
        "analysis": "e(出) + rupt(破裂) → 冲破而出",
        "derivatives": ["eruption (n. 爆发)"],
        "example_en": "Violence has erupted on the streets.",
        "example_cn": "大街上突然发生了暴乱。"
      },
      {
        "word": "disrupt",
        "level": "研",
        "phonetic": "dis'rʌpt",
        "pos": "v.",
        "cn": "分裂；瓦解；扰乱",
        "analysis": "dis(分开) + rupt(破裂)",
        "derivatives": ["disruption (n. 瓦解 [G])", "disruptive (a. 破坏性的)"],
        "example_en": "His speech disrupted the meeting.",
        "example_cn": "他的讲演使会场陷入混乱。"
      }
    ]
  },
  {
    "root": "tract",
    "meaning": "拖，拉",
    "mnemonic": "形似单词 tractor（拖拉机）→ 拖、拉",
    "words": [
      {
        "word": "attract",
        "level": "初",
        "phonetic": "ə'trækt",
        "pos": "v.",
        "cn": "吸引",
        "analysis": "at(强调) + tract(拉) → 强力拉过来",
        "derivatives": ["attraction (n. 吸引力 [四])", "attractive (a. 有吸引力的 [四])", "unattractive (a. 无吸引力的 [六])"],
        "example_en": "The garden city attracts many tourists.",
        "example_cn": "那个花园城市吸引许多游客。"
      },
      {
        "word": "contract",
        "level": "四",
        "phonetic": "'kontrækt",
        "pos": "n. / v.",
        "cn": "契约；收缩",
        "analysis": "com(一起) + tract(拉) → 拉拢到一起签协议；拉紧在一起产生收缩",
        "derivatives": ["contraction (n. 收缩 [四])", "contractual (a. 契约的)", "subcontract (n. 转包合同)"],
        "example_en": "The two businesses contracted a merger.",
        "example_cn": "两家商行签约合并了。"
      },
      {
        "word": "distract",
        "level": "-",
        "phonetic": "dis'trækt",
        "pos": "v.",
        "cn": "分心；分散；打扰",
        "analysis": "dis(分开) + tract(拉) → 注意力被扯散",
        "derivatives": ["distracted (a. 心烦意乱的)", "distraction (n. 消遣；分心)"],
        "example_en": "Children are so easily distracted.",
        "example_cn": "儿童的注意力很不容易集中。"
      },
      {
        "word": "extract",
        "level": "六",
        "phonetic": "ik'strækt",
        "pos": "v. / n.",
        "cn": "拔出；提炼；榨取",
        "analysis": "ex(出) + tract(拉)",
        "derivatives": ["extraction (n. 提炼)"],
        "example_en": "This substance is extracted from seaweed.",
        "example_cn": "这种物质是从海藻中提取的。"
      },
      {
        "word": "subtract",
        "level": "四",
        "phonetic": "səb'trækt",
        "pos": "v.",
        "cn": "减去；扣除",
        "analysis": "sub(下) + tract(拉) → 从总数下拉",
        "derivatives": ["subtraction (n. 减法)"],
        "example_en": "If you subtract 2 from 8, you get 6.",
        "example_cn": "8减去2是6。"
      },
      {
        "word": "retract",
        "level": "G",
        "phonetic": "ri'trækt",
        "pos": "v.",
        "cn": "缩进；撤回；取消",
        "analysis": "re(回) + tract(拉)",
        "derivatives": ["retraction (n. 撤回 [研])", "retractable (a. 可缩回的)"],
        "example_en": "A cat can retract its claws.",
        "example_cn": "猫能缩回爪子。"
      },
      {
        "word": "abstract",
        "level": "-",
        "phonetic": "'æbstrækt",
        "pos": "a. / n. / v.",
        "cn": "抽象的；摘要；提取",
        "analysis": "abs(离去) + tract(拉) → 从具象中拉离概括",
        "derivatives": ["abstraction (n. 抽象；发呆)"],
        "example_en": "Your reasoning seems very abstract.",
        "example_cn": "你的推理似乎很抽象。"
      }
    ]
  },
  {
    "root": "vis, vid",
    "meaning": "看",
    "mnemonic": "visit（参观/看望）、video（录像）→ 均含核心义“看”",
    "words": [
      {
        "word": "visible",
        "level": "-",
        "phonetic": "'vizəbl",
        "pos": "a.",
        "cn": "可见的；明显的",
        "analysis": "vis(看) + ible(能)",
        "derivatives": ["invisible (a. 看不见的)", "vision (n. 视力；眼界)", "visionary (a. 幻想的 [四])", "visual (a. 视觉的)", "visualize (v. 使具体化)"],
        "example_en": "She showed no visible nervousness.",
        "example_cn": "她没有表现出明显的紧张。"
      },
      {
        "word": "advise",
        "level": "初",
        "phonetic": "əd'vaiz",
        "pos": "v.",
        "cn": "劝告；忠告",
        "analysis": "ad(强调) + vis(看) + e → 提出来让人审视",
        "derivatives": ["advice (n. 劝告 [初])", "advisor (n. 顾问)", "advisory (a. 劝告的)", "inadvisable (a. 不明智的)"],
        "example_en": "We advised him against acting in haste.",
        "example_cn": "我们劝他不要匆忙行事。"
      },
      {
        "word": "supervise",
        "level": "四",
        "phonetic": "'sju:pəvaiz",
        "pos": "vt.",
        "cn": "监督；管理",
        "analysis": "super(在上方) + vis(看) + e → 居高临下监视检查",
        "derivatives": ["supervision (n. 管理；监督)"],
        "example_en": "She supervises the whole department.",
        "example_cn": "她管理这整个部门。"
      },
      {
        "word": "evident",
        "level": "四",
        "phonetic": "'evidənt",
        "pos": "a.",
        "cn": "明显的",
        "analysis": "e(出) + vid(看) + ent → 看得出来的",
        "derivatives": ["evidence (n. 证据 [四])"],
        "example_en": "The purpose may not be immediately evident.",
        "example_cn": "这种目的不一定显而易见。"
      },
      {
        "word": "provide",
        "level": "初",
        "phonetic": "prə'vaid",
        "pos": "v.",
        "cn": "供给；提供；预备",
        "analysis": "pro(提前) + vid(看) + e → 预先看见而做好储备",
        "derivatives": ["provision (n. 供应；预备 [四])", "provident (a. 深谋远虑的)", "providence (n. 远见；天佑)", "improvident (a. 浪费的；不顾将来的)"],
        "example_en": "Provision of shelter was their main concern for the disaster victims.",
        "example_cn": "为灾民提供避难处是他们主要关心的事。"
      }
    ]
  },
  {
    "root": "viv, vit, vig",
    "meaning": "生命",
    "mnemonic": "vitamin（维他命=维持生命）；viv/vig 发音“危”→ 危在旦夕关乎生命",
    "words": [
      {
        "word": "vivid",
        "level": "-",
        "phonetic": "'vivid",
        "pos": "a.",
        "cn": "生动的；活泼的",
        "analysis": "viv(生命) + id",
        "derivatives": ["vivacious (a. 活泼的)", "vivacity (n. 活跃)", "vivify (v. 赋予生气)"],
        "example_en": "The actresses were wearing vivid historical costumes.",
        "example_cn": "女演员们穿着鲜艳的古装。"
      },
      {
        "word": "revive",
        "level": "四",
        "phonetic": "ri'vaiv",
        "pos": "vi.",
        "cn": "苏醒；复活",
        "analysis": "re(再) + viv(生命) + e → 重获生命",
        "derivatives": ["revival (n. 复活)", "revivify (v. 使复苏)"],
        "example_en": "The half-drowned swimmer has revived.",
        "example_cn": "淹得半死的游泳者已经苏醒了。"
      },
      {
        "word": "survive",
        "level": "-",
        "phonetic": "sə'vaiv",
        "pos": "vi.",
        "cn": "幸存；活下来",
        "analysis": "sur(在下/越过) + viv(生命) + e → 从灾难中存活出来",
        "derivatives": ["survival (n. 幸存)"],
        "example_en": "Few survived after the flood.",
        "example_cn": "洪水后极少有人生还。"
      },
      {
        "word": "vital",
        "level": "托",
        "phonetic": "'vaitl",
        "pos": "a.",
        "cn": "生死攸关的；至关重要的；有活力的",
        "analysis": "vit(生命) + al",
        "derivatives": ["vitality (n. 活力 [四])", "vitals (n. 要害器官)", "vitalize (v. 赋予生命 [四])", "revitalize (v. 恢复活力)"],
        "example_en": "The heart is a vital organ.",
        "example_cn": "心脏是维持生命必须的器官。"
      },
      {
        "word": "vigor",
        "level": "四",
        "phonetic": "'vigə",
        "pos": "n.",
        "cn": "精力；活力",
        "analysis": "vig(生命) + or",
        "derivatives": ["vigorous (a. 精力旺盛的 [四])", "invigorate (v. 鼓舞；使强壮)", "invigorating (a. 激发精神的)"],
        "example_en": "He flung himself into his work with renewed vigor.",
        "example_cn": "他又精神抖擞地投入自己的工作。"
      }
    ]
  },
  {
    "root": "voc, vok",
    "meaning": "叫喊，声音",
    "mnemonic": "vok = v(胜利) + ok → 成功了欢呼大喊；voc为其辅音音变",
    "words": [
      {
        "word": "vocal",
        "level": "-",
        "phonetic": "'vəukəl",
        "pos": "a. / n.",
        "cn": "发声的；口头的；元音",
        "analysis": "voc(声音) + al",
        "derivatives": ["vocalist (n. 歌手)", "vocabulary (n. 词汇 [G])", "vociferous (a. 喧闹大喊的)"],
        "example_en": "The tongue is one of the vocal organs.",
        "example_cn": "舌头是发声器官之一。"
      },
      {
        "word": "advocate",
        "level": "四",
        "phonetic": "'ædvəkit",
        "pos": "v. / n.",
        "cn": "提倡；拥护；拥护者",
        "analysis": "ad(强调) + voc(喊) + ate → 大声疾呼主张",
        "derivatives": ["advocacy (n. 拥护 [G])"],
        "example_en": "He advocates reforming the prison system.",
        "example_cn": "他主张改良监狱制度。"
      },
      {
        "word": "revoke",
        "level": "研",
        "phonetic": "ri'vəuk",
        "pos": "vt.",
        "cn": "撤回；废除；吊销",
        "analysis": "re(回) + vok(喊) + e → 呼喊收回",
        "derivatives": ["revocation (n. 废除)", "revocable (a. 可废除的)", "irrevocable (a. 不能改变的)"],
        "example_en": "The police revoked his driver's license.",
        "example_cn": "那警察吊销了他的驾驶执照。"
      },
      {
        "word": "provoke",
        "level": "-",
        "phonetic": "prə'vəuk",
        "pos": "vt.",
        "cn": "激怒；煽动",
        "analysis": "pro(前面) + vok(喊) + e → 当面大叫叫嚣",
        "derivatives": ["provocation (n. 激怒)", "unprovoked (a. 无端挑衅的)"],
        "example_en": "If you provoke the dog, he may bite you.",
        "example_cn": "你如果激怒了这条狗，它可能会咬你。"
      },
      {
        "word": "evoke",
        "level": "研",
        "phonetic": "i'vəuk",
        "pos": "vt.",
        "cn": "唤起；唤醒",
        "analysis": "e(出) + vok(喊) + e → 呼唤出来",
        "derivatives": ["evocative (a. 唤起的)"],
        "example_en": "That old movie evoked memories of my childhood.",
        "example_cn": "那部旧电影唤起了我童年的记忆。"
      }
    ]
  },
  {
    "root": "volv, vol",
    "meaning": "转，卷",
    "mnemonic": "源自 Volvo（沃尔沃汽车）其轮子飞转",
    "words": [
      {
        "word": "revolve",
        "level": "-",
        "phonetic": "ri'volv",
        "pos": "v.",
        "cn": "旋转；循环",
        "analysis": "re(反复) + volv(转) + e",
        "derivatives": ["revolution (n. 革命；公转 [初])", "revolutionary (a. 革命的)", "revolver (n. 左轮手枪)"],
        "example_en": "My life revolves around my job.",
        "example_cn": "我的工作是我生活的中心。"
      },
      {
        "word": "evolve",
        "level": "研",
        "phonetic": "i'volv",
        "pos": "v.",
        "cn": "进化；发展",
        "analysis": "e(出) + volv(转) + e → 展开辗转演进",
        "derivatives": ["evolution (n. 进化 [国])", "evolutionism (n. 进化论)"],
        "example_en": "He have evolve a new theory after many year of research.",
        "example_cn": "他经过多年的研究，逐渐总结出了新的理论。"
      },
      {
        "word": "involve",
        "level": "-",
        "phonetic": "in'volv",
        "pos": "v.",
        "cn": "卷入；牵涉；包含",
        "analysis": "in(进) + volv(转) + e → 卷进去",
        "derivatives": ["involved (a. 复杂的；卷入的 [四])", "involvement (n. 卷入)"],
        "example_en": "That's no concern of mine. I'm not involved.",
        "example_cn": "那与我无关，我未卷入。"
      },
      {
        "word": "volume",
        "level": "-",
        "phonetic": "'volju:m",
        "pos": "n.",
        "cn": "卷；册；体积；音量",
        "analysis": "vol(卷) + ume",
        "derivatives": ["voluminous (a. 多卷的；庞大的 [G])"],
        "example_en": "That encyclopedia is in twenty volumes.",
        "example_cn": "那套百科全书有20卷。"
      },
      {
        "word": "voluntary",
        "level": "托",
        "phonetic": "'voləntəri",
        "pos": "a.",
        "cn": "自愿的；志愿的",
        "analysis": "vol(意志/意愿) + untary",
        "derivatives": ["volunteer (n. 志愿者)", "involuntary (a. 不由自主的)", "benevolent (a. 善心的/仁慈的)", "malevolent (a. 恶意的)"],
        "example_en": "She was a voluntary helper.",
        "example_cn": "她是自愿帮忙的。"
      }
    ]
  },
  {
    "root": "vor",
    "meaning": "吃",
    "mnemonic": "读：“窝（头）”→ 窝头是用来吃的",
    "words": [
      {
        "word": "devour",
        "level": "-",
        "phonetic": "di'vauə",
        "pos": "v.",
        "cn": "吞吃；吞没",
        "analysis": "de(向下) + vour(吃) → 狠狠吃下去",
        "derivatives": ["voracity (n. 贪食；贪婪)", "voracious (a. 狼吞虎咽的)"],
        "example_en": "The flames devoured the entire building.",
        "example_cn": "火焰吞没了整栋大楼。"
      },
      {
        "word": "carnivorous",
        "level": "-",
        "phonetic": "ka:'nivərəs",
        "pos": "a.",
        "cn": "食肉的",
        "analysis": "carn(肉) + i + vor(吃) + ous",
        "derivatives": ["carnivore (n. 食肉动物)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "herbivorous",
        "level": "研",
        "phonetic": "hə:'bivərəs",
        "pos": "a.",
        "cn": "食草的",
        "analysis": "herb(草) + i + vor(吃) + ous",
        "derivatives": ["herbivore (n. 食草动物)"],
        "example_en": "The camel is a herbivorous animal.",
        "example_cn": "骆驼是一种食草动物。"
      },
      {
        "word": "omnivorous",
        "level": "-",
        "phonetic": "om'nivərəs",
        "pos": "a.",
        "cn": "杂食的；无所不读的",
        "analysis": "omni(全部) + vor(吃) + ous",
        "derivatives": ["insectivorous (a. 食虫的)"],
        "example_en": "He is omnivorous of books.",
        "example_cn": "他什么书都读。"
      }
    ]
  },
  {
    "root": "zoo",
    "meaning": "动物",
    "mnemonic": "源自单词 zoo（动物园）",
    "words": [
      {
        "word": "zoology",
        "level": "G",
        "phonetic": "zəu'olədʒi",
        "pos": "n.",
        "cn": "动物学",
        "analysis": "zoo(动物) + logy(学科)",
        "derivatives": ["zootomy (n. 动物解剖学 [研])"],
        "example_en": "The professorship of zoology is vacant and has been advertised.",
        "example_cn": "动物学教授的职位空缺，已登广告招聘。"
      },
      {
        "word": "zoic",
        "level": "E",
        "phonetic": "'zəuik",
        "pos": "a.",
        "cn": "动物的；有生物的",
        "analysis": "zo(动物) + ic",
        "derivatives": ["azoic (a. 无生命的)"],
        "example_en": "",
        "example_cn": ""
      },
      {
        "word": "zodiac",
        "level": "G",
        "phonetic": "'zəudiæk",
        "pos": "n.",
        "cn": "黄道带；十二宫图；属相",
        "analysis": "zo(动物) + diac(名词后缀) → 以黄道动物周期记年",
        "derivatives": [],
        "example_en": "The zodiac is used in astrology to predict the future.",
        "example_cn": "十二宫图用于占星术中预测未来。"
      }
    ]
  }
]
```

---

### 三、 核心词根汇总速览表（Markdown 视图）

| 序号 | 词根                | 核心释义   | 联想巧记法                                   | 典型单词（带难度级别）                                       | 核心派生/引申词                                 |
| :--- | :------------------ | :--------- | :------------------------------------------- | :----------------------------------------------------------- | :---------------------------------------------- |
| 1    | **not**             | 知道，注意 | not（不）→“不知者不怪”把“不”和“知道”联系起来 | note [初], notify, notion, notice, notable, annotate [研], denote [研] | noted, notion, notorious, annotation, connote   |
| 2    | **nov**             | 新         | novel（新奇的/小说）                         | novel [四], novice [四], nova [四], innovate, renovate [研]  | novelty, novelette, innovation, supernova       |
| 3    | **numer**           | 数目       | number 辅音脱落去 b                          | numerable [四], numerous, numerate, enumerate, alphanumeric [G] | innumerable, numeral, numerology, supernumerary |
| 4    | **nunci, nounce**   | 讲话，说出 | nun（喃）+ci（词）→喃喃有词                  | announce [初], denounce, pronounce [初], renounce [G], enunciate | announcement, pronunciation, nuncio [G]         |
| 5    | **onym**            | 名字       | on + ym（郁闷）→名字让人郁闷                 | anonymous, pseudonym [研], synonym, antonym, acronym [G]     | onymous, homonym, patronymic [G]                |
| 6    | **oper**            | 工作       | 读：“袄破”→穿破袄干活工作                    | opera, operate, cooperate, operable [G]                      | operatic, operose, inoperative, preoperative    |
| 7    | **opt**             | 选择；视力 | 读：“袄破他”→视力差选了破袄                  | opt [四], option [四], adopt [四], optic, synopsis           | optical, optometer, myopia, biopsy              |
| 8    | **ora**             | 嘴，说     | or（嗷）+ a（啊）→小孩学说话                 | oral [初], orate [四], oration, adore, oracle                | orator, peroration, adorable, inexorable        |
| 9    | **ordin**           | 命令，顺序 | ord(order) + in                              | order, ordinary [初], subordinate, coordinate, ordinal       | disorder, ordain, extraordinary, inordinate     |
| 10   | **ori, orig**       | 升起，开始 | o（太阳）+ ri（日）→旭日升起                 | origin, orient, aborigine [G], abort [G]                     | oriental, orientation [六], abortive            |
| 11   | **orn**             | 装饰       | or(或) + n(门) →装个门装饰一下               | adorn, ornate [正], ornament, suborn [G]                     | unadorned, inornate, ornamentation              |
| 12   | **par**             | 平等       | 读：“怕”→不患贫而患不均（怕不平等）          | parity [托], compare [初], nonpareil, disparage, peer [四]   | disparity, peerless, incomparable               |
| 13   | **pass**            | 通过；感情 | pass（通过）→感情要经受考验                  | passport [初], compass [四], surpass [六], passion [四], compassion [四], passive [四] | bypass, passage, impasse, compatible            |
| 14   | **path**            | 感情，痛苦 | path（小路）漫步谈感情                       | sympathy [四], antipathy [G], empathy [G], pathos, pathetic, apathy [正] | telepathy, pathology, sociopath                 |
| 15   | **patr(i)**         | 父亲       | pa(怕)+t(他)+r(人)→最怕父亲                  | patron, patriot, patriarch, patrimony [G], repatriate, patrician | compatriot, paternity, expatriate               |
| 16   | **ped**             | 脚；儿童   | 读：“派的”（脚走）；读：“拍的”（抚育儿童）   | expedition [四], pedal, peddle, pedestal [四], centipede, impede, pedagogy [G], pediatrics | pedestrian, biped, encyclopedia, orthopedics    |
| 17   | **pel, puls**       | 驱动，推   | pel 读“派呦”；puls 形似 pull                 | compel [四], expel, propel [四], repel [四], impel, dispel, pulse [四] | compulsory, propeller, repulsive, impulse       |
| 18   | **pen, pun**        | 惩罚       | pen读“判”；pun（曝尸大门）                   | punish [初], penal, penitence, repent [四], subpoena [G]     | impunity, penalty, penitentiary, repentance     |
| 19   | **pend, pens(1)**   | 花费       | pend读“盼的”（盼工资花）；pens读“盼死”       | expend [四], spend [初], pension [四], pensive [G], dispense [四], compensate [四] | expense, dispensary, recompense, propensity     |
| 20   | **pend, pens(2)**   | 悬挂；称重 | 心下悬挂；挂秤砣引申为量重（pond）           | suspend [四], pendent [G], append, depend [初], ponder [四], perpendicular | suspense, pendulum, appendix, independent       |
| 21   | **per**             | 冒险，危险 | 读：“魄”→冒险需要魄力                        | experience [初], experiment [初], peril [四], empiric        | inexperience, perilous, empirical               |
| 22   | **pet**             | 追寻，寻求 | 单词 pet（宠物）追寻主人                     | compete [初], appetite [四], petition, impetus, perpetual [六], petulant, repeat [初] | competitor, centripetal, repeat, propitiate     |
| 23   | **phag**            | 吃         | 读：“佛格”→佛龛格子上全是供品吃的            | zoophagous [G], phytophagous [G], anthropophagous, esophagus, sarcophagus [G] | -                                               |
| 24   | **phil**            | 爱         | 来自 Philip（飞利浦家电人人爱）              | philosophy, philanthropy [六], philology [研], neophilia, hemophilia [G] | zoophilous, bibliophile, hemophilic             |
| 25   | **phon**            | 声音       | 读：“风”→声音由气流振动发出                  | microphone [四], symphony, phonetics, euphony [G], cacophony, homophone | telephone, megaphone, stereophonic              |
| 26   | **plat**            | 平坦       | 形似 flat（平的）                            | plate [初], plateau, platitude [正], platform [初]           | plated, electroplate                            |
| 27   | **ple, pli, ply**   | 满，填满   | ple（跑了）→水满溢出跑了                     | plenty [初], replenish [四], complete [四], replete [G], complement [四], supply [初], implement [四] | plentiful, accomplish, compliment, deplete      |
| 28   | **plor**            | 喊，哭     | 读：“扑老”→扑到老人怀里大哭                  | explore, implore, deplore                                    | explorer, deplorable, exploration               |
| 29   | **ply, plex, plic** | 重叠，折叠 | ply“铺来”别叠；plex=满(+)再加即叠            | apply, imply, comply, simply [初], complex, multiply, perplex [G], explicate, duplicate [日] | applicant, explicit, simplicity, supple         |
| 30   | **polic, polis**    | 国家，城市 | 读：“坡立四”→山坡立四个城邦                  | police [初], politics [初], policy [初], metropolis [四], cosmopolis, acropolis [G] | politician, metropolitan, megalopolis           |
| 31   | **pon, pound**      | 放置       | pon（破门把球踢入）；pound（英镑放好）       | propound [研], compound, expound [G], impound [G], postpone [初], opponent | proponent, component, exposition                |
| 32   | **popul, publ**     | 人民       | 单词 population 与 public                    | population [初], popular [初], populous, public [初], publish [初] | populace, popularity, publication               |
| 33   | **port**            | 搬，运     | 单词 port（港口工人搬运）                    | portable [四], export [四], import [四], transport [四], deport, support [初], report [初], opportune [G] | porter, deportation, reporter, opportunity      |
| 34   | **pos, posit**      | 放，摆     | 摆 pose（姿势）；posit（放置它）             | compose [四], impose [四], oppose [四], propose [四], suppose [初], expose [四], dispose [四], deposit [四] | composition, opposite, disposal, depot          |
| 35   | **prais, preci**    | 价值       | 谐音单词 price（价格/价值）                  | appreciate [初], precious [初], depreciate, appraise         | appreciable, semiprecious, appraisal            |
| 36   | **prehens**         | 抓住       | hand（手）反复抓                             | comprehend [六], apprehend [六], reprehend [G]               | comprehensive, apprentice, reprehensible        |
| 37   | **prem, prim**      | 第一，首要 | pre（前）+m（门）→立于首门                   | prime [四], premier [六], primitive                          | primarily, primary, primeval, primate           |
| 38   | **press**           | 挤压       | 单词 press（挤压）                           | compress, impress [四], express [初], oppress, depress [六], suppress [四] | impressive, expression, depression, repress     |
| 39   | **pris**            | 拿住，抓住 | pr（仆人）+ is →抓来的俘虏是仆人             | prison [初], surprise [初], comprise [四], enterprise, apprise [G] | prisoner, imprisonment, reprisal                |
| 40   | **priv**            | 个人，私人 | 单词 private（私人的）                       | private [初], privilege, privy [四], deprive                 | privacy, privatize, deprivation                 |
| 41   | **prob, prov**      | 测试，证明 | 单词 prove 辅音音变（v→b）                   | prove [初], probe [四], probable [初], probation [日], approbation [正] | proof, approve, improbable, reprobate           |
| 42   | **proper, propr**   | 拥有；恰当 | 跑在前面的每个人都能拥有相应奖品             | property [四], propriety, appropriate [四]                   | proprietor, improper, expropriate               |
| 43   | **pugn**            | 打斗       | 读：“胖嗯”→一顿胖揍打斗                      | pugnacious [G], impugn [G], repugnance [G]                   | pugnacity, pugilism, expugnable                 |
| 44   | **pur, purg**       | 使净化     | pur（仆人打扫）；purg（仆人干活使干净）      | pure [初], purify, purge, expurgate [G]                      | purity, puritan, purgative                      |
| 45   | **put**             | 认为，思考 | put（放）→换位思考                           | compute, putative [四], dispute [四], repute, impute, depute [G], amputate | computer, reputation, indisputable, deputy      |
| 46   | **quest, quer**     | 寻求，询问 | 单词 question（问题）                        | question [初], conquest, inquest, request [初], acquire [四], inquire [四], require [四] | questionnaire, acquisition, requisite           |
| 47   | **quiet, qui**      | 静         | 单词 quiet（安静）                           | quiet [初], disquiet [研], quiescence, acquiesce, requiem    | quietude, disquieting, acquiescent              |
| 48   | **quit**            | 自由，离开 | qu（去）+ it →去掉束缚得自由                 | quit, acquit, requite [研], ubiquitous [正]                  | quitter, acquittal, unrequited                  |
| 49   | **rad, radic**      | 根；放射   | radar（雷达放射）；树根呈放射状              | radical [六], eradicate [研], radiate                        | radicle, radiation, radiant, radius             |
| 50   | **rupt**            | 破裂       | ru（汝）+ pt（破它）                         | interrupt [四], rupture, abrupt, bankrupt [四], corrupt, erupt [六], disrupt [研] | bankruptcy, corruption, eruption                |
| 51   | **tract**           | 拖，拉     | tractor（拖拉机）                            | attract [初], contract [四], distract, extract [六], subtract [四], retract [G], abstract | attraction, contraction, extraction             |
| 52   | **vis, vid**        | 看         | visit（参观）、video（录像）                 | visible, advise [初], supervise [四], evident [四], provide [初] | vision, advice, evidence, provision             |
| 53   | **viv, vit, vig**   | 生命       | vitamin（维他命）；viv 读“危危”（生命垂危）  | vivid, revive [四], survive, vital [托], vigor [四]          | vivacious, revival, vitality, invigorate        |
| 54   | **voc, vok**        | 叫喊，声音 | 胜利 OK 大声喊（v+ok）                       | vocal, advocate [四], revoke [研], provoke, evoke [研]       | vocabulary, revocation, evocative               |
| 55   | **volv, vol**       | 转，卷     | 沃尔沃汽车轮子飞转（Volvo）                  | revolve, evolve [研], involve, volume, voluntary [托]        | revolution, evolution, involved, volunteer      |
| 56   | **vor**             | 吃         | 读：“窝头”→窝头用来吃                        | devour, carnivorous, herbivorous [研], omnivorous            | voracious, carnivore, insectivorous             |
| 57   | **zoo**             | 动物       | 单词 zoo（动物园）                           | zoology [G], zoic [E], zodiac [G]                            | zootomy, azoic                                  |