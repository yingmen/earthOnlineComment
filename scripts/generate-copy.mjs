import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const TODAY = new Date()
const DATE_STR = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`

async function fetchWeiboHotSearch() {
  return new Promise((resolve) => {
    const url = 'https://weibo.com/ajax/side/hotSearch'
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          const realtime = json?.data?.realtime || []
          const hotTopics = realtime
            .filter(item => item.word)
            .slice(0, 15)
            .map(item => item.word)
          if (hotTopics.length > 0) return resolve(hotTopics)
        } catch { }
        resolve(null)
      })
    }).on('error', () => resolve(null))
  })
}

async function fetchBaiduHotSearch() {
  return new Promise((resolve) => {
    const url = 'https://top.baidu.com/board?tab=realtime'
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        const matches = data.match(/"word":"([^"]+)"/g)
        if (matches && matches.length > 0) {
          const topics = matches.slice(0, 15).map(m => m.replace(/"word":"/, '').replace(/"$/, ''))
          return resolve(topics)
        }
        resolve(null)
      })
    }).on('error', () => resolve(null))
  })
}

const FALLBACK_HOT_TOPICS = [
  'iPhone 17 Pro Max 发布',
  '618 电商大促开启',
  '王者荣耀新赛季更新',
  '原神 6.0 版本上线',
  '端午节放假安排',
  '高考成绩即将公布',
  '支付宝年度账单',
  '特斯拉 Cybertruck 国内交付',
  '周杰伦演唱会门票秒罄',
  '夏天第一杯奶茶',
  '全国多地高温预警',
  'Steam 夏季促销',
  'B站UP主百大评选',
  '五一调休引热议',
  'ChatGPT 5.0 发布',
  '小米 SU7 交付量破万',
  'LOL 全球总决赛赛程',
  '华为 HarmonyOS 升级',
  '拼多多百亿补贴',
  '抖音本地生活新政策',
]

const PAST_EVENTS = [
  { title: '新冠疫情防控全面放开', date: '2022年12月' },
  { title: 'ChatGPT 横空出世', date: '2022年11月' },
  { title: '北京冬奥会开幕', date: '2022年2月' },
  { title: '俄乌冲突爆发', date: '2022年2月' },
  { title: '恒大暴雷事件', date: '2021年12月' },
  { title: '河南暴雨灾害', date: '2021年7月' },
  { title: '东京奥运会开幕', date: '2021年7月' },
  { title: 'SpaceX 星舰试飞', date: '2023年4月' },
  { title: '室温超导LK-99热议', date: '2023年7月' },
  { title: '日本核污水排海', date: '2023年8月' },
]

const HOT_MEMES = [
  '家人们谁懂啊', '绝绝子', '蚌埠住了', '破防了', '我真的会谢',
  '主打一个', '你是真滴皮', '上头了', '退退退', 'YYDS',
  '格局打开', 'CPU烧了', '开局一张图', '懂的都懂', '栓Q',
  '吨吨吨', '你是我的神', '这把高端局', '天花板', '已老实',
]

function randomChoice(arr, count = 1) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return count === 1 ? shuffled[0] : shuffled.slice(0, count)
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateSystemNotice(hotTopic) {
  const meme = randomChoice(HOT_MEMES)
  const types = ['系统公告', '副本速报', '紧急通知', '版本更新']
  const type = randomChoice(types)
  const difficulties = ['简单', '普通', '困难', '噩梦', '地狱']
  const difficulty = randomChoice(difficulties)
  const scopes = ['全国范围', '全球范围', '局部地区', '线上全域', '线下实体']
  const scope = randomChoice(scopes)

  const titleTemplates = [
    `${type}：${hotTopic}`,
    `⚠️ ${type} | ${hotTopic}`,
    `【${type}】${hotTopic} 已触发`,
  ]
  const title = randomChoice(titleTemplates)

  const contentTemplates = [
    `📢 ${title}\n\n` +
    `**事件概述**：${hotTopic} 已于今日触发，当前副本难度评定为【${difficulty}】。` +
    `${scope}内的玩家请注意，本次事件可能影响您的日常生活进程。${meme}！\n\n` +
    `**影响评估**：涉及玩家约 ${randomInt(100, 9999)} 万人，建议提前做好应对准备。\n\n` +
    `**系统建议**：请根据自身等级和装备情况，合理分配资源和精力，避免因准备不足导致的负面状态。`,

    `⚔️ ${title}\n\n` +
    `📊 **副本参数**\n` +
    `- 难度等级：${difficulty}（${'★'.repeat(difficulties.indexOf(difficulty) + 1)}）\n` +
    `- 影响范围：${scope}\n` +
    `- 预计持续：${randomInt(1, 30)} 天\n` +
    `- 涉及玩家：${randomInt(50, 9999)} 万\n\n` +
    `📝 **事件描述**\n${hotTopic}，懂的都懂。这一波操作属实让人蚌埠住了，` +
    `建议各位玩家理性看待，合理规划自己的资源分配。`,

    `🔔 ${title}\n\n` +
    `全体玩家注意：${hotTopic} 副本已开启！\n` +
    `当前难度：${difficulty} | 推荐等级：Lv.${randomInt(10, 80)}+ | 组队推荐：${randomChoice(['单人', '双人', '3-5人小队', '组团'])}\n\n` +
    `🎯 **通关提示**：${meme}，主打一个心态放平。` +
    `通关奖励：经验值+${randomInt(100, 9999)}，金币+${randomInt(500, 50000)}。`,
  ]

  return randomChoice(contentTemplates)
}

function generateReviewCopy() {
  const pastEvent = randomChoice(PAST_EVENTS)
  const meme = randomChoice(HOT_MEMES)
  const rating = randomInt(1, 5)

  const reviewTemplates = [
    `## ⭐ 评价卡片\n\n` +
    `**评分**：${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}（${['差评', '一般', '还行', '好评', '神作'][rating - 1]}）\n\n` +
    `**梗标签**：#${randomChoice(['强制登录', '不能存档', '零氪生存', '随机出生点', '无新手教程', 'NPC太真实', '不能退出', '全服PVP'])}\n\n` +
    `**评价内容**：\n` +
    `回想 ${pastEvent.date} 的「${pastEvent.title}」事件，只能说地球Online这个游戏做得太真实了。` +
    `${meme}，策划你是真滴皮，这剧情线写得比编剧还离谱。` +
    `玩了这么多年，这游戏的核心玩法就是「随机应变」，没有攻略，没有存档点，主打一个硬核生存。` +
    `${rating >= 4 ? '虽然难度高，但体验拉满，值得推荐。' : '难度太高了，建议新手空降前做好心理准备。'}` +
    `\n\n**游戏时长**：已游玩 ${randomInt(100, 20000)} 天`,

    `## ⭐ 评价卡片\n\n` +
    `**评分**：${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}（${['差评', '一般', '还行', '好评', '神作'][rating - 1]}）\n\n` +
    `**梗标签**：#${randomChoice(['物理引擎拉满', '社交系统复杂', '昼夜循环', '赛季更新', '画风写实', '剧情太长'])}\n\n` +
    `**评价内容**：\n` +
    `从「${pastEvent.title}」这个版本更新就能看出来，策划根本没打算让玩家好过。` +
    `这游戏的自由度太高了，高到有时候我怀疑自己到底是在玩游戏还是被游戏玩。${meme}！` +
    `画面表现：写实风拉满，沉浸感确实强；` +
    `社交系统：复杂到需要单独写一本攻略书；` +
    `总体而言：${rating >= 4 ? '瑕不掩瑜，依然是市面上最好的开放世界游戏。' : '建议优化一下新手引导，不然劝退率太高了。'}` +
    `\n\n**游戏时长**：已游玩 ${randomInt(100, 20000)} 天`,
  ]

  return randomChoice(reviewTemplates)
}

