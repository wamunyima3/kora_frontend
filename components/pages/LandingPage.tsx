'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const mostUsedServices = [
    { name: 'Name Clearance', count: '120K', icon: FileText },
    { name: 'Name Reservation', count: '80K', icon: FileText },
    { name: 'Certificate of Incorporation', count: '70K', icon: FileText },
    { name: 'Business Name Registration', count: '65K', icon: FileText },
]

export default function LandingPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated background gradient following mouse */}
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(180, 129, 63, 0.1), transparent 40%)`
                }}
            />
            
            <main className="container mx-auto px-6 py-20 relative z-10">
                {/* PACRA Logo */}
                <div className="absolute top-8 left-8">
                    <Image src="/pacra-logo.webp" alt="PACRA" width={80} height={80} />
                </div>

                {/* Hero Section */}
                <div className="text-center mb-16 mt-12">
                    <h1 
                        className="text-7xl font-bold mb-4 transition-transform duration-200"
                        style={{ 
                            color: '#B4813F',
                            transform: mounted ? `translate(${(mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 0) / 2) / 100}px, ${(mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 0) / 2) / 100}px)` : 'none'
                        }}
                    >
                        Kora
                    </h1>
                    <p className="text-2xl text-gray-600 dark:text-gray-400 mb-12">
                        PACRA Business Registry
                    </p>
                    
                    <Link href="/dashboard">
                        <Button 
                            size="lg" 
                            className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform"
                            style={{ backgroundColor: '#B4813F' }}
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Most Used Services */}
                <div className="mt-20 overflow-hidden max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Most Used Services</h2>
                    <div className="relative">
                        {/* Fade overlays */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                        
                        <div className="flex gap-4 animate-scroll">
                            {[...mostUsedServices, ...mostUsedServices].map((service, index) => (
                                <Card 
                                    key={`${service.name}-${index}`}
                                    className="flex-shrink-0 w-48 hover:shadow-lg transition-all hover:scale-105"
                                >
                                    <CardContent className="pt-6 text-center">
                                        <service.icon className="h-8 w-8 mx-auto mb-3" style={{ color: '#B4813F' }} />
                                        <h3 className="font-semibold mb-2">{service.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.count} uses</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
