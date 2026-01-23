'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useCheckReservedName } from '@/hooks/ReservedNames'
import { ReservedName } from '@/types'

interface ReservedNameValidationDialogProps {
    currentName: string
    trigger?: React.ReactNode
}

export function ReservedNameValidationDialog({ currentName, trigger }: ReservedNameValidationDialogProps) {
    const [open, setOpen] = useState(false)
    const [results, setResults] = useState<ReservedName[] | null>(null)
    const { mutate: checkName, isPending: isLoading } = useCheckReservedName()

    const handleCheck = () => {
        checkName({ name: currentName }, {
            onSuccess: (data) => {
                setResults(data)
            }
        })
    }

    const onOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen) {
            setResults(null)
            // Auto-check when opening if desired, or let user click a button inside.
            // Let's auto-check for better UX or wait for manual trigger.
            // Plan says "Call useCheckReservedName on mount or button click"
            // Let's do it on mount of content (effect) or just call it immediately
            handleCheck()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm">Validate</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reserved Name Validation</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-500">Checking Name:</label>
                        <p className="text-lg font-semibold">{currentName}</p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2 text-sm text-gray-500">Checking registry...</span>
                        </div>
                    ) : results ? (
                        <div className="space-y-4">
                            {results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                                    <h3 className="text-lg font-medium text-green-700">Name Available</h3>
                                    <p className="text-sm text-gray-500">No conflicts found with reserved names.</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center mb-2 text-amber-600">
                                        <AlertCircle className="h-5 w-5 mr-2" />
                                        <h3 className="font-medium">Potential Conflicts Found</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">
                                        The following names are similar to <strong>{currentName}</strong>:
                                    </p>
                                    <div className="bg-gray-50 rounded-md border border-gray-200 p-3 max-h-[200px] overflow-y-auto">
                                        <ul className="space-y-2">
                                            {results.map((item) => (
                                                <li key={item.id} className="text-sm text-gray-700 border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                                                    {item.reserved_name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
                <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
