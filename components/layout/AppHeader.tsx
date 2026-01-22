'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Moon, Sun, LogOut, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface AppHeaderProps {
    onMenuClick?: () => void
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push('/login')
        router.refresh()
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:container md:mx-auto">
                <div className="flex items-center gap-2 md:gap-4">
                    {onMenuClick && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuClick}
                            className="h-9 w-9 md:hidden"
                            aria-label="Toggle menu"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                    <h2 className="text-base md:text-lg font-semibold">Dashboard</h2>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                    {mounted ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-9 w-9"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    ) : (
                        <div className="h-9 w-9" />
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="gap-1 md:gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
