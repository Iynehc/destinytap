import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const nayin = [
  ['海中金','炉中火','大林木','路旁土','剑锋金','山头火'],
  ['涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土'],
  ['霹雳火','松柏木','流年水','砂石金','山下火','平地木'],
  ['壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金'],
  ['桑柘木','大溪水','砂中土','天上火','石榴木','大海水'],
]
const pillars = ['年柱', '月柱', '日柱', '时柱']
const genders = ['男', '女']
const hours = ['子时 (23-1)', '丑时 (1-3)', '寅时 (3-5)', '卯时 (5-7)', '辰时 (7-9)', '巳时 (9-11)', '午时 (11-13)', '未时 (13-15)', '申时 (15-17)', '酉时 (17-19)', '戌时 (19-21)', '亥时 (21-23)']
const zodiac = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
const wuxingMap = {
  '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水',
  '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水',
}
const elementColors = { '金': '#f0d080', '木': '#4ade80', '水': '#60a5fa', '火': '#e85d3a', '土': '#d4a853' }

function computeBazi(year, month, day, hourIdx) {
  const yIdx = (year - 4) % 60
  const yStem = heavenlyStems[yIdx % 10]
  const yBranch = earthlyBranches[yIdx % 12]

  const mStemIdx = (yIdx % 10) * 2 + month
  const mStem = heavenlyStems[mStemIdx % 10]
  const mBranch = earthlyBranches[(month + 2) % 12]

  const dBase = new Date(year, month - 1, day).getTime()
  const dStart = new Date(1900, 0, 1).getTime()
  const dDiff = Math.floor((dBase - dStart) / 86400000)
  const dStem = heavenlyStems[(dDiff + 9) % 10]
  const dBranch = earthlyBranches[(dDiff + 3) % 12]

  const hStemIdx = ((dDiff + 9) % 10) * 2 + hourIdx
  const hStem = heavenlyStems[hStemIdx % 10]
  const hBranch = earthlyBranches[hourIdx % 12]

  const pillarsData = [
    { stem: yStem, branch: yBranch, nayin: nayin[(yIdx % 10) % 5][Math.floor((yIdx % 10) / 2)] },
    { stem: mStem, branch: mBranch, nayin: nayin[(mStemIdx % 10) % 5][Math.floor((mStemIdx % 10) / 2)] },
    { stem: dStem, branch: dBranch, nayin: nayin[((dDiff + 9) % 10) % 5][Math.floor(((dDiff + 9) % 10) / 2)] },
    { stem: hStem, branch: hBranch, nayin: nayin[(hStemIdx % 10) % 5][Math.floor((hStemIdx % 10) / 2)] },
  ]

  const zodiacIdx = earthlyBranches.indexOf(yBranch)
  const z = zodiac[zodiacIdx]

  const elements = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  pillarsData.forEach(p => {
    elements[wuxingMap[p.stem]]++
    elements[wuxingMap[p.branch]]++
  })

  const dayMaster = dStem
  const dmElement = wuxingMap[dayMaster]
  const dmCount = elements[dmElement]
  const strength = dmCount >= 4 ? '身旺' : dmCount <= 2 ? '身弱' : '中和'
  const likes = { '金':'喜火木','木':'喜火土','水':'喜木火','火':'喜土金','土':'喜金水' }
  const dmName = { '甲':'甲木','乙':'乙木','丙':'丙火','丁':'丁火','戊':'戊土','己':'己土','庚':'庚金','辛':'辛金','壬':'壬水','癸':'癸水' }

  return {
    year, month, day, hourIdx,
    yIdx, yStem, yBranch, zodiac: z,
    pillars: pillarsData, elements, dayMaster, strength,
    dmElement, dmName: dmName[dayMaster], likes: likes[dmElement],
  }
}

