import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: '首页', icon: '☰' },
  { to: '/daily-fortune', label: '运势', icon: '🌟' },
  { to: '/bazi', label: '八字', icon: '📐' },
  { to: '/horoscope', label: '星座', icon: '♈' },
  { to: '/name', label: '姓名', icon: '✍' },
  { to: '/fortune-stick', label: '求签', icon: '🏮' },
]

function getLunarDate() {
  const now = new Date()
  const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
  const m = lunarMonths[now.getMonth()]
  const d = now.getDate()
  const t = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const z = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const y = now.getFullYear()
  const tg = t[(y - 4) % 10]
  const dz = z[(y - 4) % 12]
  return `${tg}${dz}年 · ${m}月${d < 10 ? '初' + '十一二三四五六七八九'[d] : (d === 10 ? '初十' : d === 20 ? '二十' : `${'廿' + '一二三四五六七八九'[d - 20]}`)}`
}

export default function NavBar() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b"
      style={{
        background: 'rgba(8,8,15,0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <Link to="/" className="font-serif text-2xl font-bold tracking-widest no-underline" style={{ color: 'var(--color-gold)' }}>
        命
      </Link>

      <div className="hidden md:flex gap-1">
        {links.map((l) => {
          const active = pathname === l.to
          return (
            <Link
              key={l.to}
              to={l.to}
              className="relative px-3 py-1.5 text-sm rounded-lg transition-colors no-underline"
              style={{
                color: active ? 'var(--color-gold)' : '#888',
                background: active ? 'rgba(212,168,83,0.1)' : 'transparent',
              }}
            >
              <span className="mr-1">{l.icon}</span>
              {l.label}
              {active && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded"
                  style={{ background: 'var(--color-gold)' }}
                />
              )}
            </Link>
          )
        })}
      </div>

      <div className="text-xs" style={{ color: '#666' }}>
        {getLunarDate()}
      </div>
    </nav>
  )
}
