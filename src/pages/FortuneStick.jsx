import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const qianwen = [
  { num: 1, title: '第一签', level: '上上', poem: ['天门一挂榜','预定夺魁人','驰骋千里马','四海扬名声'], jie: '此签大吉，凡事顺遂。求官得位，求财得利，婚姻可成，出行平安。' },
  { num: 2, title: '第二签', level: '上吉', poem: ['蛟龙得云雨','终非池中物','变化在须臾','风云合其时'], jie: '此签主贵人相助，事业将有大转机。耐心等待时机，必有出头之日。' },
  { num: 3, title: '第三签', level: '中平', poem: ['春蚕到死丝方尽','蜡炬成灰泪始干','守得云开见月明','一朝成名天下知'], jie: '此签主先难后易，需忍耐一时之困。坚守初心，终有拨云见日之时。' },
  { num: 4, title: '第四签', level: '上上', poem: ['日出扶桑一丈高','人间万事细如毛','野夫怒见不平处','磨损胸中万古刀'], jie: '此签主光明在前，事业蒸蒸日上。心怀正义则万事可成，不必忧虑。' },
  { num: 5, title: '第五签', level: '下下', poem: ['雁过也正伤心','却是旧时相识','满地黄花堆积','憔悴损如今'], jie: '此签主暂时不顺，需反思己过。调整心态，待时而动，不可强求。' },
  { num: 6, title: '第六签', level: '中吉', poem: ['一片冰心在玉壶','两行清泪落胸前','人生自是有情痴','此恨不关风与月'], jie: '此签主感情之事，宜耐心经营。情缘未到莫强求，缘分到时自然成。' },
  { num: 7, title: '第七签', level: '上吉', poem: ['九天阊阖开宫殿','万国衣冠拜冕旒','朝罢须裁五色诏','佩声归到凤池头'], jie: '此签主仕途顺利，事业有成。宜把握机会，大胆进取，名利双收之兆。' },
  { num: 8, title: '第八签', level: '中平', poem: ['海上生明月','天涯共此时','情人怨遥夜','竟夕起相思'], jie: '此签主思念之情，远行之人平安。求财需等待，不得急躁。' },
  { num: 9, title: '第九签', level: '上上', poem: ['凤凰台上凤凰游','凤去台空江自流','吴宫花草埋幽径','晋代衣冠成古丘'], jie: '此签主大吉大利，凡事亨通。事业兴旺，家宅平安，万事如意。' },
  { num: 10, title: '第十签', level: '下下', poem: ['昨夜西风凋碧树','独上高楼望尽天涯路','欲寄彩笺兼尺素','山长水阔知何处'], jie: '此签主前路迷茫，宜暂缓决策。不要急于求成，静待时机成熟。' },
]

const steps = ['默念祈愿', '摇动签筒', '掷筊验证', '观音解签']

