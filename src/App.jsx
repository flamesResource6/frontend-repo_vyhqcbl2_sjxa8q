import Hero from './components/Hero'
import FeatureGrid from './components/FeatureGrid'
import Dashboard from './components/Dashboard'
import ChatWidget from './components/ChatWidget'
import CommunicationsPanel from './components/CommunicationsPanel'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Hero />
      <FeatureGrid />
      <CommunicationsPanel />
      <Dashboard />
      <ChatWidget />

      <footer className="py-10 text-center text-slate-400">
        Built with a friendly touch. If you need anything, just ask the assistant or we'll loop in a human.
      </footer>
    </div>
  )
}

export default App
