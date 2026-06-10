'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import {
  Shield, AlertTriangle, Activity, Users, FileText, MapPin, Zap, Eye, Clock, ChevronRight,
  Target, BarChart2, Bell, CheckSquare, Square, Cpu, ShieldAlert
} from 'lucide-react';
import {
  SUMMARY_METRICS, MONTHLY_CRIME_TRENDS, CRIME_CATEGORIES,
  DISTRICT_RISK_SCORES, AI_ALERTS, FIR_RECORDS, CRIMINAL_PROFILES,
  COMMISSIONER_RECOMMENDATIONS
} from '@/lib/mockData';
import { usePresentation } from '@/components/PresentationContext';

// ── Custom Tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--cyber-surface)',
      border: '1px solid var(--cyber-border)',
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 13,
      color: 'var(--text-primary)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ color: 'var(--cyber-cyan)', fontWeight: 700, marginBottom: 6, fontSize: 11, letterSpacing: '0.08em' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
          <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Severity color helper ──────────────────────────────────────
function alertSeverityColor(severity: string) {
  if (severity === 'critical') return '#ef4444';
  if (severity === 'high') return '#f59e0b';
  if (severity === 'medium') return 'var(--cyber-cyan)';
  return 'var(--text-muted)';
}

function alertSeverityBadgeClass(severity: string) {
  if (severity === 'critical') return 'badge badge-red';
  if (severity === 'high') return 'badge badge-amber';
  if (severity === 'medium') return 'badge badge-cyan';
  return 'badge badge-gray';
}

function statusBadgeClass(status: string) {
  if (status === 'investigating') return 'badge badge-amber';
  if (status === 'arrested') return 'badge badge-green';
  if (status === 'resolved') return 'badge badge-cyan';
  if (status === 'monitoring') return 'badge badge-purple';
  return 'badge badge-gray';
}

const RESPONSE_TEAMS = [
  { name: 'Cyber Crime Cell Alpha', district: 'Bengaluru Urban', status: 'En Route', statusColor: '#f59e0b', members: 8 },
  { name: 'SIT Team Bravo', district: 'Ballari', status: 'On Scene', statusColor: '#10b981', members: 15 },
  { name: 'Narcotics Task Force', district: 'Belagavi', status: 'Standby', statusColor: '#64748b', members: 12 },
  { name: 'River Police Unit', district: 'Raichur', status: 'Deployed', statusColor: '#10b981', members: 6 },
];

