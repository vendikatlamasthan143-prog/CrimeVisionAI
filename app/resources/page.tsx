'use client';

import { useState } from 'react';
import {
  Package, Shield, Users, Monitor, Anchor, Moon, TrendingUp,
  CheckCircle, Clock, AlertTriangle, ChevronRight, Zap,
  BarChart3, MapPin, DollarSign,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  RESOURCE_RECOMMENDATIONS, DISTRICT_RESOURCES, BUDGET_ALLOCATION,
} from '@/lib/mockData';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f59e0b',
  Medium: '#8b5cf6',
  Low: '#10b981',
};

const STATUS_COLORS: Record<string, string> = {
  'Pending Approval': '#f59e0b',
  'Approved': '#00f0ff',
  'Deployed': '#10b981',
  'In Progress': '#8b5cf6',
  'Pending': '#64748b',
};

const ICON_MAP: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  monitor: Monitor,
  shield: Shield,
  anchor: Anchor,
  users: Users,
  moon: Moon,
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { category: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <p style={{ color: '#f1f5f9', fontWeight: 700 }}>{payload[0].payload.category}</p>
        <p style={{ color: '#00f0ff' }}>₹{payload[0].value}Cr</p>
      </div>
    );
  }
  return null;
};

export default function ResourcesPage() {
  const [selectedRec, setSelectedRec] = useState<number | null>(null);
  const [actionStatus, setActionStatus] = useState<Record<number, string>>({});

  const handleAction = (id: number, action: string) => {
    setActionStatus(prev => ({ ...prev, [id]: action }));
  };

  const totalOfficers = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.totalOfficers, 0);
  const totalDeployed = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.deployedPatrol, 0);
  const totalCyber = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.cyberUnits, 0);

  return (
    <div style={{ padding: '28px' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0, 240, 255, 0.12)', border: '1px solid rgba(0, 240, 255, 0.3)' }}
            >
              <Package size={20} style={{ color: '#00f0ff' }} />
            </div>
            <h1 className="page-title">Resource Deployment Intelligence</h1>
          </div>
          <p className="page-subtitle">AI-powered force allocation and deployment recommendations across Karnataka</p>
        </div>
        <div className="flex gap-3">
          <button className="cyber-btn cyber-btn-amber">
            <BarChart3 size={14} />
            ALLOCATION REPORT
          </button>
          <button className="cyber-btn cyber-btn-cyan">
            <Zap size={14} />
            AI OPTIMIZE
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Police Force', value: totalOfficers.toLocaleString(), sub: 'Karnataka', color: '#00f0ff', icon: Users },
          { label: 'Active Patrol Units', value: totalDeployed.toLocaleString(), sub: 'Deployed', color: '#10b981', icon: Shield },
          { label: 'Cyber Crime Units', value: totalCyber.toLocaleString(), sub: 'Specialized', color: '#8b5cf6', icon: Monitor },
          { label: 'Pending Approvals', value: '3', sub: 'AI Recommendations', color: '#f59e0b', icon: Clock },
        ].map((metric, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="metric-label">{metric.label}</span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${metric.color}18`, border: `1px solid ${metric.color}30` }}
              >
                <metric.icon size={18} style={{ color: metric.color }} />
              </div>
            </div>
            <div className="metric-value" style={{ color: metric.color }}>{metric.value}</div>
            <div className="metric-sub">{metric.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="section-header-line" />
          <h2 className="section-title">AI Deployment Recommendations</h2>
          <span
            className="badge badge-cyan ml-2"
            style={{ fontSize: '10px' }}
          >
            6 ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {RESOURCE_RECOMMENDATIONS.map((rec) => {
            const IconComp = ICON_MAP[rec.icon] || Shield;
            const statusAction = actionStatus[rec.id];
            return (
              <div
                key={rec.id}
                className="glass-card p-5 cursor-pointer"
                style={{
                  borderLeft: `3px solid ${PRIORITY_COLORS[rec.priority] || '#64748b'}`,
                  borderLeftWidth: '4px',
                }}
                onClick={() => setSelectedRec(selectedRec === rec.id ? null : rec.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${rec.color}15`, border: `1px solid ${rec.color}30` }}
                    >
                      <IconComp size={18} style={{ color: rec.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="badge"
                          style={{
                            background: `${PRIORITY_COLORS[rec.priority]}20`,
                            color: PRIORITY_COLORS[rec.priority],
                            border: `1px solid ${PRIORITY_COLORS[rec.priority]}40`,
                            fontSize: '10px',
                          }}
                        >
                          {rec.priority.toUpperCase()}
                        </span>
                        <span
                          className="badge"
                          style={{
                            background: `${STATUS_COLORS[rec.status] || '#64748b'}18`,
                            color: STATUS_COLORS[rec.status] || '#64748b',
                            border: `1px solid ${STATUS_COLORS[rec.status] || '#64748b'}35`,
                            fontSize: '10px',
                          }}
                        >
                          {rec.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-bold" style={{ color: '#f1f5f9', fontSize: '15px' }}>{rec.action}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: '#64748b', fontSize: '12px' }}>
                    <MapPin size={12} />
                    <span>{rec.district}</span>
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{rec.reason}</p>

                {selectedRec === rec.id && (
                  <div
                    className="animate-fadeInUp"
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Units Required</div>
                        <div style={{ color: '#00f0ff', fontSize: '18px', fontWeight: 800 }}>{rec.units}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Timeline</div>
                        <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600 }}>{rec.timeline}</div>
                      </div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Expected Impact</div>
                    <div style={{ color: '#10b981', fontSize: '13px' }}>{rec.impact}</div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {statusAction ? (
                      <div className="flex items-center gap-1.5" style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                        <CheckCircle size={14} />
                        {statusAction}
                      </div>
                    ) : (
                      <>
                        <button
                          className="cyber-btn cyber-btn-green"
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={(e) => { e.stopPropagation(); handleAction(rec.id, 'Approved'); }}
                        >
                          APPROVE
                        </button>
                        <button
                          className="cyber-btn cyber-btn-cyan"
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={(e) => { e.stopPropagation(); handleAction(rec.id, 'Under Review'); }}
                        >
                          REVIEW
                        </button>
                      </>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    style={{
                      color: '#64748b',
                      transform: selectedRec === rec.id ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Matrix + Budget */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Priority Matrix */}
        <div className="glass-card p-5 col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <div className="section-header-line" />
            <h2 className="section-title">Priority Matrix</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'HIGH IMPACT HIGH URGENCY', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', items: ['Cyber Task Force', 'Border Checkposts'] },
              { label: 'HIGH IMPACT LOW URGENCY', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', items: ['Cyber Command Center', 'SIT Expansion'] },
              { label: 'LOW IMPACT HIGH URGENCY', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', items: ['Night Patrolling', 'Port Security'] },
              { label: 'LOW IMPACT LOW URGENCY', color: '#64748b', bg: 'rgba(100,116,139,0.08)', items: ['Community Programs', 'Training'] },
            ].map((cell, i) => (
              <div
                key={i}
                className="priority-cell"
                style={{ background: cell.bg, border: `1px solid ${cell.color}25` }}
              >
                <div style={{ color: cell.color, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>{cell.label}</div>
                {cell.items.map((item, j) => (
                  <div key={j} style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '2px' }}>• {item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Budget Allocation */}
        <div className="glass-card p-5 col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <div className="section-header-line" />
            <h2 className="section-title">Budget Allocation — FY 2025-26</h2>
            <span style={{ color: '#64748b', fontSize: '12px' }}>(₹ in Crores)</span>
          </div>
          <div className="flex items-center gap-6">
            <div style={{ width: 220, height: 220, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BUDGET_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="amount"
                    stroke="none"
                  >
                    {BUDGET_ALLOCATION.map((entry, index) => (
                      <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {BUDGET_ALLOCATION.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{item.category}</span>
                      <div className="flex gap-3">
                        <span style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 700 }}>₹{item.amount}Cr</span>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="risk-bar-track">
                      <div className="risk-bar-fill" style={{ width: `${item.percentage * 2}%`, background: item.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* District Resource Table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="section-header-line" />
            <h2 className="section-title">District Resource Deployment Status</h2>
          </div>
          <button className="cyber-btn cyber-btn-cyan" style={{ padding: '7px 14px', fontSize: '11px' }}>
            EXPORT TABLE
          </button>
        </div>
        <div className="table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Total Officers</th>
                <th>Patrol Deployed</th>
                <th>Cyber Units</th>
                <th>Detectives</th>
                <th>Coverage Score</th>
              </tr>
            </thead>
            <tbody>
              {DISTRICT_RESOURCES.map((d, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} style={{ color: '#64748b' }} />
                      <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{d.district}</span>
                    </div>
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{d.totalOfficers.toLocaleString()}</td>
                  <td style={{ color: '#cbd5e1' }}>{d.deployedPatrol.toLocaleString()}</td>
                  <td>
                    <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{d.cyberUnits}</span>
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{d.detectives}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="risk-bar-track" style={{ width: 80 }}>
                        <div
                          className="risk-bar-fill"
                          style={{
                            width: `${d.coverage}%`,
                            background: d.coverage >= 80 ? '#10b981' : d.coverage >= 60 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          color: d.coverage >= 80 ? '#10b981' : d.coverage >= 60 ? '#f59e0b' : '#ef4444',
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      >
                        {d.coverage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
