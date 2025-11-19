import { useEffect, useMemo, useRef, useState } from 'react'

const INQUIRY_OPTIONS = [
  { value: 'demo', label: 'Book a product demo' },
  { value: 'purchase', label: 'Pricing / purchase' },
  { value: 'support', label: 'Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'faq', label: 'General question' },
]

export default function ChatWidget() {
  const [open, setOpen] = useState(true)
  const [sessionId] = useState(() => Math.random().toString(36).slice(2))
  const [messages, setMessages] = useState([
    { sender: 'assistant', content: 'Hi! I\'m the AHC Front Desk Assistant. How can I help today?' }
  ])
  const [pending, setPending] = useState(false)
  const [lead, setLead] = useState({ name: '', email: '', company: '', inquiry_type: '', reason: '' })
  const [step, setStep] = useState('inquiry')
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendChatLog = async (sender, content, topic) => {
    try {
      await fetch(`${baseUrl}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, sender, content, topic })
      })
    } catch (e) {}
  }

  const saveLead = async (data) => {
    try {
      await fetch(`${baseUrl}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } catch (e) {}
  }

  const handleInquirySelect = (value) => {
    const label = INQUIRY_OPTIONS.find(o => o.value === value)?.label || 'your request'
    setLead(l => ({ ...l, inquiry_type: value }))
    setMessages(m => [...m, { sender: 'user', content: label }])
    sendChatLog('user', label, value)
    if (value === 'demo') {
      setMessages(m => [...m, { sender: 'assistant', content: 'Great! Let\'s get your details to book a demo. What\'s your name?' }])
      setStep('name')
    } else if (value === 'support') {
      setMessages(m => [...m, { sender: 'assistant', content: 'I can help route this to our team. What\'s your name?' }])
      setStep('name')
    } else {
      setMessages(m => [...m, { sender: 'assistant', content: 'Got it. What\'s your name?' }])
      setStep('name')
    }
  }

  const proceed = async () => {
    const val = input.trim()
    if (!val) return

    setMessages(m => [...m, { sender: 'user', content: val }])
    sendChatLog('user', val, step)

    if (step === 'name') {
      setLead(l => ({ ...l, name: val }))
      setMessages(m => [...m, { sender: 'assistant', content: 'Thanks! What\'s your email?' }])
      setStep('email')
    } else if (step === 'email') {
      setLead(l => ({ ...l, email: val }))
      setMessages(m => [...m, { sender: 'assistant', content: 'And your company?' }])
      setStep('company')
    } else if (step === 'company') {
      const updated = { ...lead, company: val }
      setLead(updated)
      setMessages(m => [...m, { sender: 'assistant', content: 'Briefly, what brings you here today?' }])
      setStep('reason')
    } else if (step === 'reason') {
      const updated = { ...lead, reason: val }
      setLead(updated)
      await saveLead({ ...updated, inquiry_type: updated.inquiry_type || 'other' })

      if ((updated.inquiry_type) === 'demo') {
        setMessages(m => [...m, { sender: 'assistant', content: 'Awesome. Pick a demo slot below.' }])
        setStep('booking')
      } else if (updated.inquiry_type === 'support') {
        setMessages(m => [...m, { sender: 'assistant', content: 'Thanks, I\'ll route this to support. A teammate will follow up shortly.' }])
        setStep('end')
      } else {
        setMessages(m => [...m, { sender: 'assistant', content: 'Thanks! We\'ll be in touch shortly. Anything else I can help with?' }])
        setStep('end')
      }
    }

    setInput('')
  }

  const bookSlot = async (iso) => {
    setPending(true)
    try {
      const res = await fetch(`${baseUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lead.name, email: lead.email, company: lead.company, slot_iso: iso, notes: lead.reason })
      })
      if (res.ok) {
        setMessages(m => [...m, { sender: 'assistant', content: 'You\'re all set! A confirmation email will be sent. Anything else I can help with?' }])
        setStep('end')
      } else {
        setMessages(m => [...m, { sender: 'assistant', content: 'Sorry, I couldn\'t schedule that. Please try another slot or I can connect you with a human.' }])
      }
    } finally {
      setPending(false)
    }
  }

  const slots = useMemo(() => {
    const now = new Date()
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0)
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(base.getTime() + i * 60 * 60 * 1000)
      return { iso: d.toISOString(), label: d.toLocaleString() }
    })
  }, [])

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 h-12 px-5 rounded-full bg-orange-500 text-white shadow-lg">
        Chat with us
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 max-h-[70vh] bg-white/90 backdrop-blur rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <div>
          <p className="font-semibold">AHC Front Desk Assistant</p>
          <p className="text-xs text-gray-300">Friendly help. Instant answers.</p>
        </div>
        <button onClick={() => setOpen(false)} className="text-sm text-gray-300 hover:text-white">×</button>
      </div>

      <div ref={listRef} className="flex-1 p-3 space-y-2 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.sender === 'assistant' ? 'bg-gray-100 text-gray-800' : 'bg-orange-500 text-white ml-auto'}`}>
            {m.content}
          </div>
        ))}

        {step === 'inquiry' && (
          <div className="grid grid-cols-1 gap-2">
            {INQUIRY_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => handleInquirySelect(opt.value)} className="text-left px-3 py-2 rounded bg-gray-900 text-white hover:bg-gray-800">
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step === 'booking' && (
          <div className="space-y-2">
            {slots.map(s => (
              <button disabled={pending} key={s.iso} onClick={() => bookSlot(s.iso)} className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50 disabled:opacity-50">
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {['name','email','company','reason'].includes(step) && (
        <div className="p-3 border-t bg-white">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && proceed()}
            placeholder="Type here..."
            className="w-full px-3 py-2 border rounded"
          />
          <button onClick={proceed} className="mt-2 w-full bg-orange-500 text-white py-2 rounded">Send</button>
        </div>
      )}

      {step === 'end' && (
        <div className="p-3 border-t bg-white text-xs text-gray-600">
          I can connect you with a teammate or help with payments and FAQs. Just ask!
        </div>
      )}
    </div>
  )
}
