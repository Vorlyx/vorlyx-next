'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { LetsTalkProvider } from '@/app/context/LetsTalkContext'
import { NavbarStateProvider } from '@/app/context/NavbarStateContext'
import LetsTalkModal from '@/components/LetsTalkModal'
import LetsTalkButton from '@/components/LetsTalkButton'

/**
 * Global Providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NavbarStateProvider>
        <LetsTalkProvider>
          {children}

          {/* Fixed floating "Let's talk" button
              — Position adapts based on navbar visibility */}
          <LetsTalkButton />

          {/* Global contact form modal */}
          <LetsTalkModal />
        </LetsTalkProvider>
      </NavbarStateProvider>
    </Provider>
  )
}