import { Routes, Route } from 'react-router-dom'
import ParticleBg from './components/ParticleBg'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import DailyFortune from './pages/DailyFortune'
import BaziChart from './pages/BaziChart'
import Horoscope from './pages/Horoscope'
import NameAnalysis from './pages/NameAnalysis'
import FortuneStick from './pages/FortuneStick'

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--color-ink)' }}>
      <ParticleBg />
      <NavBar />
      <main className="relative z-10 pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily-fortune" element={<DailyFortune />} />
          <Route path="/bazi" element={<BaziChart />} />
          <Route path="/horoscope" element={<Horoscope />} />
          <Route path="/name" element={<NameAnalysis />} />
          <Route path="/fortune-stick" element={<FortuneStick />} />
        </Routes>
      </main>
    </div>
  )
}
