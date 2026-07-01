import React from 'react';

function ScoreBar({ score, max = 10 }) {
  const pct = (score / max) * 100;
  const color = pct >= 70 ? 'var(--invest)' : pct >= 40 ? 'var(--hold)' : 'var(--pass)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color, minWidth: '28px', fontFamily: 'var(--font-mono)' }}>
        {score}/{max}
      </span>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: `1px solid ${accent ? 'var(--accent-border)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '20px',
      marginBottom: '16px',
    }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, maxWidth: '60%', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function TagList({ items, color }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
      {(items || []).map((item, i) => (
        <span key={i} style={{
          padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
          background: `${color}15`, color, border: `1px solid ${color}30`
        }}>{item}</span>
      ))}
    </div>
  );
}

export default function ReportView({ report }) {
  if (!report) return null;

  const { verdict: v, business: b, financials: f, sentiment: s } = report;
  const verdictColor = v?.verdict === 'INVEST' ? 'var(--invest)' : v?.verdict === 'PASS' ? 'var(--pass)' : 'var(--hold)';
  const verdictClass = v?.verdict === 'INVEST' ? 'badge-invest' : v?.verdict === 'PASS' ? 'badge-pass' : 'badge-hold';

  return (
    <div className="fade-in">
      {/* Verdict Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${verdictColor}15, var(--bg-card))`,
        border: `1px solid ${verdictColor}40`,
        borderRadius: 'var(--radius)',
        padding: '28px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: '8px' }}>
          <span className={`badge ${verdictClass}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
            {v?.verdict === 'INVEST' ? '✅' : v?.verdict === 'PASS' ? '❌' : '⚠️'} {v?.verdict}
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: verdictColor }}>
          {report.company}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color: verdictColor }}>
              {v?.confidence}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', color: 'var(--text)' }}>
              {v?.time_horizon}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Horizon</div>
          </div>
          {b?.industry && <>
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{b.industry}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sector</div>
            </div>
          </>}
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
          {v?.thesis}
        </p>
      </div>

      {/* Score Breakdown */}
      {v?.score_breakdown && (
        <Section title="Score Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(v.score_breakdown).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </span>
                </div>
                <ScoreBar score={val} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Bull/Bear */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: 'var(--invest-dim)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius)', padding: '18px' }}>
          <h3 style={{ color: 'var(--invest)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            🐂 Bull Case
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{v?.bull_case}</p>
        </div>
        <div style={{ background: 'var(--pass-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', padding: '18px' }}>
          <h3 style={{ color: 'var(--pass)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            🐻 Bear Case
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{v?.bear_case}</p>
        </div>
      </div>

      {/* Business Analysis */}
      <Section title="Business Analysis">
        <InfoRow label="Overview" value={b?.company_overview} />
        <InfoRow label="Business Model" value={b?.business_model} />
        <InfoRow label="Competitive Moat" value={b?.competitive_moat} />
        <InfoRow label="Market Opportunity" value={b?.market_opportunity} />
        <InfoRow label="Management" value={b?.management_assessment} />
        {b?.key_risks?.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Key Risks</span>
            <TagList items={b.key_risks} color="var(--pass)" />
          </div>
        )}
      </Section>

      {/* Financials */}
      <Section title="Financial Health">
        <InfoRow label="Revenue Growth" value={f?.revenue_growth} />
        <InfoRow label="Profitability" value={f?.profitability} />
        <InfoRow label="Balance Sheet" value={f?.balance_sheet} />
        <InfoRow label="Valuation" value={f?.valuation_assessment} />
        <InfoRow label="Debt Level" value={f?.debt_level} />
        {f?.financial_score && (
          <div style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Financial Health Score</span>
            <ScoreBar score={f.financial_score} />
          </div>
        )}
      </Section>

      {/* Sentiment */}
      <Section title="Market Sentiment">
        <InfoRow label="Overall Sentiment" value={
          <span style={{ color: s?.market_sentiment === 'bullish' ? 'var(--invest)' : s?.market_sentiment === 'bearish' ? 'var(--pass)' : 'var(--hold)' }}>
            {s?.market_sentiment?.toUpperCase()}
          </span>
        } />
        <InfoRow label="Analyst Consensus" value={s?.analyst_consensus?.toUpperCase()} />
        {s?.recent_catalysts?.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Catalysts</span>
            <TagList items={s.recent_catalysts} color="var(--accent)" />
          </div>
        )}
        {s?.macro_tailwinds?.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tailwinds</span>
            <TagList items={s.macro_tailwinds} color="var(--invest)" />
          </div>
        )}
        {s?.macro_headwinds?.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Headwinds</span>
            <TagList items={s.macro_headwinds} color="var(--pass)" />
          </div>
        )}
      </Section>

      {/* Metrics to watch */}
      {v?.key_metrics_to_watch?.length > 0 && (
        <Section title="Key Metrics to Watch">
          <TagList items={v.key_metrics_to_watch} color="var(--accent)" />
        </Section>
      )}

      {/* Comps */}
      {v?.comparable_companies?.length > 0 && (
        <Section title="Comparable Companies">
          <TagList items={v.comparable_companies} color="var(--text-dim)" />
        </Section>
      )}

      <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: '11px' }}>
        {report.has_live_data ? '🌐 Enhanced with live web data' : '🧠 Based on LLM training knowledge'}
        {' · '}
        {new Date(report.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
