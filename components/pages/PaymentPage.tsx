'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface PaymentPageProps {
    submissionId: string
}

export default function PaymentPage({ submissionId }: PaymentPageProps) {
    return (
        <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pt-24 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Submission Successful!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center space-y-2">
                            <p className="text-muted-foreground">
                                Your form has been submitted successfully.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Submission ID: <span className="font-mono font-semibold">{submissionId}</span>
                            </p>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-4">Next Steps</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                <li>Proceed to payment to complete your application</li>
                                <li>You will receive a confirmation email once payment is processed</li>
                                <li>Your application will be reviewed within 3-5 business days</li>
                            </ol>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <Button size="lg" className="w-full">
                                Proceed to Payment
                            </Button>
                            <Button variant="outline" size="lg" className="w-full" asChild>
                                <Link href="/">Return to Home</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
