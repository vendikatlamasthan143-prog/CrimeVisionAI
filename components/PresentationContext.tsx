'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PresentationContextType {
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
  setPresentationMode: (val: boolean) => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [isPresentationMode, setPresentationModeState] = useState<boolean>(false);

  // Load state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ksp_presentation_mode');
      if (stored === 'true') {
        setPresentationModeState(true);
        document.body.classList.add('presentation-mode');
      } else {
        setPresentationModeState(false);
        document.body.classList.remove('presentation-mode');
      }
    } catch {
      // ignore
    }
  }, []);

  const setPresentationMode = (val: boolean) => {
    setPresentationModeState(val);
    try {
      localStorage.setItem('ksp_presentation_mode', val ? 'true' : 'false');
    } catch {
      // ignore
    }

    if (val) {
      document.body.classList.add('presentation-mode');
    } else {
      document.body.classList.remove('presentation-mode');
    }
  };

  const togglePresentationMode = () => {
    setPresentationMode(!isPresentationMode);
  };

  return (
    <PresentationContext.Provider value={{ isPresentationMode, togglePresentationMode, setPresentationMode }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}
