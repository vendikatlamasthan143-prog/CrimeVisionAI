'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Map, Network, Brain, TrendingUp, FileText,
  Shield, Zap, Radio, Bell, Clock, BarChart3, MessageSquare,
  AlertTriangle, Package, Eye, Cpu, Crosshair, Dna, User
} from 'lucide-react';
import { useLanguage } from './LanguageToggle';
import { DemoAccount } from '@/lib/crimeData';
import { LIVE_ALERTS } from '@/lib/mockData';

interface SidebarProps {
  user?: DemoAccount | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { t, lang } = useLanguage();

  // Active unacknowledged alerts count
  const unreadAlertsCount = LIVE_ALERTS.filter(alert => !alert.acknowledged).length;

  const NAV_GROUPS = [
    {
      label: lang === 'en' ? 'DASHBOARD' : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      items: [
        { href: '/', icon: LayoutDashboard, label: t.nav_dashboard, badge: null },
        { href: '/commissioner', icon: Eye, label: t.nav_commissioner_view, badge: null },
      ],
    },
    {
      label: t.group_intelligence,
      items: [
        { href: '/heatmap', icon: Map, label: t.nav_karnataka_map, badge: null },
        { href: '/network', icon: Network, label: t.nav_criminal_network, badge: null },
        { href: '/alerts', icon: Bell, label: t.nav_live_alerts, badge: unreadAlertsCount > 0 ? String(unreadAlertsCount) : null },
        { href: '/anomaly', icon: AlertTriangle, label: t.nav_anomaly_detection, badge: null },
      ],
    },
    {
      label: lang === 'en' ? 'AI TOOLS' : 'AI ಪರಿಕರಗಳು',
      items: [
        { href: '/investigator', icon: MessageSquare, label: t.nav_ai_investigator, badge: null },
        { href: '/genome', icon: Dna, label: t.nav_crime_genome, badge: null },
        { href: '/detective', icon: Cpu, label: t.nav_ai_detective, badge: null },
        { href: '/copilot', icon: Crosshair, label: t.nav_investigation_copilot, badge: null },
      ],
    },
    {
      label: lang === 'en' ? 'ANALYTICS' : 'ವಿಶ್ಲೇಷಣೆ',
      items: [
        { href: '/insights', icon: Brain, label: t.nav_ai_insights, badge: null },
        { href: '/timeline', icon: Clock, label: t.nav_crime_timeline, badge: null },
        { href: '/social-risk', icon: BarChart3, label: t.nav_social_risk, badge: null },
        { href: '/predictions', icon: TrendingUp, label: t.nav_risk_prediction, badge: null },
      ],
    },
    {
      label: lang === 'en' ? 'OPERATIONS' : 'ಕಾರ್ಯಾಚರಣೆ',
      items: [
        { href: '/resources', icon: Package, label: t.nav_resource_allocation, badge: null },
        { href: '/reports', icon: FileText, label: t.nav_reports, badge: null },
      ],
    },
  ];

  const roleColor = () => {
    if (!user) return '#00f0ff';
    if (user.role === 'DGP') return '#ef4444';
    if (user.role === 'Commissioner') return '#f59e0b';
    return '#00f0ff';
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50 select-none"
      style={{
        width: '280px',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--cyber-border)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--cyber-border)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center animate-pulse-glow"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(139,92,246,0.08))',
                border: '1px solid var(--cyber-border)',
              }}
            >
              <Shield size={22} className="text-[var(--cyber-cyan)]" />
            </div>
          </div>
          <div>
            <div className="text-sm font-black tracking-widest text-[var(--cyber-cyan)]" style={{ letterSpacing: '0.15em' }}>
              CRIMEVISION
            </div>
            <div className="text-[9px] font-bold tracking-wider text-[var(--text-dim)] uppercase mt-0.5">
              Karnataka Police Intel
            </div>
          </div>
        </div>
      </div>


      {/* ── Navigation Groups ─────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div
              className="px-3 py-1.5 text-[10px] font-black tracking-widest uppercase"
              style={group.label.includes('AI TOOLS') || group.label.includes('ಪರಿಕರಗಳು') ? {
                color: 'var(--cyber-cyan)',
                textShadow: '0 0 8px rgba(0,240,255,0.4)',
                borderLeft: '2px solid var(--cyber-cyan)',
                paddingLeft: '10px',
                marginBottom: '4px',
              } : { color: 'var(--text-dim)' }}
            >
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (typeof document !== 'undefined') {
                        document.body.classList.remove('sidebar-open');
                      }
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                    style={{
                      background: isActive ? 'rgba(0,240,255,0.06)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--cyber-cyan)' : 'transparent'}`,
                      color: isActive ? 'var(--cyber-cyan)' : 'var(--text-muted)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }
                    }}
                  >
                    <item.icon size={15} />
                    <span className="flex-1 text-[13px] font-bold">{item.label}</span>
                    {item.badge && (
                      <span
                        className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.25)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[var(--cyber-cyan)]"
                        style={{ boxShadow: '0 0 6px var(--cyber-cyan)' }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Threat Level + Officer Info ───────────────────────────────── */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--cyber-border)', background: 'rgba(0,0,0,0.05)' }}>
        {/* State threat bar */}
        <div className="p-3 rounded-xl mb-3" style={{
          background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)',
        }}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Zap size={11} className="text-red-500" />
              <span className="text-[10px] font-black text-red-400 tracking-wider uppercase">
                {t.state_threat}
              </span>
            </div>
            <span className="text-[10px] font-black text-red-500">HIGH</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 h-1 rounded-sm"
                style={{
                  background: i <= 4 ? '#ef4444' : 'rgba(255,255,255,0.08)',
                  boxShadow: i <= 4 ? '0 0 4px rgba(239,68,68,0.4)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Officer info */}
        <div className="flex items-center gap-2.5 px-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, rgba(${user?.role === 'DGP' ? '239,68,68' : user?.role === 'Commissioner' ? '245,158,11' : '0,240,255'},0.1), rgba(139,92,246,0.1))`,
              color: roleColor(),
              border: `1px solid rgba(${user?.role === 'DGP' ? '239,68,68' : user?.role === 'Commissioner' ? '245,158,11' : '0,240,255'},0.25)`,
            }}
          >
            <User size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold truncate text-[var(--text-primary)]">
              {user?.name ?? 'KSP Officer'}
            </div>
            <div className="text-[10px] font-semibold truncate text-[var(--text-dim)] mt-0.5">
              {user?.designation ?? 'Karnataka Police'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
