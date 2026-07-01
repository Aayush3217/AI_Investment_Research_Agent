import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { streamResearch, researchAPI } from '../utils/api';
import ReportView from '../components/ReportView';

const STEPS_META = {
  init: { icon: '🔍', label: 'Initializing agent' },
  search: { icon: '🌐', label: 'Searching the web' },
  analyze_business: { icon: '🏢', label: 'Analyzing business model' },
  analyze_financials: { icon: '📈', label: 'Evaluating financials' },
  analyze_sentiment: { icon: '📡', label: 'Reading market sentiment' },
  verdict: { icon: '⚖️', label: 'Deliberating verdict' },
  complete: { icon: '✅', label: 'Research complete' },
};

function ProgressStep({ step, detail, active }) {
  const meta = STEPS_META[step] || { icon: '•', label: step };
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0',
      opacity: active ? 1 : 0.5, transition: 'opacity 0.3s',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: active ? 'var(--accent-dim)' : 'var(--bg-elevated)',
        border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', flexShrink: 0,
        animation: active ? 'pulse 1.5s ease infinite' : 'none',
      }}>
        {meta.icon}
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: active ? 'var(--text)' : 'var(--text-muted)' }}>
          {meta.label}
        </div>
        {active && detail && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{detail}</div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    researchAPI.history().then((d) => setHistory(d.reports)).catch(() => {});
  }, [report]);

  const runResearch = (e) => {
    e.preventDefault();
    if (!company.trim()) return;

    setLoading(true);
    setSteps([]);
    setReport(null);
    setError('');
    setCurrentStep(null);

    abortRef.current = streamResearch(
      company.trim(),
      (progress) => {
        setCurrentStep(progress.step);
        setSteps((prev) => [...prev, progress]);
      },
      ({ report: r }) => {
        setReport(r);
        setLoading(false);
        setCurrentStep(null);
      },
      (msg) => {
        setError(msg || 'Research failed. Check your API key.');
        setLoading(false);
        setCurrentStep(null);
      }
    );
  };

  const loadReport = async (id) => {
    try {
      const { report: r } = await researchAPI.getReport(id);
      setReport(r.full_report);
      setShowHistory(false);
      setSteps([]);
    } catch {}
  };

  const verdictColor = (v) => v === 'INVEST' ? 'var(--invest)' : v === 'PASS' ? 'var(--pass)' : 'var(--hold)';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '56px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>AlphaLens</span>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 600, border: '1px solid var(--accent-border)' }}>
            AI Agent
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => setShowHistory(!showHistory)} style={{ padding: '6px 14px', fontSize: '13px' }}>
            📋 History ({history.length})
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{user?.name}</span>
            <button className="btn btn-ghost" onClick={logout} style={{ padding: '4px 10px', fontSize: '12px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '24px', gap: '24px' }}>
        {/* Left sidebar */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          {/* Search Form */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Research a Company
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>
              Enter any public company. The agent will analyze it and give an invest/pass verdict.
            </p>
            <form onSubmit={runResearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="label">Company Name</label>
                <input
                  className="input-field"
                  placeholder="e.g. Apple, Zomato, Tesla"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading || !company.trim()} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? <><div className="spinner" /> Analyzing...</> : '🔍 Run Analysis'}
              </button>
            </form>

            {/* Example companies */}
            {!loading && !report && (
              <div style={{ marginTop: '16px' }}>
                <div className="label" style={{ marginBottom: '8px' }}>Try an example</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Apple', 'Zomato', 'OpenAI', 'NVIDIA', 'Reliance Industries'].map((c) => (
                    <button
                      key={c}
                      className="btn btn-ghost"
                      onClick={() => setCompany(c)}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          {(loading || steps.length > 0) && (
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Agent Progress
              </h3>
              {Object.keys(STEPS_META).map((key) => {
                const stepData = steps.find((s) => s.step === key);
                const isActive = currentStep === key;
                const isDone = steps.some((s) => s.step === key) && !isActive;
                return (
                  <ProgressStep
                    key={key}
                    step={key}
                    detail={stepData?.detail}
                    active={isActive || isDone}
                  />
                );
              })}
            </div>
          )}

          {/* History panel */}
          {showHistory && history.length > 0 && (
            <div className="card" style={{ marginTop: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Past Reports
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => loadReport(r.id)}
                    style={{
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                      cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{r.company_name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: verdictColor(r.verdict) }}>{r.verdict}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                      {r.confidence}% confidence · {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {error && <div className="error-msg" style={{ marginBottom: '20px' }}>⚠️ {error}</div>}

          {!report && !loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px', opacity: 0.6 }}>
              <div style={{ fontSize: '64px' }}>📊</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600 }}>Ready to research</div>
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '360px' }}>
                Enter a company name on the left. The AI agent will analyze business quality, financials, market sentiment, and give you an invest or pass verdict.
              </div>
            </div>
          )}

          {loading && !report && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div className="spinner spinner-light" style={{ width: 48, height: 48, borderWidth: 3 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {STEPS_META[currentStep]?.icon || '🔍'}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600 }}>
                {STEPS_META[currentStep]?.label || 'Analyzing...'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Running multi-step AI research on {company}
              </div>
            </div>
          )}

          {report && <ReportView report={report} />}
        </div>
      </div>
    </div>
  );
}