function generatePlayerLogCopy() {
  const meme = randomChoice(HOT_MEMES)
  const hp = randomInt(30, 95)
  const mood = randomInt(20, 90)
  const gold = randomInt(100, 9999)

  const taskPool = [
    '早高峰地铁副本', '工作会议BOSS战', '月末绩效评估', '超市补给采购',
    '早八打卡挑战', '甲方需求变更应对', '房租缴纳倒计时', '快递驿站取件',
    '外卖优惠券凑单', '体检报告查询', '信用卡还款', '朋友圈点赞社交',
    '深夜emo抵抗', '周末大扫除', '家长电话回访', '职场甩锅防御',
  ]
  const dailyTasks = pickN(taskPool, randomInt(3, 5))
  const doneCount = randomInt(1, dailyTasks.length - 1)

  const noteTemplates = [
    `又是平平无奇的一天。${meme}，日常任务清得差不多了，还剩几个明日再说。` +
    `心态放平，反正这游戏又不会因为我摆烂就关服。`,

    `今日总结：${doneCount}/${dailyTasks.length} 任务完成。` +
    `${hp < 40 ? '血量告急，急需补充能量。' : hp < 70 ? '状态一般，还能再战。' : '今日状态在线，效率拉满！'} ` +
    `${meme}，明天继续肝。`,

    `系统提示：本日玩家活跃度 ${randomInt(30, 100)}%。` +
    `${mood < 30 ? '心情值过低，建议立即进行休闲活动恢复。' : '心情稳定，正常运转中。'} ` +
    `金币余额：${gold}，${gold < 500 ? '即将破产，建议开启省钱模式。' : gold < 3000 ? '勉强够用，还需努力搬砖。' : '财务状况良好，继续保持。'} ` +
    `${meme}`,
  ]

  const taskLines = dailyTasks.map((t, i) => `  ${i < doneCount ? '✅' : '⬜'} ${t}`).join('\n')

  return `## 📋 玩家日志

**玩家ID**：${randomChoice(['匿名冒险者', '打工人小王', '咸鱼玩家', '肝帝本帝', '佛系玩家233', '夜猫子选手'])}

**日期**：${DATE_STR}

---

### 📊 状态面板

| 状态 | 数值 | 状态条 |
|------|------|--------|
| ❤️ HP | ${hp}/100 | ${'█'.repeat(Math.floor(hp / 10))}${'░'.repeat(10 - Math.floor(hp / 10))} |
| 😊 心情 | ${mood}/100 | ${'█'.repeat(Math.floor(mood / 10))}${'░'.repeat(10 - Math.floor(mood / 10))} |
| 💰 金币 | ${gold} | — |

### 📋 今日任务

${taskLines}

---

### 💬 日志附言

${randomChoice(noteTemplates)}

> 🎮 地球Online · 玩家日志 | #地球Online`
}

