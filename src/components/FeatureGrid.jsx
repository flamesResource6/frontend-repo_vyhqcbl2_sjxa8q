import { MessageSquare, Calendar, FileText, Wallet, Database, Upload } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Smart Chat Receptionist',
    desc: 'Greets visitors, collects contact details, and classifies intent automatically.'
  },
  {
    icon: Calendar,
    title: 'Demo Booking',
    desc: 'Real-time slot selection with confirmations and reminders.'
  },
  {
    icon: FileText,
    title: 'FAQ & Knowledge Base',
    desc: 'Answers product and pricing questions instantly from your docs.'
  },
  {
    icon: Database,
    title: 'Lead & Ticket Routing',
    desc: 'Auto-tags and assigns inquiries to the right team in your CRM.'
  },
  {
    icon: Upload,
    title: 'CSV Export',
    desc: 'Download all leads, chats, and bookings for analytics.'
  },
  {
    icon: Wallet,
    title: 'Stripe Payments',
    desc: 'Upgrade plans and accept payments securely in chat.'
  },
]

export default function FeatureGrid() {
  return (
    <section className="py-16 bg-slate-900" id="features">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Everything your front desk needs</h2>
        <p className="text-slate-300 text-center mt-2">Automate bookings, support, and sales while staying friendly and helpful.</p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-white/10 hover:border-orange-400/40 transition group">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-300">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
