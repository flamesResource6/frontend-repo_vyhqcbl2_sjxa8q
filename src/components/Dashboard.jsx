import { useEffect, useMemo, useState } from 'react'

export default function Dashboard() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [tab, setTab] = useState('leads')
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${baseUrl}/${tab}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData([]))
  }, [tab, baseUrl])

  const downloadCsv = async () => {
    const res = await fetch(`${baseUrl}/export/${tab}`)
    const text = await res.text()
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tab}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="py-16 bg-slate-950" id="dashboard">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Assistant Inbox</h2>
          <button onClick={downloadCsv} className="px-4 py-2 rounded bg-orange-500 text-white">Export CSV</button>
        </div>

        <div className="mt-6 flex gap-2">
          {['leads','chats','bookings','tickets','payments'].map(k => (
            <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 rounded border ${tab===k ? 'bg-white text-slate-900' : 'bg-slate-800 text-white border-white/10'}`}>
              {k}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-auto rounded border border-white/10">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="text-left p-2">Field</th>
                <th className="text-left p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr><td className="p-3" colSpan={2}>No records yet.</td></tr>
              )}
              {data.map((row, i) => (
                <tr key={i} className="odd:bg-slate-900/30">
                  <td className="align-top p-2 w-40">{row._id}</td>
                  <td className="p-2">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(row, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