function generateGuideCopy() {
  const meme = randomChoice(HOT_MEMES)
  const pastEvent = randomChoice(PAST_EVENTS)

  const guideTypes = [
    {
      title: '租房副本通关攻略',
      difficulty: randomInt(3, 5),
      steps: [
        { text: '确认房源信息，查看产权证明', cost: '精力-30', reward: 'EXP+200' },
        { text: '实地考察房屋状况及周边环境', cost: '精力-40', reward: 'EXP+300' },
        { text: '仔细阅读合同条款，注意隐藏费用', cost: '精力-50', reward: 'EXP+500' },
        { text: '押金支付与钥匙交接', cost: '金币-3000', reward: '租房合同×1' },
      ],
      rewards: { exp: 'EXP+1500', gold: '金币-3000', items: '租房合同×1' },
      tip: '建议组队前往，可提升谈判成功率。特别注意押金退还条款，这是本副本最常见的陷阱。',
    },
    {
      title: '职场新人入职攻略',
      difficulty: randomInt(2, 4),
      steps: [
        { text: '准备简历及面试作品集', cost: '精力-50', reward: 'EXP+300' },
        { text: '参加面试，展示核心技能', cost: '精力-60', reward: 'EXP+500' },
        { text: '收到Offer，确认薪资结构', cost: '金币收入+5000', reward: 'OFFER×1' },
        { text: '办理入职手续，熟悉团队', cost: '精力-40', reward: 'EXP+400' },
      ],
      rewards: { exp: 'EXP+1200', gold: '月薪+5000', items: '正式工牌×1' },
      tip: '首月为试用期，此阶段受到伤害减免50%。主动与NPC同事互动可触发隐藏好感度任务。',
    },
    {
      title: '618大促生存指南',
      difficulty: randomInt(2, 5),
      steps: [
        { text: '提前加购物车，关注价格变动', cost: '精力-20', reward: '优惠情报+1' },
        { text: '领取平台优惠券和红包', cost: '时间消耗-15min', reward: '金币保护+200' },
        { text: '对比不同平台价格，选择最优方案', cost: '精力-30', reward: 'EXP+300' },
        { text: '理性下单，避免冲动消费', cost: '意志力-50', reward: '钱包存活率+80%' },
      ],
      rewards: { exp: 'EXP+800', gold: '省下500-2000', items: '购物战利品×N' },
      tip: '本副本核心机制是「价格波动」，设置价格提醒可自动触发最佳购买时机。',
    },
    {
      title: '假期出行规划攻略',
      difficulty: randomInt(2, 4),
      steps: [
        { text: '确定目的地和出行时间', cost: '精力-20', reward: 'EXP+200' },
        { text: '预订交通和住宿', cost: '金币-1000~3000', reward: '行程单×1' },
        { text: '制定游玩路线和景点清单', cost: '精力-30', reward: 'EXP+300' },
        { text: '准备出行装备和应急物品', cost: '金币-500', reward: '出行Buff+1' },
      ],
      rewards: { exp: 'EXP+1000', gold: '旅行体验+Max', items: '美好回忆×∞' },
      tip: '节假日出行属于高难度副本，建议错峰出行可大幅降低难度评级。提前预订可享受早鸟折扣Buff。',
    },
  ]

  const guide = randomChoice(guideTypes)
  const diffText = ['', 'E级', 'D级', 'C级', 'B级', 'S级']
  const stepsMd = guide.steps.map((step, i) =>
    `  **第${i + 1}步**：${step.text}\n  ${step.cost ? `  > ⚡ 技能消耗：${step.cost}` : ''}\n  ${step.reward ? `  > ✨ 奖励：${step.reward}` : ''}`
  ).join('\n\n')

  return `## 📖 新手攻略

**攻略标题**：${guide.title}

**难度评级**：${'★'.repeat(guide.difficulty)}${'☆'.repeat(5 - guide.difficulty)}（${diffText[guide.difficulty]}）

**参考事件**：${pastEvent.title}（${pastEvent.date}）—— 参考该事件的经验总结，${meme}

---

### 📝 攻略步骤

${stepsMd}

---

### 🎯 任务奖励

| 奖励类型 | 内容 |
|----------|------|
| ⭐ 经验值 | ${guide.rewards.exp} |
| 💰 金币 | ${guide.rewards.gold} |
| 🎁 额外 | ${guide.rewards.items} |

### 💡 温馨提示

> ${guide.tip}

---

> 🌍 地球Online · 新手村任务 | #地球Online`
}

