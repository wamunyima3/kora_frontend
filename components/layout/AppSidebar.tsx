'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuGroup,
    SidebarMenuGroupLabel,
} from '@/components/ui/sidebar'
import { FileText, FileCheck, FileSearch } from 'lucide-react'

const menuItems = [
    {
        title: 'Create Service',
        icon: FileText,
        href: '/services/configure',
    },
    // {
    //     title: 'Name Registration',
    //     icon: FileCheck,
    //     href: '/services/details/name-reservation',
    // },
    // {
    //     title: 'Name Reservation',
    //     icon: FileSearch,
    //     href: '/services/detailsname-reservation',
    // },
]

interface AppSidebarProps {
    isMobileOpen?: boolean
    onMobileClose?: () => void
}

export function AppSidebar({ isMobileOpen, onMobileClose }: AppSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    const handleNavigation = (href: string) => {
        router.push(href)
        onMobileClose?.()
    }

    return (
        <Sidebar isMobileOpen={isMobileOpen} onMobileClose={onMobileClose}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="text-xl font-bold text-primary">K</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-semibold">Kora</h1>
                        <span className="text-xs text-muted-foreground">Service Portal</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuGroup>
                        <SidebarMenuGroupLabel>Services</SidebarMenuGroupLabel>
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href || 
                                (item.href !== '/' && pathname?.startsWith(item.href))
                            
                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        onClick={() => handleNavigation(item.href)}
                                        className="w-full justify-start"
                                    >
                                        <Icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenuGroup>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="px-2 text-xs text-muted-foreground">
                    0.0.1
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