function computeCompatibility(a, b) {
  let score = 60

  const reasons = []
  const detailItems = []

  // 1. 年柱纳音相生 (0-10)
  const aNayin = a.pillars[0].nayin
  const bNayin = b.pillars[0].nayin
  const nayinScore = aNayin === bNayin ? 10 : 6
  score += nayinScore - 6
  detailItems.push({ label: '年柱纳音', a: aNayin, b: bNayin, score: nayinScore, comment: aNayin === bNayin ? '相同，根基相合' : '不同，可互补' })

  // 2. 日主五行相生相克 (0-20)
  const wuxingCycle = ['木','火','土','金','水']
  const aIdx = wuxingCycle.indexOf(a.dmElement)
  const bIdx = wuxingCycle.indexOf(b.dmElement)
  const diff = (aIdx - bIdx + 5) % 5
  let rizhuScore = 10
  let rizhuComment = ''
  if (diff === 0) { rizhuScore = 20; rizhuComment = '日主相同，心有灵犀' }
  else if (diff === 2) { rizhuScore = 18; rizhuComment = `${a.dmElement}生${b.dmElement}，阴阳调和` }
  else if (diff === 3) { rizhuScore = 16; rizhuComment = `${b.dmElement}生${a.dmElement}，互补有情` }
  else if (diff === 1) { rizhuScore = 8; rizhuComment = `${a.dmElement}克${b.dmElement}，需互相体谅` }
  else { rizhuScore = 6; rizhuComment = `${b.dmElement}克${a.dmElement}，多有分歧` }
  score += rizhuScore - 10
  detailItems.push({ label: '日主关系', a: a.dmName, b: b.dmName, score: rizhuScore, comment: rizhuComment })

  // 3. 五行互补 (0-15)
  let complementScore = 0
  const allElements = ['金','木','水','火','土']
  const weakA = allElements.filter(e => a.elements[e] <= 1)
  const strongB = allElements.filter(e => b.elements[e] >= 2)
  const weakB = allElements.filter(e => b.elements[e] <= 1)
  const strongA = allElements.filter(e => a.elements[e] >= 2)
  const compCount = weakA.filter(e => strongB.includes(wuxingCycle[(wuxingCycle.indexOf(e) + 2) % 5])).length +
    weakB.filter(e => strongA.includes(wuxingCycle[(wuxingCycle.indexOf(e) + 2) % 5])).length
  complementScore = Math.min(15, compCount * 5)
  score += complementScore
  detailItems.push({ label: '五行互补', a: `缺${weakA.join('')||'无'}`, b: `缺${weakB.join('')||'无'}`, score: complementScore, comment: compCount >= 2 ? '五行互补性强' : compCount >= 1 ? '有一定互补' : '互补性一般' })

  // 4. 生肖配对 (0-15)
  const zodiacA = earthlyBranches.indexOf(a.pillars[0].branch)
  const zodiacB = earthlyBranches.indexOf(b.pillars[0].branch)
  const zDiff = Math.abs(zodiacA - zodiacB)
  // 六合: 差6 (子丑, 寅亥, 卯戌, 辰酉, 巳申, 午未)
  // 三合: 差4 (申子辰, 巳酉丑, 寅午戌, 亥卯未)
  // 六冲: 差6-opposite
  let zodiacScore = 8
  let zodiacComment = ''
  const triad = (a, b) => {
    const sets = [[0,4,8],[1,5,9],[2,6,10],[3,7,11]]
    return sets.some(s => s.includes(a) && s.includes(b))
  }
  if (zDiff === 6) { zodiacScore = 15; zodiacComment = '六合之配，天作之合' }
  else if (triad(zodiacA, zodiacB)) { zodiacScore = 13; zodiacComment = '三合之配，互相扶持' }
  else if (zDiff === 0) { zodiacScore = 7; zodiacComment = '同生肖，性格相似' }
  else if (zDiff === 3 || zDiff === 9) { zodiacScore = 10; zodiacComment = '一般相配' }
  else { zodiacScore = 5; zodiacComment = '生肖一般，需多磨合' }
  score += zodiacScore - 8
  detailItems.push({ label: '生肖配对', a: a.zodiac, b: b.zodiac, score: zodiacScore, comment: zodiacComment })

  const totalScore = Math.min(99, Math.max(40, Math.round(score)))
  const level = totalScore >= 85 ? '天作之合' : totalScore >= 70 ? '上等婚配' : totalScore >= 55 ? '中等婚配' : '需多磨合'
  const levelColor = totalScore >= 85 ? '#4ade80' : totalScore >= 70 ? '#d4a853' : totalScore >= 55 ? '#f0a060' : '#e85d3a'

  return { score: totalScore, level, levelColor, details: detailItems }
}

