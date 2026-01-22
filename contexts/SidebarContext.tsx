'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

type SidebarState = {
    isCollapsed: boolean
}

type SidebarAction = 
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'SET_COLLAPSED'; payload: boolean }

const SidebarContext = createContext<{
    state: SidebarState
    dispatch: React.Dispatch<SidebarAction>
} | undefined>(undefined)

const sidebarReducer = (state: SidebarState, action: SidebarAction): SidebarState => {
    switch (action.type) {
        case 'TOGGLE_SIDEBAR':
            return { ...state, isCollapsed: !state.isCollapsed }
        case 'SET_COLLAPSED':
            return { ...state, isCollapsed: action.payload }
        default:
            return state
    }
}

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(sidebarReducer, { isCollapsed: false })

    return (
        <SidebarContext.Provider value={{ state, dispatch }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider')
    }
    return context
}
