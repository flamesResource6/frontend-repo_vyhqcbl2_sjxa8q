import { useMemo, useState } from 'react'

export default function CommunicationsPanel() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [to, setTo] = useState('')
  const [body, setBody] = useState('Hello from AHC!')
  const [twimlUrl, setTwimlUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const sendSMS = async () => {
    setLoading(true)
    setStatus('')
    try {
      const res = await fetch(`${baseUrl}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, body })
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setStatus(`SMS queued (sid: ${json.sid})`)
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const placeCall = async () => {
    setLoading(true)
    setStatus('')
    try {
      const res = await fetch(`${baseUrl}/voice/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, twiml_url: twimlUrl || undefined })
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setStatus(`Call initiated (sid: ${json.sid})`)
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 bg-slate-950/80 border-t border-white/10" id="communications">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-white">Communications</h2>
        <p className="text-slate-400 mt-1">Send a test SMS or place a test call through Twilio.</p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300">To (E.164)</label>
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="+1XXXXXXXXXX" className="mt-1 w-full rounded bg-slate-900 border border-white/10 px-3 py-2 text-white placeholder-slate-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-300">TwiML URL (optional)</label>
            <input value={twimlUrl} onChange={e=>setTwimlUrl(e.target.value)} placeholder="https://your.twiml.url" className="mt-1 w-full rounded bg-slate-900 border border-white/10 px-3 py-2 text-white placeholder-slate-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-300">SMS Body</label>
            <textarea value={body} onChange={e=>setBody(e.target.value)} rows={3} className="mt-1 w-full rounded bg-slate-900 border border-white/10 px-3 py-2 text-white placeholder-slate-500" />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={sendSMS} disabled={loading} className="px-4 py-2 rounded bg-emerald-500 text-white disabled:opacity-60">Send SMS</button>
          <button onClick={placeCall} disabled={loading} className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-60">Place Call</button>
        </div>

        {status && (
          <div className="mt-4 text-sm text-slate-300">
            {status}
          </div>
        )}
      </div>
    </section>
  )
}
