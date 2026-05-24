import { useState } from 'react'
import { motion } from 'framer-motion'

const strokeCounts = {
  '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,
  '王':4,'李':7,'张':7,'刘':6,'陈':8,'杨':7,'黄':11,'赵':9,'周':8,'吴':7,
  '徐':10,'孙':6,'马':10,'朱':6,'胡':11,'郭':11,'何':7,'高':10,'林':8,'罗':8,
  '郑':9,'梁':11,'谢':12,'宋':7,'唐':10,'韩':12,'曹':11,'许':6,'邓':5,'冯':5,
  '彭':12,'曾':12,'萧':12,'田':5,'董':12,'潘':16,'袁':10,'蔡':15,'蒋':15,'余':7,
  '于':3,'杜':7,'叶':5,'程':12,'苏':8,'魏':18,'吕':7,'丁':2,'任':6,'沈':8,
  '姚':9,'卢':16,'姜':9,'崔':11,'钟':9,'谭':15,'陆':11,'汪':8,'范':10,'金':8,
  '石':5,'廖':14,'贾':10,'夏':10,'韦':9,'付':5,'方':4,'白':5,'邹':8,'孟':8,
  '伟':11,'芳':10,'娜':10,'敏':11,'静':16,'丽':19,'强':12,'磊':15,'洋':10,'勇':9,
  '艳':24,'杰':8,'军':9,'秀':7,'刚':10,'明':8,'平':5,'华':6,'文':4,'娟':10,
  '花':10,'兰':5,'国':11,'志':7,'建':9,'宇':6,'鑫':24,'斌':12,'博':12,
  '辉':12,'峰':10,'鹏':13,'浩':11,'然':12,'琪':13,'琳':13,'婷':12,
  '晨':11,'曦':20,'月':4,'星':9,'辰':7,'龙':16,'凤':14,'嘉':14,'瑞':14,'安':6,
}

function getStrokes(char) {
  return strokeCounts[char] || Math.floor(Math.random() * 15) + 3
}

function wugeAnalyze(surname, givenName) {
  const sStr = getStrokes(surname)
  const g1Str = getStrokes(givenName[0] || '')
  const g2Str = getStrokes(givenName[1] || '')

  const tian = givenName.length >= 2 ? sStr + 1 : sStr + 1
  const ren = sStr + g1Str
  const di = g1Str + g2Str
  const wai = givenName.length >= 2 ? g2Str + 1 : g1Str + 1
  const zong = sStr + g1Str + g2Str

  function judge(n) {
    const good = [1,3,5,6,7,8,11,13,15,16,17,18,21,23,24,25,29,31,32,33,35,37,39,41,45,47,48,52,55,57,61,63,65,67,68,81]
    const bad = [2,4,9,10,12,14,19,20,22,26,27,28,30,34,36,38,40,42,43,44,46,49,50,51,53,54,56,58,59,60,62,64,66,69,70,71,72,73,74,75,76,77,78,79,80]
    if (good.includes(n)) return { level: '吉', color: '#4ade80' }
    if (bad.includes(n)) return { level: '凶', color: '#e85d3a' }
    return { level: '半吉', color: '#d4a853' }
  }

  return {
    tian: { val: tian, ...judge(tian) },
    ren: { val: ren, ...judge(ren) },
    di: { val: di, ...judge(di) },
    wai: { val: wai, ...judge(wai) },
    zong: { val: zong, ...judge(zong) },
  }
}

export default function NameAnalysis() {
  const [surname, setSurname] = useState('')
  const [givenName, setGivenName] = useState('')
  const [result, setResult] = useState(null)

  const analyze = () => {
    if (!surname || !givenName) return
    setResult(wugeAnalyze(surname, givenName))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider mb-8" style={{ color: 'var(--color-gold)' }}>
          姓名分析
        </h1>

        <div className="flex gap-3 items-end mb-8">
          <div className="w-24">
            <label className="block text-xs mb-1" style={{ color: '#888' }}>姓氏</label>
            <input value={surname} onChange={e => setSurname(e.target.value)} placeholder="张"
              className="w-full px-3 py-2 rounded-lg border text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
          </div>
          <div className="flex-1">
            <label className="block text-xs mb-1" style={{ color: '#888' }}>名字</label>
            <input value={givenName} onChange={e => setGivenName(e.target.value)} placeholder="伟明"
              className="w-full px-3 py-2 rounded-lg border text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }} />
          </div>
          <button
            onClick={analyze}
            className="px-6 py-2 rounded-lg font-semibold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, var(--color-gold), #b8912e)', color: '#0a0a0a' }}
          >
            分析
          </button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Five grid */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
              {[
                { label: '天格', data: result.tian, desc: '祖运' },
                { label: '人格', data: result.ren, desc: '主运' },
                { label: '地格', data: result.di, desc: '前运' },
                { label: '外格', data: result.wai, desc: '副运' },
                { label: '总格', data: result.zong, desc: '后运' },
              ].map((g, i) => (
                <motion.div
                  key={g.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-center p-3 rounded-xl border"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderColor: i === 1 ? 'rgba(212,168,83,0.4)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="text-xs mb-1" style={{ color: '#666' }}>{g.label}</div>
                  <div className="text-xl font-bold mb-0.5" style={{ color: g.data.color }}>{g.data.val}</div>
                  <div className="text-xs" style={{ color: g.data.color }}>{g.data.level}</div>
                  <div className="text-xs mt-1" style={{ color: '#555' }}>{g.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Summary score */}
            <div className="p-5 rounded-xl border text-center" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,168,83,0.2)' }}>
              <div className="text-sm mb-2" style={{ color: '#888' }}>综合评分</div>
              <div className="text-4xl font-bold" style={{ color: 'var(--color-jade-light)' }}>
                {Math.min(95, Math.max(55, result.zong.val * 2 + 10))}
              </div>
              <div className="text-xs mt-2" style={{ color: '#666' }}>
                三才五格剖象法 · 仅供参考
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
