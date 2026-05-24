import { useState } from 'react'
import { motion } from 'framer-motion'

const todaySeed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate()
function seeded(offset) {
  let n = (todaySeed * 16807 + offset * 214013) % 2147483647
  return ((n % 20) + 80) // 80-99 range base
}

const categories = [
  { key: 'career', label: '💼 事业运', icon: '💼' },
  { key: 'love', label: '💕 感情运', icon: '💕' },
  { key: 'wealth', label: '💰 财运', icon: '💰' },
  { key: 'health', label: '🏥 健康运', icon: '🏥' },
]

const colors = ['#7c3aed', '#c41e3a', '#d4a853', '#60a5fa', '#4ade80', '#e85d3a', '#f0a060']
const colorNames = ['紫罗兰', '朱砂红', '琉璃金', '天青蓝', '翡翠绿', '暖阳橙', '蜜柑色']
const directions = ['东', '东南', '南', '西南', '西', '西北', '北', '东北']

const goodActs = ['出行', '嫁娶', '开市', '签约', '搬家', '会友', '入学', '求医', '上任', '祈福']
const badActs = ['动土', '争吵', '诉讼', '远行', '开仓', '纳畜', '穿井', '伐木']

function pick(arr, seed) { return arr[Math.abs(seed) % arr.length] }
function pickN(arr, n, seed) {
  const r = []
  let s = seed
  for (let i = 0; i < n; i++) { r.push(arr[Math.abs(s + i * 7) % arr.length]) }
  return r
}

export default function DailyFortune() {
  const seed = todaySeed
  const [scores] = useState(() => categories.map((_, i) => seeded(i)))
  const total = Math.round(scores.reduce((a, b) => a + b) / scores.length)

  const level = total >= 90 ? '大吉' : total >= 78 ? '中吉' : '中平'
  const levelColor = total >= 90 ? 'var(--color-jade-light)' : total >= 78 ? 'var(--color-gold)' : '#f0a060'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider" style={{ color: 'var(--color-gold)' }}>
              今日运势
            </h1>
            <p className="text-xs mt-1" style={{ color: '#666' }}>
              {todaySeed.toString().slice(0, 4)}年{todaySeed.toString().slice(4, 6)}月{todaySeed.toString().slice(6, 8)}日
            </p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2"
            style={{
              borderColor: levelColor,
              background: `radial-gradient(circle, ${levelColor}22, transparent 70%)`,
            }}
          >
            <span className="text-2xl font-bold" style={{ color: levelColor }}>{total}</span>
            <span className="text-xs font-semibold" style={{ color: levelColor }}>{level}</span>
          </motion.div>
        </div>

        {/* Score bars */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {categories.map((c, i) => {
            const s = scores[i]
            const barColor = s >= 85 ? 'var(--color-jade-light)' : s >= 75 ? 'var(--color-gold)' : '#f0a060'
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-4 rounded-lg border"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: '#888' }}>{c.label}</span>
                  <span className="text-sm font-bold" style={{ color: barColor }}>{s}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s}%` }}
                    transition={{ delay: 0.3 + 0.1 * i, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${barColor}, ${barColor}88)` }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Lucky info */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: '🎨 幸运色', value: `${pick(colors, seed * 3)}`, colorVal: pick(colors, seed * 3), colorName: colorNames[Math.abs(seed * 3) % colorNames.length] },
            { label: '🔢 幸运数', value: pickN([1, 2, 3, 4, 5, 6, 7, 8, 9], 3, seed).join(' · ') },
            { label: '🧭 贵人方位', value: pick(directions, seed * 5) },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center p-4 rounded-lg border"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="text-xs mb-1" style={{ color: '#888' }}>{item.label}</div>
              {item.colorVal ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full inline-block" style={{ background: item.colorVal }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-gold)' }}>{item.colorName}</span>
                </div>
              ) : (
                <div className="text-sm font-semibold" style={{ color: 'var(--color-gold)' }}>{item.value}</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Today's advice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-5 rounded-xl border"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-jade-light)' }}>✅ 宜</div>
              <div className="flex flex-wrap gap-2">
                {pickN(goodActs, 3, seed).map((a) => (
                  <span key={a} className="px-3 py-1 text-xs rounded-full border" style={{ color: 'var(--color-jade-light)', borderColor: 'rgba(74,222,128,0.2)' }}>{a}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-cinnabar-light)' }}>❌ 忌</div>
              <div className="flex flex-wrap gap-2">
                {pickN(badActs, 3, seed + 1).map((a) => (
                  <span key={a} className="px-3 py-1 text-xs rounded-full border" style={{ color: 'var(--color-cinnabar-light)', borderColor: 'rgba(232,93,58,0.2)' }}>{a}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