function buildMarkdown(sections) {
  const lines = [
    `# 🌍 地球Online 文案生成`,
    ``,
    `> 生成日期：${DATE_STR}`,
    `> 风格：娱乐 · 高效玩梗 · 游戏化表达`,
    `> 系统版本：地球Online v1.0`,
    ``,
    `---`,
    ``,
  ]

  for (const section of sections) {
    lines.push(section)
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}

function getHistoryFiles() {
  const root = ROOT
  const history = []
  try {
    const items = fs.readdirSync(root)
    for (const item of items) {
      const itemPath = path.join(root, item)
      if (fs.statSync(itemPath).isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(item)) {
        const files = fs.readdirSync(itemPath).filter(f => f.endsWith('.md'))
        for (const file of files) {
          const filePath = path.join(itemPath, file)
          const content = fs.readFileSync(filePath, 'utf-8')
          history.push({ dir: item, file, content, filePath })
        }
      }
    }
  } catch { }
  return history
}

function isDuplicate(newContent, history) {
  const newHash = hashContent(newContent)
  for (const h of history) {
    if (hashContent(h.content) === newHash) return true
  }
  return false
}

function hashContent(content) {
  let hash = 0
  const text = content.replace(/\s+/g, '').slice(0, 200)
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash
}

function getOutputDir() {
  const dir = path.join(ROOT, DATE_STR)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

async function main() {
  console.log('🌍 地球Online 文案生成器')
  console.log(`📅 日期：${DATE_STR}`)
  console.log('')

  console.log('🔍 正在获取实时热点...')
  let hotTopics = await fetchWeiboHotSearch()
  if (!hotTopics) {
    console.log('  ⚠️ 微博热搜获取失败，尝试百度热搜...')
    hotTopics = await fetchBaiduHotSearch()
  }
  if (!hotTopics) {
    console.log('  ⚠️ 网络获取失败，使用内置热点数据')
    hotTopics = pickN(FALLBACK_HOT_TOPICS, 5)
  } else {
    hotTopics = pickN(hotTopics, 5)
  }
  console.log(`  ✅ 获取到 ${hotTopics.length} 条热点`)
  hotTopics.forEach((t, i) => console.log(`     ${i + 1}. ${t}`))
  console.log('')

  console.log('📝 正在生成文案...')
  const sections = []

  for (let i = 0; i < hotTopics.length; i++) {
    const topic = hotTopics[i]
    console.log(`  📢 系统公告 [${i + 1}/${hotTopics.length}]：${topic}`)
    sections.push(generateSystemNotice(topic))
  }

  console.log('  ⭐ 评价卡片...')
  sections.push(generateReviewCopy())

  console.log('  📋 玩家日志...')
  sections.push(generatePlayerLogCopy())

  console.log('  📖 新手攻略...')
  sections.push(generateGuideCopy())

  const markdown = buildMarkdown(sections)

  console.log('')
  console.log('🔍 正在检测重复...')
  const history = getHistoryFiles()
  if (isDuplicate(markdown, history)) {
    console.log('  ⚠️ 检测到与历史文案重复，正在重新生成差异内容...')
    sections.splice(sections.length - 3, 3)
    sections.push(generateReviewCopy())
    sections.push(generatePlayerLogCopy())
    sections.push(generateGuideCopy())
    const newMarkdown = buildMarkdown(sections)
    if (isDuplicate(newMarkdown, history)) {
      console.log('  ⚠️ 仍然重复，已尽力避免。保存前添加时间戳后缀确保唯一性。')
    }
    const finalMarkdown = buildMarkdown(
      sections.map(s => s + `\n\n> ⏰ 生成时间：${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`)
    )
    await saveFile(finalMarkdown, true)
  } else {
    await saveFile(markdown, false)
  }
}

async function saveFile(content, isRetry) {
  const outputDir = getOutputDir()
  let fileName = `地球Online文案_${DATE_STR}.md`
  if (isRetry) {
    const ts = Date.now().toString(36)
    fileName = `地球Online文案_${DATE_STR}_${ts}.md`
  }
  const filePath = path.join(outputDir, fileName)

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`  ✅ 已保存：${filePath}`)
  console.log('')
  console.log('✨ 文案生成完成！')
  console.log(`📁 保存位置：${filePath}`)
  console.log(`📊 内容统计：${content.length} 字符`)
  console.log(`📂 历史总数：${getHistoryFiles().length} 条`)
}

main().catch(err => {
  console.error('❌ 生成失败：', err.message)
  process.exit(1)
})