// ─── Input row component ───
function PersonInputs({ person, year, setYear, month, setMonth, day, setDay, hour, setHour, gender, setGender }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-3" style={{ color: person === 'A' ? 'var(--color-gold)' : 'var(--color-purple-light)' }}>
        {person === 'A' ? '🔶 甲方' : '🔷 乙方'}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs mb-1" style={{ color: '#888' }}>出生年</label>
          <input value={year} onChange={e => setYear(e.target.value)} placeholder="2009"
            className="w-full px-3 py-2 rounded-lg border text-sm text-white"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: '#888' }}>月</label>
          <input value={month} onChange={e => setMonth(e.target.value)} placeholder="5"
            className="w-full px-3 py-2 rounded-lg border text-sm text-white"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: '#888' }}>日</label>
          <input value={day} onChange={e => setDay(e.target.value)} placeholder="22"
            className="w-full px-3 py-2 rounded-lg border text-sm text-white"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: '#888' }}>时辰</label>
          <select value={hour} onChange={e => setHour(e.target.value)}
            className="w-full px-2 py-2 rounded-lg border text-sm text-white appearance-none"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
            {hours.map((h, i) => <option key={i} value={i} style={{color:'#000'}}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: '#888' }}>性别</label>
          <select value={gender} onChange={e => setGender(e.target.value)}
            className="w-full px-2 py-2 rounded-lg border text-sm text-white appearance-none"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
            {genders.map(g => <option key={g} value={g} style={{color:'#000'}}>{g}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

// ─── Four pillars display ───
function PillarDisplay({ result }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
        {result.pillars.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="text-center p-3 sm:p-4 rounded-xl border"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: i === 2 ? 'rgba(212,168,83,0.4)' : 'rgba(255,255,255,0.08)',
            }}
          >
            <div className="text-xs mb-2" style={{ color: '#666' }}>{pillars[i]}</div>
            <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: i === 2 ? 'var(--color-gold)' : '#ddd' }}>
              {p.stem}{p.branch}
            </div>
            <div className="text-xs" style={{ color: '#555' }}>{p.nayin}</div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mb-6">
        {Object.entries(result.elements).map(([el, count]) => (
          <div key={el} className="text-center">
            <div className="text-xs mb-1" style={{ color: '#888' }}>{el}</div>
            <div className="w-8 h-1.5 rounded-full mx-auto" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(count * 16, 100)}%` }}
                className="h-full rounded-full"
                style={{ background: elementColors[el] }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 rounded-xl border text-center" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,168,83,0.2)' }}>
        <div className="text-sm mb-1" style={{ color: '#888' }}>
          日主 <span className="font-bold text-lg" style={{ color: 'var(--color-gold)' }}>{result.dmName}</span>
          {' · '}{result.strength}{' · '}{result.likes}
        </div>
        <div className="text-xs mt-1" style={{ color: '#555' }}>
          生肖：{result.zodiac}
        </div>
      </div>
    </motion.div>
  )
}

export default function BaziChart() {
  const [tab, setTab] = useState('single') // 'single' | 'compat'

  // Single person state
  const [year, setYear] = useState('2009')
  const [month, setMonth] = useState('5')
  const [day, setDay] = useState('22')
  const [hour, setHour] = useState('4')
  const [gender, setGender] = useState('男')
  const [result, setResult] = useState(null)

  // Compatibility: person A
  const [yearA, setYearA] = useState('2009')
  const [monthA, setMonthA] = useState('5')
  const [dayA, setDayA] = useState('22')
  const [hourA, setHourA] = useState('4')
  const [genderA, setGenderA] = useState('男')
  // Person B
  const [yearB, setYearB] = useState('2009')
  const [monthB, setMonthB] = useState('8')
  const [dayB, setDayB] = useState('15')
  const [hourB, setHourB] = useState('4')
  const [genderB, setGenderB] = useState('女')
  // Results
  const [compResult, setCompResult] = useState(null)

  const doSingle = () => {
    const y = parseInt(year), m = parseInt(month), d = parseInt(day), h = parseInt(hour)
    if (!y || !m || !d) return
    setResult(computeBazi(y, m, d, h))
  }

  const doCompat = () => {
    const ya = parseInt(yearA), ma = parseInt(monthA), da = parseInt(dayA), ha = parseInt(hourA)
    const yb = parseInt(yearB), mb = parseInt(monthB), db = parseInt(dayB), hb = parseInt(hourB)
    if (!ya || !ma || !da || !yb || !mb || !db) return
    const a = computeBazi(ya, ma, da, ha)
    const b = computeBazi(yb, mb, db, hb)
    const compat = computeCompatibility(a, b)
    setCompResult({ a, b, compat })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider mb-8" style={{ color: 'var(--color-gold)' }}>
          八字排盘
        </h1>

        {/* Tab switcher */}
        <div className="flex border-b mb-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {[
            { key: 'single', label: '单人排盘' },
            { key: 'compat', label: '八字合婚' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setResult(null); setCompResult(null) }}
              className="flex-1 text-center py-3 text-sm font-medium transition-colors"
              style={{
                color: tab === t.key ? 'var(--color-gold)' : '#888',
                borderBottom: tab === t.key ? '2px solid var(--color-gold)' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ──────────── SINGLE ──────────── */}
          {tab === 'single' && (
            <motion.div key="single" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#888' }}>出生年</label>
                  <input value={year} onChange={e => setYear(e.target.value)} placeholder="2009"
                    className="w-full px-3 py-2 rounded-lg border text-sm text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#888' }}>月</label>
                  <input value={month} onChange={e => setMonth(e.target.value)} placeholder="5"
                    className="w-full px-3 py-2 rounded-lg border text-sm text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#888' }}>日</label>
                  <input value={day} onChange={e => setDay(e.target.value)} placeholder="22"
                    className="w-full px-3 py-2 rounded-lg border text-sm text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#888' }}>时辰</label>
                  <select value={hour} onChange={e => setHour(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border text-sm text-white appearance-none"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    {hours.map((h, i) => <option key={i} value={i} style={{color:'#000'}}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#888' }}>性别</label>
                  <select value={gender} onChange={e => setGender(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border text-sm text-white appearance-none"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    {genders.map(g => <option key={g} value={g} style={{color:'#000'}}>{g}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={doSingle}
                className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider transition-all duration-300 mb-8"
                style={{ background: 'linear-gradient(135deg, var(--color-gold), #b8912e)', color: '#0a0a0a' }}>
                排 盘
              </button>

              {result && <PillarDisplay result={result} />}
            </motion.div>
          )}

          {/* ──────────── COMPATIBILITY ──────────── */}
          {tab === 'compat' && (
            <motion.div key="compat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="space-y-6 mb-6">
                <PersonInputs person="A" year={yearA} setYear={setYearA} month={monthA} setMonth={setMonthA} day={dayA} setDay={setDayA} hour={hourA} setHour={setHourA} gender={genderA} setGender={setGenderA} />
                <div className="text-center text-lg" style={{ color: '#d4a853' }}>💞</div>
                <PersonInputs person="B" year={yearB} setYear={setYearB} month={monthB} setMonth={setMonthB} day={dayB} setDay={setDayB} hour={hourB} setHour={setHourB} gender={genderB} setGender={setGenderB} />
              </div>

              <button onClick={doCompat}
                className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider transition-all duration-300 mb-8"
                style={{ background: 'linear-gradient(135deg, var(--color-cinnabar-light), var(--color-gold))', color: '#0a0a0a' }}>
                合 婚
              </button>

              {compResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Compatibility score */}
                  <div className="text-center p-6 rounded-xl border mb-6" style={{
                    background: 'linear-gradient(135deg, rgba(212,168,83,0.08), rgba(124,58,237,0.04))',
                    borderColor: 'rgba(212,168,83,0.25)',
                  }}>
                    <div className="text-sm mb-2" style={{ color: '#888' }}>八字合婚 · 缘分指数</div>
                    <div className="text-6xl font-bold mb-2" style={{ color: compResult.compat.levelColor }}>
                      {compResult.compat.score}
                    </div>
                    <div className="text-lg font-semibold" style={{ color: compResult.compat.levelColor }}>
                      {compResult.compat.level}
                    </div>
                  </div>

                  {/* Detail breakdown */}
                  <div className="space-y-3 mb-6">
                    {compResult.compat.details.map((d, i) => (
                      <motion.div
                        key={d.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                      >
                        <div className="text-center min-w-[50px]">
                          <div className="text-lg font-bold" style={{ color: d.score >= 12 ? '#4ade80' : d.score >= 8 ? '#d4a853' : '#e85d3a' }}>
                            {d.score}
                          </div>
                          <div className="text-xs" style={{ color: '#555' }}>分</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold mb-1" style={{ color: '#ccc' }}>{d.label}</div>
                          <div className="text-xs" style={{ color: '#888' }}>{d.comment}</div>
                        </div>
                        <div className="text-right text-xs" style={{ color: '#555' }}>
                          <div>{d.a}</div>
                          <div style={{ color: '#666' }}>vs</div>
                          <div>{d.b}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Both pillars side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-semibold mb-3 text-center" style={{ color: 'var(--color-gold)' }}>🔶 甲方八字</div>
                      <PillarDisplay result={compResult.a} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-3 text-center" style={{ color: 'var(--color-purple-light)' }}>🔷 乙方八字</div>
                      <PillarDisplay result={compResult.b} />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
