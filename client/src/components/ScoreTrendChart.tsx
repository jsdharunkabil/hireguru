import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  scores: { createdAt: string; overallScore: number; jobTitle: string }[]
}

export default function ScoreTrendChart({ scores }: Props) {
  const data = [...scores].reverse().map((s, i) => ({
    name: `#${i + 1}`,
    score: s.overallScore,
    job: s.jobTitle || 'Untitled',
  }))

  if (data.length < 2) return null

  return (
    <div className="rounded-2xl border p-6 mb-6"
      style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}>
      <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        Score Trend
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-input)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text)' }}
            formatter={(val: number) => [`${val}/100`, 'Score']}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.job || label}
          />
          <Line type="monotone" dataKey="score" stroke="#6c63ff" strokeWidth={2}
            dot={{ fill: '#6c63ff', r: 4 }} activeDot={{ r: 6, fill: '#3ecfcf' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}