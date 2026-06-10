'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Bell, Search, Shield, X, FileText, User, MapPin, AlertTriangle, Monitor, Sun, Moon, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageToggle';
import { useTheme } from './ThemeContext';
import { usePresentation } from './PresentationContext';
import AlertPanel from './AlertPanel';
import UserMenu from './UserMenu';
import { FIR_RECORDS, CRIMINAL_PROFILES, CRIME_CATEGORIES, LIVE_ALERTS } from '@/lib/mockData';
import { DISTRICTS, RECENT_FIRS, TOP_SUSPECTS } from '@/lib/crimeData';
import { DemoAccount } from '@/lib/crimeData';

interface TopbarProps {
  user?: DemoAccount | null;
}

export default function Topbar({ user }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isPresentationMode, togglePresentationMode } = usePresentation();

  // Active unacknowledged alerts count
  const unreadAlertsCount = LIVE_ALERTS.filter(alert => !alert.acknowledged).length;

  // Press "/" to focus search, ESC to close dropdown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        setActiveIdx(-1);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const q = searchQuery.trim().toLowerCase();

  // Matched results
  const matchedFIRs = q.length >= 2
    ? RECENT_FIRS.filter(f =>
        f.firNumber.toLowerCase().includes(q) ||
        f.crimeType.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.suspectName.toLowerCase().includes(q) ||
        f.assignedOfficer.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedSuspects = q.length >= 2
    ? TOP_SUSPECTS.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.alias.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.crimeType.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedDistricts = q.length >= 2
    ? DISTRICTS.filter(d => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedCategories = q.length >= 2
    ? CRIME_CATEGORIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  // Flatten for keyboard navigation
  type ResultItem =
    | { kind: 'fir'; data: typeof RECENT_FIRS[number] }
    | { kind: 'suspect'; data: typeof TOP_SUSPECTS[number] }
    | { kind: 'district'; data: typeof DISTRICTS[number] }
    | { kind: 'category'; data: typeof CRIME_CATEGORIES[number] };

  const allResults: ResultItem[] = [
    ...matchedFIRs.map(f => ({ kind: 'fir' as const, data: f })),
    ...matchedSuspects.map(s => ({ kind: 'suspect' as const, data: s })),
    ...matchedDistricts.map(d => ({ kind: 'district' as const, data: d })),
    ...matchedCategories.map(c => ({ kind: 'category' as const, data: c })),
  ];

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      const item = allResults[activeIdx];
      if (item.kind === 'fir') router.push(`/fir?id=${item.data.id}`);
      else if (item.kind === 'suspect') router.push(`/search?query=${encodeURIComponent(item.data.name)}`);
      else if (item.kind === 'district') router.push(`/heatmap?district=${encodeURIComponent(item.data.name)}`);
      else if (item.kind === 'category') router.push(`/search?query=${encodeURIComponent(item.data.name)}`);
      setShowDropdown(false);
      setSearchQuery('');
      setActiveIdx(-1);
    }
  }, [showDropdown, activeIdx, allResults, router]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    setActiveIdx(-1);
  };

  const riskColor = (score: number) => {
    if (score > 80) return '#ef4444';
    if (score > 60) return '#f59e0b';
    return 'var(--cyber-cyan)';
  };

  return (
    <>
      <header
        className="fixed top-0 right-0 flex items-center justify-between px-6 z-40"
        style={{
          left: '280px',
          background: 'var(--topbar-bg)',
          borderBottom: '1px solid var(--cyber-border)',
          backdropFilter: 'blur(24px)',
          height: '64px',
        }}
      >
        {/* Left: Premium KSP Logo & Status */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.body.classList.toggle('sidebar-open');
              }
            }}
            className="hamburger-btn p-1.5 rounded-lg border mr-1 cursor-pointer transition-colors"
            style={{
              borderColor: 'var(--cyber-border)',
              background: 'rgba(10,22,40,0.1)',
              color: 'var(--text-muted)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Toggle Sidebar"
          >
            <Menu size={16} />
          </button>

          <div className="relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(139,92,246,0.08))',
                border: '1px solid var(--cyber-border)',
              }}
            >
              <Shield size={20} className="text-[var(--cyber-cyan)]" />
            </div>
            {/* Small Green Dot near Logo */}
            <div
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2"
              style={{
                borderColor: 'var(--topbar-bg)',
                boxShadow: '0 0 6px #10b981',
                animation: 'pulse-glow 2s infinite',
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-[var(--text-primary)] uppercase leading-none">
              CrimeVision AI
            </span>
            <span className="text-[9px] font-extrabold text-[var(--text-dim)] tracking-widest mt-1 uppercase leading-none">
              AI Intelligence Platform
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="relative flex-1 max-w-2xl mx-8" ref={dropdownRef}>
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)', pointerEvents: 'none' }} />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search FIR, Suspect, District, Crime Type..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); setActiveIdx(-1); }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className="w-full py-2.5 pl-10 pr-9 border text-sm transition-all text-[var(--text-primary)] outline-none"
            style={{
              background: 'var(--cyber-bg)',
              borderColor: 'var(--cyber-border)',
              borderRadius: 10,
              fontFamily: 'inherit',
            }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = 'var(--cyber-cyan)'; }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; }}
          />
          {searchQuery && (
            <button onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--text-dim)] hover:text-[var(--text-primary)] p-0.5">
              <X size={13} />
            </button>
          )}

          {/* Search Dropdown */}
          {showDropdown && (
            <div
              className="absolute top-12 left-0 right-0 rounded-xl z-50 border"
              style={{
                background: 'var(--topbar-bg)',
                borderColor: 'var(--cyber-border)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(20px)',
                padding: 16,
              }}
            >
              {/* Empty state / Quick Suggestions */}
              {!q && (
                <div>
                  <div className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-wider mb-2.5">
                    Quick Intelligence Search
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {['Bengaluru Urban', 'Cybercrime', 'Narcotics', 'Suresh Nayak', 'Rape', 'Murder'].map(chip => (
                      <button
                        key={chip}
                        onMouseDown={() => setSearchQuery(chip)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors border"
                        style={{
                          background: 'var(--cyber-bg)',
                          borderColor: 'var(--cyber-border)',
                          color: 'var(--text-muted)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyber-cyan)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-[var(--text-dim)] leading-relaxed">
                    Type at least 2 characters · Press <kbd className="px-1 rounded bg-slate-500/10 border border-slate-500/20 text-[9px]">↑↓</kbd> to navigate · <kbd className="px-1 rounded bg-slate-500/10 border border-slate-500/20 text-[9px]">Enter</kbd> to select · Press <kbd className="px-1 rounded bg-slate-500/10 border border-slate-500/20 text-[9px]">ESC</kbd> or <kbd className="px-1 rounded bg-slate-500/10 border border-slate-500/20 text-[9px]">/</kbd> key
                  </div>
                </div>
              )}

              {/* No results */}
              {q && allResults.length === 0 && (
                <div className="text-center py-4 text-xs text-[var(--text-muted)]">
                  No records found for &ldquo;<span className="text-[var(--cyber-cyan)] font-bold">{searchQuery}</span>&rdquo;
                </div>
              )}

              {/* Categorized Dropdown Results */}
              {q && allResults.length > 0 && (
                <div style={{ maxHeight: 360, overflowY: 'auto' }} className="space-y-4">
                  
                  {/* FIRs */}
                  {matchedFIRs.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-[var(--cyber-cyan)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FileText size={10} /> 📄 FIR Cases ({matchedFIRs.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {matchedFIRs.map((fir, i) => {
                          const flatIdx = i;
                          return (
                            <Link key={fir.id} href={`/fir?id=${fir.id}`}
                              onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                              className="block p-2.5 rounded-lg border transition-all text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(0,240,255,0.06)' : 'transparent',
                                borderColor: activeIdx === flatIdx ? 'var(--cyber-cyan)' : 'transparent',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-[var(--cyber-cyan)]">{fir.firNumber}</span>
                                <span className="text-[9px] font-black text-red-500">{fir.priority}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-0.5">
                                <span>{fir.crimeType}</span>
                                <span>📍 {fir.district}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Suspects */}
                  {matchedSuspects.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-red-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <User size={10} /> 👤 Suspect Dossiers ({matchedSuspects.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {matchedSuspects.map((s, i) => {
                          const flatIdx = matchedFIRs.length + i;
                          return (
                            <Link key={s.id} href={`/search?query=${encodeURIComponent(s.name)}`}
                              onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                              className="block p-2.5 rounded-lg border transition-all text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(239,68,68,0.05)' : 'transparent',
                                borderColor: activeIdx === flatIdx ? 'rgba(239,68,68,0.3)' : 'transparent',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{s.name}</span>
                                <span className="text-[9px] font-bold text-amber-500">Risk: {s.riskLevel}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-0.5">
                                <span>&ldquo;{s.alias}&rdquo; · {s.crimeType}</span>
                                <span>📍 {s.district}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Districts */}
                  {matchedDistricts.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-purple-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <MapPin size={10} /> 📍 Districts Intelligence ({matchedDistricts.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {matchedDistricts.map((d, i) => {
                          const flatIdx = matchedFIRs.length + matchedSuspects.length + i;
                          return (
                            <Link key={d.id} href={`/heatmap?district=${encodeURIComponent(d.name)}`}
                              onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                              className="block p-2.5 rounded-lg border transition-all text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(167,139,250,0.06)' : 'transparent',
                                borderColor: activeIdx === flatIdx ? 'rgba(167,139,250,0.3)' : 'transparent',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{d.name}</span>
                                <span className="text-[9px] font-bold" style={{ color: riskColor(d.riskScore) }}>Risk Score: {d.riskScore}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-0.5">
                                <span>{d.crimeCount.toLocaleString()} incidents</span>
                                <span>Top: {d.topCrimeType}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Crime Categories */}
                  {matchedCategories.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle size={10} /> ⚠ Crime Categories ({matchedCategories.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {matchedCategories.map((c, i) => {
                          const flatIdx = matchedFIRs.length + matchedSuspects.length + matchedDistricts.length + i;
                          return (
                            <Link key={c.name} href={`/search?query=${encodeURIComponent(c.name)}`}
                              onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                              className="block p-2.5 rounded-lg border transition-all text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(245,158,11,0.06)' : 'transparent',
                                borderColor: activeIdx === flatIdx ? 'rgba(245,158,11,0.3)' : 'transparent',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{c.name}</span>
                                <span className="text-[9px] font-bold text-red-500">{c.trend} Trend</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-0.5">
                                <span>{c.count.toLocaleString()} cases</span>
                                <span>State distribution: {c.percentage}%</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions Row */}
        <div className="flex items-center gap-3">
          {/* Presentation Mode Toggle */}
          <button
            onClick={togglePresentationMode}
            title={isPresentationMode ? "Exit Projector View" : "Presentation Mode (Projector)"}
            className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors"
            style={{
              background: 'rgba(10, 22, 40, 0.2)',
              borderColor: isPresentationMode ? 'var(--cyber-cyan)' : 'var(--cyber-border)',
              color: isPresentationMode ? 'var(--cyber-cyan)' : 'var(--text-muted)',
            }}
            onMouseEnter={e => {
              if (!isPresentationMode) e.currentTarget.style.borderColor = 'var(--cyber-border-hover)';
            }}
            onMouseLeave={e => {
              if (!isPresentationMode) e.currentTarget.style.borderColor = 'var(--cyber-border)';
            }}
          >
            <Monitor size={15} />
          </button>

          {/* Theme Toggle (Light/Dark) */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors"
            style={{
              background: 'rgba(10, 22, 40, 0.2)',
              borderColor: 'var(--cyber-border)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--cyber-border-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--cyber-border)';
            }}
          >
            {theme === 'light' ? (
              <Moon size={15} className="text-blue-500" />
            ) : (
              <Sun size={15} className="text-amber-500" />
            )}
          </button>

          {/* Language Toggle Link */}
          <div className="flex items-center gap-1 border border-[var(--cyber-border)] rounded-lg p-0.5 px-2 bg-slate-900/10 h-9">
            <button
              onClick={() => setLang('en')}
              className={`text-[10px] font-bold px-1.5 py-1 rounded cursor-pointer transition-colors ${
                lang === 'en' ? 'bg-[var(--cyber-cyan)]/25 text-[var(--cyber-cyan)]' : 'text-[var(--text-dim)]'
              }`}
            >
              EN
            </button>
            <span className="text-[10px] text-[var(--text-dim)]">|</span>
            <button
              onClick={() => setLang('kn')}
              className={`text-[10px] font-bold px-1.5 py-1 rounded cursor-pointer transition-colors ${
                lang === 'kn' ? 'bg-[var(--cyber-cyan)]/25 text-[var(--cyber-cyan)]' : 'text-[var(--text-dim)]'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsAlertOpen(true)}
              className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors relative"
              style={{
                background: 'rgba(10, 22, 40, 0.2)',
                borderColor: 'var(--cyber-border)',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--cyber-border-hover)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--cyber-border)';
              }}
            >
              <Bell size={15} />
              {unreadAlertsCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[8px] font-black text-white flex items-center justify-center"
                  style={{ boxShadow: '0 0 6px #ef4444' }}
                >
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </div>

          {/* User Profile Dropdown */}
          <UserMenu user={user} />
        </div>
      </header>

      {/* Alert Panel Slide-over Drawer */}
      <AlertPanel isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />
    </>
  );
}