export default function FortuneStick() {
  const [step, setStep] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [result, setResult] = useState(null)
  const [jiaoResult, setJiaoResult] = useState(null)
  const audioRef = useRef(null)

  const startShake = () => {
    setStep(1)
    setShaking(true)
    setTimeout(() => {
      setShaking(false)
      setStep(2)
    }, 2200)
  }

  const throwJiao = () => {
    const outcomes = [
      { text: '圣杯（一阴一阳）', desc: '神明应允，所求可成！', pass: true },
      { text: '笑杯（两面皆阳）', desc: '神明笑而不答，请重新掷筊', pass: false },
      { text: '阴杯（两面皆阴）', desc: '神明不允，宜改日再求', pass: null },
    ]
    const r = outcomes[Math.floor(Math.random() * 3)]
    setJiaoResult(r)
    if (r.pass === true) {
      setTimeout(() => {
        const qian = qianwen[Math.floor(Math.random() * qianwen.length)]
        setResult(qian)
        setStep(3)
      }, 1500)
    } else if (r.pass === false) {
      setTimeout(() => {
        setJiaoResult(null)
      }, 2000)
    }
  }

  const reset = () => {
    setStep(0)
    setShaking(false)
    setResult(null)
    setJiaoResult(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider mb-8 text-center" style={{ color: 'var(--color-gold)' }}>
          求签掷筊
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300"
                style={{
                  background: i <= step ? 'rgba(212,168,83,0.2)' : 'rgba(255,255,255,0.04)',
                  border: i <= step ? '2px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.1)',
                  color: i <= step ? 'var(--color-gold)' : '#666',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs hidden sm:inline" style={{ color: i <= step ? '#aaa' : '#555' }}>{s}</span>
              {i < 3 && <span className="text-xs" style={{ color: '#444' }}>→</span>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Intro */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="text-7xl mb-6">🏮</div>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: '#888' }}>
                心中默念所求之事<br />心诚则灵 · 莫戏莫疑
              </p>
              <button
                onClick={startShake}
                className="px-10 py-3 rounded-full font-serif text-lg tracking-widest transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, var(--color-gold), #b8912e)', color: '#0a0a0a' }}
              >
                开始摇签
              </button>
            </motion.div>
          )}

          {/* Step 1: Shaking */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div
                className="text-7xl mb-6 inline-block"
                animate={shaking ? { rotate: [-8, 8, -6, 6, -4, 4, -2, 2, 0], x: [-3, 3, -2, 2, -1, 1, 0, 0, 0] } : {}}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                🎋
              </motion.div>
              <p className="text-sm" style={{ color: 'var(--color-gold)' }}>
                {shaking ? '咔嗒...咔嗒...咔嗒...' : '请摇动签筒'}
              </p>
            </motion.div>
          )}

          {/* Step 2: Throw jiao */}
          {step === 2 && !result && (
            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="text-6xl mb-6">🥢</div>
              <p className="text-sm mb-6" style={{ color: '#888' }}>
                签已抽出，请掷筊请示神明是否应允
              </p>
              <button
                onClick={throwJiao}
                disabled={!!jiaoResult}
                className="px-8 py-3 rounded-full font-serif text-lg tracking-widest transition-all duration-300"
                style={{
                  background: jiaoResult ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, var(--color-gold), #b8912e)',
                  color: jiaoResult ? '#666' : '#0a0a0a',
                }}
              >
                掷 筊
              </button>

              {jiaoResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl border"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="text-lg font-bold mb-1" style={{ color: jiaoResult.pass === true ? 'var(--color-jade-light)' : jiaoResult.pass === false ? '#f0a060' : 'var(--color-cinnabar-light)' }}>
                    {jiaoResult.text}
                  </div>
                  <div className="text-sm" style={{ color: '#888' }}>{jiaoResult.desc}</div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3: Result */}
          {step === 3 && result && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-2xl border"
              style={{
                background: 'linear-gradient(135deg, rgba(212,168,83,0.08), rgba(124,58,237,0.04))',
                borderColor: 'rgba(212,168,83,0.25)',
              }}
            >
              <div className="text-center mb-6">
                <div className="font-serif text-xl mb-1" style={{ color: 'var(--color-gold)' }}>
                  第 {result.title}
                </div>
                <div
                  className="inline-block px-4 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: result.level === '上上' || result.level === '上吉' ? 'rgba(74,222,128,0.15)' : result.level === '下下' ? 'rgba(232,93,58,0.15)' : 'rgba(212,168,83,0.15)',
                    color: result.level === '上上' || result.level === '上吉' ? 'var(--color-jade-light)' : result.level === '下下' ? 'var(--color-cinnabar-light)' : 'var(--color-gold)',
                  }}
                >
                  {result.level}
                </div>
              </div>

              <div className="text-center mb-6 font-serif text-lg leading-loose tracking-wider" style={{ color: '#ccc' }}>
                {result.poem.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>

              <div className="p-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: 'var(--color-gold)' }}>解曰</div>
                <div className="text-sm leading-relaxed" style={{ color: '#888' }}>{result.jie}</div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={reset}
                  className="px-6 py-2 rounded-full text-sm transition-all border"
                  style={{ color: '#888', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  再求一签
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
