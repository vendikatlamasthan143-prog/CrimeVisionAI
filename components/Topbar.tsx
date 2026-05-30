'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, Wifi, Clock, Monitor, X } from 'lucide-react';
import Link from 'next/link';

export default function Topbar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const DEMO_PAGES = ['/', '/heatmap', '/network', '/insights', '/predictions', '/alerts', '/timeline', '/social-risk', '/investigator', '/anomaly', '/resources', '/commissioner', '/reports'];

  useEffect(() => {
    if (demoMode) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  }, [demoMode]);

  return (
    <>
      <header
        className="fixed top-0 right-0 flex items-center justify-between px-6 py-3 z-40"
        style={{
          left: '288px',
          background: 'rgba(2, 6, 23, 0.95)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
          backdropFilter: 'blur(24px)',
          height: '64px',
        }}
      >
        {/* Left: Breadcrumb + Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #00f0ff, #8b5cf6)' }} />
            <span className="text-sm font-bold tracking-wide" style={{ color: '#f1f5f9' }}>Karnataka State Police</span>
            <span style={{ color: '#334155' }}>›</span>
            <span className="text-sm" style={{ color: '#00f0ff' }}>CrimeVision AI v5.0</span>
          </div>
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}
          >
            <div className="status-dot" style={{ width: 6, height: 6 }} />
            <span className="text-xs font-bold" style={{ color: '#10b981' }}>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:flex">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
            <input
              type="text"
              placeholder="Search cases, suspects, districts..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none w-60"
              style={{
                background: 'rgba(10, 22, 40, 0.9)',
                border: '1px solid rgba(0, 240, 255, 0.15)',
                color: '#94a3b8',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Secure Connection */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
          >
            <Wifi size={12} style={{ color: '#10b981' }} />
            <span className="text-xs font-bold" style={{ color: '#10b981' }}>256-BIT SECURE</span>
          </div>

          {/* Demo Mode Button */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={demoMode ? {
              background: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              color: '#00f0ff',
            } : {
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#a78bfa',
            }}
          >
            <Monitor size={12} />
            {demoMode ? 'EXIT DEMO' : 'DEMO MODE'}
          </button>

          {/* Alerts */}
          <Link href="/alerts">
            <button
              className="relative p-2 rounded-lg transition-all"
              style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <Bell size={16} style={{ color: '#f87171' }} />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse"
                style={{ background: '#ef4444', color: '#fff', fontSize: '9px' }}
              >
                10
              </span>
            </button>
          </Link>

          {/* Clock */}
          <div className="hidden lg:flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <Clock size={11} style={{ color: '#00f0ff' }} />
              <span className="text-sm font-mono font-black" style={{ color: '#00f0ff' }}>{time}</span>
            </div>
            <span className="text-xs" style={{ color: '#64748b' }}>{date}</span>
          </div>
        </div>
      </header>

      {/* Demo Mode Overlay */}
      {demoMode && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-2xl"
          style={{
            background: 'rgba(10, 22, 40, 0.95)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 32px rgba(0, 240, 255, 0.15)',
          }}
        >
          <div className="status-dot" />
          <span className="text-sm font-bold" style={{ color: '#00f0ff' }}>PRESENTATION MODE ACTIVE</span>
          <span className="text-xs" style={{ color: '#64748b' }}>Use navigation to switch pages</span>
          <button
            onClick={() => setDemoMode(false)}
            className="p-1 rounded"
            style={{ color: '#64748b' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
