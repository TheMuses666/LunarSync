'use client'

import { createContext, useContext, useState } from 'react'
import type { TimeMode } from '@/lib/time'

interface ModeContextValue {
  mode: TimeMode
  setMode: (m: TimeMode) => void
}

const ModeContext = createContext<ModeContextValue>({
  mode: 'beijing',
  setMode: () => {},
})

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<TimeMode>('beijing')
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  return useContext(ModeContext)
}
