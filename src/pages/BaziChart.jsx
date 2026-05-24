import { useState } from 'react'
import { motion } from 'framer-motion'

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

function computeBazi(year, month, day, hourIdx, gender) {
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

  const elements = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  const wuxingMap = {
    '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水',
    '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水',
  }
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

  return { pillars: pillarsData, elements, dayMaster, strength, dmElement, dmName: dmName[dayMaster], likes: likes[dmElement] }
}

export default function BaziChart() {
  const [year, setYear] = useState('1995')
  const [month, setMonth] = useState('6')
  const [day, setDay] = useState('15')
  const [hour, setHour] = useState('4')
  const [gender, setGender] = useState('男')
  const [result, setResult] = useState(null)

  const doCompute = () => {
    const y = parseInt(year), m = parseInt(month), d = parseInt(day), h = parseInt(hour)
    if (!y || !m || !d) return
    setResult(computeBazi(y, m, d, h, gender))
  }

  const elementColors = { '金': '#f0d080', '木': '#4ade80', '水': '#60a5fa', '火': '#e85d3a', '土': '#d4a853' }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider mb-8" style={{ color: 'var(--color-gold)' }}>
          八字排盘
        </h1>

        {/* Input */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          <div>
            <label className="block text-xs mb-1" style={{ color: '#888' }}>出生年</label>
            <input value={year} onChange={e => setYear(e.target.value)} placeholder="1995"
              className="w-full px-3 py-2 rounded-lg border text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: '#888' }}>月</label>
            <input value={month} onChange={e => setMonth(e.target.value)} placeholder="6"
              className="w-full px-3 py-2 rounded-lg border text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: '#888' }}>日</label>
            <input value={day} onChange={e => setDay(e.target.value)} placeholder="15"
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

        <button
          onClick={doCompute}
          className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider transition-all duration-300 mb-8"
          style={{ background: 'linear-gradient(135deg, var(--color-gold), #b8912e)', color: '#0a0a0a' }}
        >
          排 盘
        </button>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Four pillars */}
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

            {/* Five elements */}
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

            {/* Summary */}
            <div className="p-5 rounded-xl border text-center" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,168,83,0.2)' }}>
              <div className="text-sm mb-1" style={{ color: '#888' }}>
                日主 <span className="font-bold text-lg" style={{ color: 'var(--color-gold)' }}>{result.dmName}</span>
                {' · '}{result.strength}{' · '}{result.likes}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
