import { useState } from 'react'
import { motion } from 'framer-motion'

const signs = [
  { name: '白羊座', emoji: '♈', range: '3.21-4.19' },
  { name: '金牛座', emoji: '♉', range: '4.20-5.20' },
  { name: '双子座', emoji: '♊', range: '5.21-6.21' },
  { name: '巨蟹座', emoji: '♋', range: '6.22-7.22' },
  { name: '狮子座', emoji: '♌', range: '7.23-8.22' },
  { name: '处女座', emoji: '♍', range: '8.23-9.22' },
  { name: '天秤座', emoji: '♎', range: '9.23-10.23' },
  { name: '天蝎座', emoji: '♏', range: '10.24-11.22' },
  { name: '射手座', emoji: '♐', range: '11.23-12.21' },
  { name: '摩羯座', emoji: '♑', range: '12.22-1.19' },
  { name: '水瓶座', emoji: '♒', range: '1.20-2.18' },
  { name: '双鱼座', emoji: '♓', range: '2.19-3.20' },
]

const tabs = ['今日', '本周', '本月']
const aspects = ['事业', '感情', '财运', '健康']

const horoscopeTexts = {
  '事业': [
    '今日适合推进搁置已久的项目，贵人来自意想不到的方向，保持敏锐的洞察力。',
    '本周工作节奏加快，但效率极高。你的创意会得到上司的赏识，大胆提出你的想法。',
    '这个月事业运势稳步上升，适合制定长远规划。跳槽或转行者需三思而后行。',
  ],
  '感情': [
    '单身者桃花运旺盛，可能在社交场合遇到心仪之人。有伴侣者感情升温，适合约会。',
    '本周感情生活丰富多彩，单身者有机会通过朋友介绍认识新对象，不妨主动一点。',
    '本月感情运势总体平稳，已婚者家庭和睦，未婚者需耐心等待良缘。',
  ],
  '财运': [
    '偏财运不错，可能有意外之财入账。但不宜大额投资，保守理财为上策。',
    '正财运稳定，工作收入有望提升。本周不适合参与高风险投资，守住钱包最重要。',
    '本月财运呈现先抑后扬趋势，月初宜收，月末可适当投资，注意分散风险。',
  ],
  '健康': [
    '身体状况良好，但需注意饮食规律。适合进行轻度运动，如散步、瑜伽。',
    '本周精力充沛，适合开始新的健身计划。注意用眼卫生，避免长时间盯屏幕。',
    '本月健康运势不错，但换季时节注意保暖防感冒。保持良好的作息习惯。',
  ],
}

export default function Horoscope() {
  const [signIdx, setSignIdx] = useState(0)
  const [tab, setTab] = useState(0)
  const sign = signs[signIdx]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider mb-8" style={{ color: 'var(--color-gold)' }}>
          星座运势
        </h1>

        {/* Sign selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {signs.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setSignIdx(i)}
              className="px-3 py-1.5 rounded-full text-xs transition-all duration-200 border"
              style={{
                background: i === signIdx ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.02)',
                borderColor: i === signIdx ? 'rgba(212,168,83,0.3)' : 'rgba(255,255,255,0.06)',
                color: i === signIdx ? 'var(--color-gold)' : '#888',
              }}
            >
              {s.emoji} {s.name}
            </button>
          ))}
        </div>

        {/* Selected sign info */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{sign.emoji}</div>
          <div className="font-serif text-xl font-bold" style={{ color: 'var(--color-gold)' }}>{sign.name}</div>
          <div className="text-xs" style={{ color: '#666' }}>{sign.range}</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className="flex-1 text-center py-2.5 text-sm font-medium transition-colors"
              style={{
                color: tab === i ? 'var(--color-gold)' : '#888',
                borderBottom: tab === i ? '2px solid var(--color-gold)' : '2px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aspects.map((a, i) => (
            <motion.div
              key={a}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-4 rounded-xl border"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-gold)' }}>
                {a === '事业' ? '💼' : a === '感情' ? '💕' : a === '财运' ? '💰' : '🏥'} {a}运
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#aaa' }}>
                {horoscopeTexts[a][tab]}
              </p>
              <div className="mt-3 text-lg" style={{ color: 'var(--color-gold)' }}>
                {'★★★★★'.slice(0, 3 + (Math.abs((signIdx + tab + i) * 7) % 3))}☆
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
