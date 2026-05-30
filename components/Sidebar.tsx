'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map, Network, Brain, TrendingUp, FileText,
  Shield, Zap, Radio, Bell, Clock, BarChart3, MessageSquare,
  AlertTriangle, Package, Eye, Star,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'COMMAND',
    items: [
      { href: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
      { href: '/commissioner', icon: Eye, label: 'Commissioner View', badge: null },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { href: '/heatmap', icon: Map, label: 'Karnataka Map', badge: null },
      { href: '/network', icon: Network, label: 'Criminal Network', badge: null },
      { href: '/alerts', icon: Bell, label: 'Live Alerts', badge: '10' },
      { href: '/anomaly', icon: AlertTriangle, label: 'Anomaly Detection', badge: '6' },
    ],
  },
  {
    label: 'ANALYSIS',
    items: [
      { href: '/insights', icon: Brain, label: 'AI Insights', badge: null },
      { href: '/timeline', icon: Clock, label: 'Crime Timeline', badge: null },
      { href: '/social-risk', icon: BarChart3, label: 'Social Risk Factors', badge: null },
      { href: '/predictions', icon: TrendingUp, label: 'Risk Prediction', badge: null },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { href: '/investigator', icon: MessageSquare, label: 'AI Investigator', badge: null },
      { href: '/resources', icon: Package, label: 'Resource Allocation', badge: null },
      { href: '/reports', icon: FileText, label: 'Reports', badge: null },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-72 flex flex-col z-50"
      style={{
        background: 'rgba(2, 6, 23, 0.98)',
        borderRight: '1px solid rgba(0, 240, 255, 0.12)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(139,92,246,0.15))',
                border: '1px solid rgba(0, 240, 255, 0.35)',
              }}
            >
              <Shield size={22} style={{ color: '#00f0ff' }} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse-glow" />
          </div>
          <div>
            <div className="text-sm font-black tracking-widest" style={{ color: '#00f0ff', letterSpacing: '0.15em' }}>
              CRIMEVISION
            </div>
            <div className="text-xs font-medium tracking-widest" style={{ color: '#64748b' }}>
              AI INTELLIGENCE PLATFORM
            </div>
          </div>
        </div>
      </div>

      {/* Live Status Bar */}
      <div
        className="px-5 py-2.5 flex items-center justify-between"
        style={{ background: 'rgba(16, 185, 129, 0.04)', borderBottom: '1px solid rgba(0, 240, 255, 0.06)' }}
      >
        <span className="status-live">
          <span className="status-dot" />
          LIVE FEED ACTIVE
        </span>
        <div className="flex items-center gap-1.5">
          <Radio size={10} style={{ color: '#00f0ff' }} className="animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: '#475569' }}>v5.0</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
            <div className="sidebar-section-label">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <item.icon size={15} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          border: '1px solid rgba(239,68,68,0.3)',
                          fontSize: '10px',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Threat Level + Officer */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
        <div
          className="p-3 rounded-xl mb-3"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Zap size={12} style={{ color: '#ef4444' }} />
              <span className="text-xs font-bold" style={{ color: '#f87171' }}>STATE THREAT LEVEL</span>
            </div>
            <span className="text-xs font-black" style={{ color: '#ef4444' }}>HIGH</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-sm"
                style={{
                  background: i <= 4 ? '#ef4444' : 'rgba(255,255,255,0.08)',
                  boxShadow: i <= 4 ? '0 0 4px rgba(239,68,68,0.5)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(139,92,246,0.15))',
              color: '#00f0ff',
              border: '1px solid rgba(0, 240, 255, 0.3)',
            }}
          >
            <Star size={14} />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: '#f1f5f9' }}>DGP Rajesh Kumar</div>
            <div className="text-xs" style={{ color: '#64748b' }}>Director General of Police</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
