
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth, signOut } from "@/auth"

export default async function DashboardPage() {
    const session = await auth()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground text-lg">Manage your services and configurations.</p>
            </div>

            <div className="grid gap-4">
                <Link href="/services/configure">
                    <Button size="lg" className="h-16 text-lg px-8">
                        Configure a Service
                    </Button>
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
                <p className="text-muted-foreground">Signed in as {session?.user?.email}</p>
                <Button onClick={async () => {
                    "use server"
                    await signOut()
                }}>Sign Out</Button>
            </div>
        </div>
    )
}
