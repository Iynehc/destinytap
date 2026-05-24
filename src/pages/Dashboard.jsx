import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const cards = [
  { to: '/daily-fortune', icon: '🌟', title: '今日运势', desc: '每日运气指数 · 幸运色 · 幸运数', color: '#d4a853' },
  { to: '/bazi', icon: '📐', title: '八字排盘', desc: '四柱八字 · 十神 · 五行旺衰', color: '#7c3aed' },
  { to: '/horoscope', icon: '♈', title: '星座运势', desc: '十二星座 · 每日/每周运势', color: '#60a5fa' },
  { to: '/name', icon: '✍', title: '姓名分析', desc: '三才五格 · 笔画数理吉凶', color: '#4ade80' },
  { to: '/fortune-stick', icon: '🏮', title: '求签掷筊', desc: '摇签筒 · 掷圣杯 · 观音灵签', color: '#e85d3a' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const score = 85 + Math.floor(Math.random() * 12)
  const level = score >= 90 ? '大吉' : score >= 75 ? '中吉' : '中平'
  const levelColor = score >= 90 ? 'var(--color-jade-light)' : score >= 75 ? 'var(--color-gold)' : '#f0a060'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 pt-4"
      >
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-[0.3em] mb-3" style={{ color: 'var(--color-gold)' }}>
          命 理 探 玄
        </h1>
        <p className="text-sm tracking-[0.2em]" style={{ color: '#666' }}>
          窥天命 · 知人事 · 断吉凶
        </p>
      </motion.div>

      {/* Quick fortune bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between px-5 py-4 rounded-xl mb-10 border"
        style={{
          background: 'linear-gradient(135deg, rgba(212,168,83,0.08), rgba(124,58,237,0.06))',
          borderColor: 'rgba(212,168,83,0.2)',
        }}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">☀️</span>
          <div>
            <div className="font-semibold text-base" style={{ color: 'var(--color-gold)' }}>今日运势概览</div>
            <div className="text-xs mt-0.5" style={{ color: '#666' }}>宜：出行 · 会友 · 开市 　 忌：动土 · 争吵</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color: levelColor }}>{score}</div>
          <div className="text-xs font-semibold mt-0.5" style={{ color: levelColor }}>{level}</div>
        </div>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
      >
        {cards.map((c) => (
          <motion.div key={c.to} variants={item}>
            <Link
              to={c.to}
              className="block text-center p-4 sm:p-5 rounded-xl border transition-all duration-300 no-underline group"
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${c.color}44`
                e.currentTarget.style.boxShadow = `0 0 30px ${c.color}11`
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {c.icon}
              </div>
              <div className="font-semibold text-sm sm:text-base mb-1" style={{ color: c.color }}>
                {c.title}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: '#555' }}>
                {c.desc}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-12 text-xs tracking-widest"
        style={{ color: '#444' }}
      >
        天行健，君子以自强不息 · 地势坤，君子以厚德载物
      </motion.p>
    </div>
  )
}