// ── Main Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { isPresentationMode } = usePresentation();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [mounted, setMounted] = useState(false);
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
    function tick() {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleRecommendation = (id: number) => {
    setCompletedRecommendations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // District risk bar color
  function riskBarColor(score: number) {
    if (score > 80) return '#ef4444';
    if (score > 60) return '#f59e0b';
    return 'var(--cyber-cyan)';
  }

  return (
    <div style={{ padding: '28px', minHeight: '100vh', background: 'transparent' }}>

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: isPresentationMode ? 60 : 52, height: isPresentationMode ? 60 : 52, borderRadius: 12,
            background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(0,240,255,0.15)',
          }}>
            <Shield size={isPresentationMode ? 30 : 26} className="text-[var(--cyber-cyan)]" />
          </div>
          <div>
            <h1 className="page-title" style={{ letterSpacing: '0.06em' }}>COMMAND DASHBOARD</h1>
            <p className="page-subtitle">Karnataka State Police — Real-Time Intelligence Overview</p>
          </div>
        </div>
        
        {/* Presentation-hidden header widgets */}
        <div className="presentation-hidden" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 20, padding: '5px 14px',
          }}>
            <div className="status-dot" />
            <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
          </div>
          {mounted && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--cyber-cyan)', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace' }}>{currentTime}</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{currentDate}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── DISTRICT INTELLIGENCE FEED TICKER ──────────────── */}
      <div className="ticker-bar" style={{ marginBottom: 24, borderRadius: 8, background: 'rgba(0, 240, 255, 0.03)', border: '1px solid var(--cyber-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            flexShrink: 0, background: 'rgba(0, 240, 255, 0.2)', color: 'var(--cyber-cyan)',
            padding: '4px 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
            marginRight: 12, borderRadius: '6px 0 0 6px', borderRight: '1px solid var(--cyber-border)'
          }}>
            📡 BULLETIN FEED
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ticker-content animate-ticker" style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              🔴 CRITICAL: Cybercrime surge in Bengaluru Urban (412 complaints logged)   ·   &nbsp;&nbsp;   ·   &nbsp;&nbsp;   🟠 HIGH: Suspect vehicle KA-32-CD-5678 flagged on NH-48 in Belagavi corridor   ·   &nbsp;&nbsp;   ·   &nbsp;&nbsp;   🔴 CRITICAL: Sand mafia operations detected on Tungabhadra riverbanks, Raichur   ·   &nbsp;&nbsp;   ·   &nbsp;&nbsp;   🟡 MEDIUM: Organized syndicate coordination intercepted in Ballari district   ·   &nbsp;&nbsp;   ·   &nbsp;&nbsp;   🟢 NORMAL: Security sweep completed at Mangaluru Harbor.
            </div>
          </div>
        </div>
      </div>

      {/* ── PRIMARY METRIC CARDS ──────────────────────────── */}
      {/* Resized and scaled up as requested */}
      <div className="responsive-grid-4" style={{ marginBottom: 24, gap: isPresentationMode ? '24px' : '18px' }}>
        
        {/* Total Crimes */}
        <div className="glass-card" style={{ padding: isPresentationMode ? '34px 28px' : '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: isPresentationMode ? 220 : 190 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: isPresentationMode ? 60 : 52, height: isPresentationMode ? 60 : 52, borderRadius: 12,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart2 size={isPresentationMode ? 28 : 24} className="text-[var(--cyber-red)]" />
            </div>
            <span className="badge badge-red" style={{ fontSize: 10 }}>+12.4% YoY</span>
          </div>
          <div>
            <div className="metric-value neon-red" style={{ fontSize: isPresentationMode ? '3.75rem' : '3rem', fontWeight: 900, lineHeight: 1 }}>
              {SUMMARY_METRICS.totalCrimes.toLocaleString()}
            </div>
            <div className="metric-label" style={{ marginTop: 8, fontSize: isPresentationMode ? 14 : 12, fontWeight: 800 }}>Total Crimes</div>
            <div className="text-xs text-[var(--text-muted)]" style={{ marginTop: 4, lineHeight: 1.4 }}>
              Total crimes logged in the Karnataka State Police repository.
            </div>
          </div>
        </div>

        {/* Active Investigations */}
        <div className="glass-card" style={{ padding: isPresentationMode ? '34px 28px' : '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: isPresentationMode ? 220 : 190 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: isPresentationMode ? 60 : 52, height: isPresentationMode ? 60 : 52, borderRadius: 12,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={isPresentationMode ? 28 : 24} className="text-[var(--cyber-amber)]" />
            </div>
            <span className="badge badge-amber" style={{ fontSize: 10 }}>ACTIVE</span>
          </div>
          <div>
            <div className="metric-value neon-amber" style={{ fontSize: isPresentationMode ? '3.75rem' : '3rem', fontWeight: 900, lineHeight: 1 }}>
              {SUMMARY_METRICS.activeCases.toLocaleString()}
            </div>
            <div className="metric-label" style={{ marginTop: 8, fontSize: isPresentationMode ? 14 : 12, fontWeight: 800 }}>Active Investigations</div>
            <div className="text-xs text-[var(--text-muted)]" style={{ marginTop: 4, lineHeight: 1.4 }}>
              Cases currently being investigated by district panels.
            </div>
          </div>
        </div>

        {/* Threat Level */}
        <div className="glass-card" style={{ padding: isPresentationMode ? '34px 28px' : '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: isPresentationMode ? 220 : 190 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: isPresentationMode ? 60 : 52, height: isPresentationMode ? 60 : 52, borderRadius: 12,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldAlert size={isPresentationMode ? 28 : 24} className="text-[var(--cyber-red)]" />
            </div>
            <span className="badge badge-red animate-pulse" style={{ fontSize: 10 }}>ALERT</span>
          </div>
          <div>
            <div className="metric-value neon-red" style={{ fontSize: isPresentationMode ? '3.75rem' : '3rem', fontWeight: 900, lineHeight: 1 }}>
              HIGH
            </div>
            <div className="metric-label" style={{ marginTop: 8, fontSize: isPresentationMode ? 14 : 12, fontWeight: 800 }}>Threat Level</div>
            <div className="text-xs text-[var(--text-muted)]" style={{ marginTop: 4, lineHeight: 1.4 }}>
              Calculated real-time statewide intelligence security rating.
            </div>
          </div>
        </div>

        {/* Prediction Accuracy */}
        <div className="glass-card" style={{ padding: isPresentationMode ? '34px 28px' : '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: isPresentationMode ? 220 : 190 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: isPresentationMode ? 60 : 52, height: isPresentationMode ? 60 : 52, borderRadius: 12,
              background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Target size={isPresentationMode ? 28 : 24} className="text-[var(--cyber-cyan)]" />
            </div>
            <span className="badge badge-cyan" style={{ fontSize: 10 }}>94.7% CALIBRATED</span>
          </div>
          <div>
            <div className="metric-value neon-cyan" style={{ fontSize: isPresentationMode ? '3.75rem' : '3rem', fontWeight: 900, lineHeight: 1 }}>
              94.7%
            </div>
            <div className="metric-label" style={{ marginTop: 8, fontSize: isPresentationMode ? 14 : 12, fontWeight: 800 }}>Prediction Accuracy</div>
            <div className="text-xs text-[var(--text-muted)]" style={{ marginTop: 4, lineHeight: 1.4 }}>
              Confidence rating of current predictive machine models.
            </div>
          </div>
        </div>
      </div>

      {/* ── SECONDARY METRICS (Hidden in Presentation Mode) ────────────── */}
      {!isPresentationMode && (
        <div className="responsive-grid-4 animate-fadeInUp" style={{ marginBottom: 24 }}>
          {[
            { label: 'Arrests MTD', value: SUMMARY_METRICS.arrestsThisMonth.toLocaleString(), icon: <Users size={16} color="#8b5cf6" />, color: 'var(--cyber-purple)' },
            { label: 'Charges Filed', value: SUMMARY_METRICS.chargesFiledMTD.toLocaleString(), icon: <FileText size={16} color="#0ea5e9" />, color: 'var(--cyber-blue)' },
            { label: 'High Risk Districts', value: SUMMARY_METRICS.highRiskDistricts.toString(), icon: <AlertTriangle size={16} color="#ef4444" />, color: 'var(--cyber-red)' },
            { label: 'Solved Cases', value: SUMMARY_METRICS.solvedCases.toLocaleString(), icon: <Target size={16} color="#10b981" />, color: 'var(--cyber-green)' },
          ].map((m) => (
            <div key={m.label} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(0, 240, 255, 0.05)',
                border: '1px solid var(--cyber-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {m.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
                <div className="metric-label" style={{ fontSize: 11, marginTop: 3 }}>{m.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MAIN CHARTS ROW ──────────────────────────────── */}
      <div className={isPresentationMode ? 'responsive-grid-1' : 'responsive-grid-2-1'} style={{ marginBottom: 24 }}>
        
        {/* Area Chart - Expanded in Presentation Mode */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-header-line" />
            <span className="section-title">Crime Trend Analysis — 18 Months</span>
            <div style={{ marginLeft: 'auto' }}>
              <span className="badge badge-cyan" style={{ fontSize: 10 }}>LIVE DATA</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={isPresentationMode ? 420 : 320}>
            <AreaChart data={MONTHLY_CRIME_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gcyber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gviolence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gnarcotics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e879f9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#e879f9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gorganized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cyber-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: isPresentationMode ? 13 : 11 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: isPresentationMode ? 13 : 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: 'var(--text-muted)', fontSize: isPresentationMode ? 14 : 12 }} />
              <Area type="monotone" dataKey="cybercrime" name="Cybercrime" stroke="#00f0ff" strokeWidth={2} fill="url(#gcyber)" fillOpacity={1} dot={false} />
              <Area type="monotone" dataKey="violence" name="Violence" stroke="#ef4444" strokeWidth={2} fill="url(#gviolence)" fillOpacity={1} dot={false} />
              <Area type="monotone" dataKey="narcotics" name="Narcotics" stroke="#e879f9" strokeWidth={2} fill="url(#gnarcotics)" fillOpacity={1} dot={false} />
              <Area type="monotone" dataKey="organized" name="Organized" stroke="#f59e0b" strokeWidth={2} fill="url(#gorganized)" fillOpacity={1} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Hidden in Presentation Mode to simplify view */}
        {!isPresentationMode && (
          <div className="glass-card animate-fadeInUp" style={{ padding: 24 }}>
            <div className="section-header">
              <div className="section-header-line" />
              <span className="section-title">Crime Distribution</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={CRIME_CATEGORIES}
                  dataKey="count"
                  nameKey="name"
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={3}
                >
                  {CRIME_CATEGORIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
              {CRIME_CATEGORIES.map((cat) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0, boxShadow: `0 0 6px ${cat.color}` }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.count.toLocaleString()}</span>
                    <span style={{ fontSize: 10, color: cat.trend?.startsWith('+') ? '#ef4444' : '#10b981', fontWeight: 600 }}>{cat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── OPERATIONAL ROW (Recent FIRs & Top Wanted Criminals) ── */}
      <div className={isPresentationMode ? 'responsive-grid-1' : 'responsive-grid-3-2'} style={{ marginBottom: 24 }}>
        
        {/* Recent FIRs Table */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-header-line" />
            <span className="section-title">Recent FIR Registry</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="status-dot-red" />
              <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, letterSpacing: '0.08em' }}>LIVE DATABASE</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>FIR Number</th>
                  <th className="presentation-hidden">Date</th>
                  <th>Category</th>
                  <th>District</th>
                  <th>Suspect</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {FIR_RECORDS.slice(0, isPresentationMode ? 5 : 7).map((fir) => (
                  <tr key={fir.id}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: isPresentationMode ? 15 : 13 }}>
                      <Link href={`/fir?id=${fir.id}`} className="text-[var(--cyber-cyan)] hover:underline font-bold">
                        {fir.firNumber}
                      </Link>
                    </td>
                    <td className="presentation-hidden" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{fir.date}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: isPresentationMode ? 15 : 13 }}>{fir.crimeCategory}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: isPresentationMode ? 15 : 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={12} className="text-[var(--text-dim)]" />
                        {fir.district}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: isPresentationMode ? 15 : 13 }}>
                      <Link href={`/search?query=${fir.suspectDetails.name}`} className="hover:text-[var(--cyber-cyan)] hover:underline transition-colors font-semibold">
                        {fir.suspectDetails.name}
                      </Link>
                    </td>
                    <td>
                      <span className={statusBadgeClass(fir.investigationStatus)}>
                        {fir.investigationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Wanted Criminals - Hidden in Presentation Mode to keep dashboard clean */}
        {!isPresentationMode && (
          <div className="glass-card animate-fadeInUp" style={{ padding: 24 }}>
            <div className="section-header">
              <div className="section-header-line" />
              <span className="section-title">Top Wanted Criminals</span>
              <div style={{ marginLeft: 'auto' }}>
                <span className="badge badge-red font-black" style={{ fontSize: 10 }}>CRITICAL STATUS</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 380, overflowY: 'auto' }}>
              {CRIMINAL_PROFILES.filter(c => c.riskLevel === 'Critical').slice(0, 5).map((c) => (
                <div key={c.id} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Link href={`/search?query=${c.name}`} className="font-bold text-[var(--text-primary)] hover:text-[var(--cyber-cyan)] hover:underline text-[15px]">
                        {c.name}
                      </Link>
                      <span className="badge badge-red" style={{ fontSize: 9, padding: '1px 6px' }}>WANTED</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                      Age: {c.age} · {c.district}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      Last seen: {c.recentActivity}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="neon-red" style={{ fontSize: 18, fontWeight: 800 }}>{c.profileScore}</div>
                    <div className="metric-label" style={{ fontSize: 9 }}>Risk Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── TACTICAL & INSIGHTS ROW (Hidden in Presentation Mode) ── */}
      {!isPresentationMode && (
        <div className="responsive-grid-3 animate-fadeInUp" style={{ marginBottom: 24 }}>
          
          {/* AI Recommendations Checklist */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-header">
              <div className="section-header-line" />
              <span className="section-title">AI Directives Checklist</span>
              <div style={{ marginLeft: 'auto' }}>
                <span className="badge badge-cyan" style={{ fontSize: 10 }}>ACTIONABLE</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 330, overflowY: 'auto' }}>
              {COMMISSIONER_RECOMMENDATIONS.map((rec) => {
                const isCompleted = completedRecommendations.has(rec.id);
                return (
                  <div 
                    key={rec.id} 
                    onClick={() => toggleRecommendation(rec.id)}
                    style={{
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                      background: isCompleted ? 'rgba(16,185,129,0.04)' : 'rgba(0,240,255,0.02)',
                      border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.25)' : 'var(--cyber-border)'}`,
                      transition: 'all 0.2s ease',
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ marginTop: 2, flexShrink: 0 }}>
                      {isCompleted ? (
                        <CheckSquare size={18} className="text-[var(--cyber-green)]" />
                      ) : (
                        <Square size={18} className="text-[var(--cyber-cyan)]" />
                      )}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 14, fontWeight: 700, 
                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}>
                        {rec.action}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                        {rec.rationale}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <span className={isCompleted ? 'badge badge-green' : 'badge badge-red'} style={{ fontSize: 8, padding: '1px 5px' }}>
                          {rec.urgency}
                        </span>
                        <span className="badge badge-gray" style={{ fontSize: 8, padding: '1px 5px' }}>
                          PRIORITY {rec.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Operations Monitor */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-header">
              <div className="section-header-line" />
              <span className="section-title">Active Operations</span>
              <div style={{ marginLeft: 'auto' }}>
                <span className="badge badge-amber animate-pulse" style={{ fontSize: 10 }}>MONITORING</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 330, overflowY: 'auto' }}>
              {RESPONSE_TEAMS.map((team, idx) => (
                <div key={idx} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--cyber-surface)', border: '1px solid var(--cyber-border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{team.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                      background: `${team.statusColor}20`, color: team.statusColor,
                      border: `1px solid ${team.statusColor}40`,
                    }}>
                      {team.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={10} className="text-[var(--cyber-cyan)]" /> {team.district}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Users size={10} className="text-[var(--cyber-purple)]" /> {team.members} Officers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District Risk Index */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-header">
              <div className="section-header-line" />
              <span className="section-title">District Risk Index</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 330, overflowY: 'auto' }}>
              {DISTRICT_RISK_SCORES.map((d) => (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={11} className="text-[var(--text-dim)]" />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{d.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: riskBarColor(d.score) }}>{d.score}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        color: 'var(--cyber-red)',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: 10, padding: '1px 5px',
                      }}>{d.predictedIncrease}</span>
                    </div>
                  </div>
                  <div className="risk-bar-track">
                    <div className="risk-bar-fill" style={{
                      width: `${d.score}%`,
                      background: `linear-gradient(90deg, ${riskBarColor(d.score)}, ${riskBarColor(d.score)}88)`,
                      boxShadow: `0 0 8px ${riskBarColor(d.score)}66`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AI ALERT STRIP (Hidden in Presentation Mode) ────────────────── */}
      {!isPresentationMode && (
        <div style={{ marginBottom: 8 }} className="animate-fadeInUp">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div className="section-header-line" />
            <span className="section-title">
              <Bell size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} className="text-[var(--cyber-amber)]" />
              AI Intelligence Alerts
            </span>
            <span className="badge badge-amber" style={{ fontSize: 10 }}>{AI_ALERTS.length} ACTIVE</span>
            <div style={{ marginLeft: 'auto' }}>
              <Link href="/alerts" className="text-[var(--cyber-cyan)] hover:underline flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                Alert Command Center <ChevronRight size={12} />
              </Link>
            </div>
          </div>
          <div className="responsive-grid-3">
            {AI_ALERTS.slice(0, 3).map((alert) => (
              <Link
                key={alert.id}
                href="/alerts"
                className="alert-card glass-card block cursor-pointer"
                style={{
                  padding: '14px 18px',
                  borderLeft: `3px solid ${alertSeverityColor(alert.severity)}`,
                  borderRadius: '0 12px 12px 0',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span className={alertSeverityBadgeClass(alert.severity)} style={{ fontSize: 10 }}>{alert.severity}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{alert.timestamp}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 4 }}>{alert.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{alert.description.substring(0, 100)}…</div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={11} className="text-[var(--cyber-cyan)]" />
                  <span style={{ fontSize: 11, color: 'var(--cyber-cyan)', fontWeight: 600 }}>Confidence: {alert.confidence}%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
