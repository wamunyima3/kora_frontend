'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useServices } from '@/hooks/Services'
import { useFormsByService } from '@/hooks/Forms'
import { useCollections } from '@/hooks/Collections'
import { useCollectionItems } from '@/hooks/CollectionItems'
import { useCreateSubmission } from '@/hooks/Submissions'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'

interface SelectServiceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SelectServiceModal({ open, onOpenChange }: SelectServiceModalProps) {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [serviceId, setServiceId] = useState('')
    const [businessType, setBusinessType] = useState('')
    const [businessCategory, setBusinessCategory] = useState('')
    const [businessClass, setBusinessClass] = useState('')
    const [applicationType, setApplicationType] = useState('New Business')
    const [proposedName1, setProposedName1] = useState('')
    const [proposedName2, setProposedName2] = useState('')
    const [proposedName3, setProposedName3] = useState('')
    const [natures, setNatures] = useState<Array<{ level1: string; level2: string; level3: string; level4: string; isMain: boolean }>>([])
    const [showNatureDialog, setShowNatureDialog] = useState(false)
    const [currentNature, setCurrentNature] = useState({ level1: '', level2: '', level3: '', level4: '', isMain: false })
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [addressLine1, setAddressLine1] = useState('')
    const [addressLine2, setAddressLine2] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [email, setEmail] = useState('')

    const { data: services = [] } = useServices()
    const { data: forms = [] } = useFormsByService(serviceId ? Number(serviceId) : undefined)
    const { data: collections = [] } = useCollections()
    const { data: collectionItems = [] } = useCollectionItems()
    const createSubmission = useCreateSubmission()

    const selectedForm = forms[0]

    const businessTypeCollection = collections.find(c => c.collection_name === 'Business Type')
    const businessCategoryCollection = collections.find(c => c.collection_name === 'Business Category')
    const businessClassCollection = collections.find(c => c.collection_name === 'Business Class')
    const natureLevel1Collection = collections.find(c => c.collection_name === 'Nature Level 1')
    const natureLevel2Collection = collections.find(c => c.collection_name === 'Nature Level 2')
    const natureLevel3Collection = collections.find(c => c.collection_name === 'Nature Level 3')
    const natureLevel4Collection = collections.find(c => c.collection_name === 'Nature Level 4')

    const businessTypes = useMemo(() => 
        collectionItems.filter(item => item.collection_id === businessTypeCollection?.id),
        [collectionItems, businessTypeCollection]
    )

    const businessCategories = useMemo(() => {
        const selectedType = businessTypes.find(t => t.collection_item === businessType)
        return collectionItems.filter(item => 
            item.collection_id === businessCategoryCollection?.id && 
            item.relation_collection_items_id === selectedType?.id
        )
    }, [collectionItems, businessCategoryCollection, businessTypes, businessType])

    const businessClasses = useMemo(() => {
        const selectedType = businessTypes.find(t => t.collection_item === businessType)
        return collectionItems.filter(item => 
            item.collection_id === businessClassCollection?.id && 
            item.relation_collection_items_id === selectedType?.id
        )
    }, [collectionItems, businessClassCollection, businessTypes, businessType])

    const natureLevel1Items = useMemo(() => 
        collectionItems.filter(item => item.collection_id === natureLevel1Collection?.id),
        [collectionItems, natureLevel1Collection]
    )

    const natureLevel2Items = useMemo(() => {
        const selectedLevel1 = natureLevel1Items.find(t => t.collection_item === currentNature.level1)
        return collectionItems.filter(item => 
            item.collection_id === natureLevel2Collection?.id && 
            item.relation_collection_items_id === selectedLevel1?.id
        )
    }, [collectionItems, natureLevel2Collection, natureLevel1Items, currentNature.level1])

    const natureLevel3Items = useMemo(() => {
        const selectedLevel2 = natureLevel2Items.find(t => t.collection_item === currentNature.level2)
        return collectionItems.filter(item => 
            item.collection_id === natureLevel3Collection?.id && 
            item.relation_collection_items_id === selectedLevel2?.id
        )
    }, [collectionItems, natureLevel3Collection, natureLevel2Items, currentNature.level2])

    const natureLevel4Items = useMemo(() => {
        const selectedLevel3 = natureLevel3Items.find(t => t.collection_item === currentNature.level3)
        return collectionItems.filter(item => 
            item.collection_id === natureLevel4Collection?.id && 
            item.relation_collection_items_id === selectedLevel3?.id
        )
    }, [collectionItems, natureLevel4Collection, natureLevel3Items, currentNature.level3])

    const getAlert = () => {
        if (businessType === 'Foreign Company' && businessCategory) {
            return 'Please note that a certificate of incorporation and a letter of authorisation from the country of origin, indicating the company\'s intention to register the entity in Zambia, must be attached.'
        }
        if (businessType === 'Business Name' && businessCategory === 'By Corporation / Other') {
            return 'Please note that this type of application requires you to enlist a registered business as a partner.'
        }
        return null
    }

    const resetModal = () => {
        setStep(0)
        setServiceId('')
        setBusinessType('')
        setBusinessCategory('')
        setBusinessClass('')
        setProposedName1('')
        setProposedName2('')
        setProposedName3('')
        setNatures([])
        setFirstName('')
        setLastName('')
        setAddressLine1('')
        setAddressLine2('')
        setCity('')
        setCountry('')
        setState('')
        setZipCode('')
        setEmail('')
    }

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleNext = () => {
        if (step === 0) {
            if (!serviceId) {
                toast.error('Please select a service')
                return
            }
            if (!selectedForm) {
                toast.error('No form available for this service')
                return
            }
            setStep(1)
        } else if (step === 1) {
            if (!businessType) {
                toast.error('Business Type is required')
                return
            }
            if (!businessCategory) {
                toast.error('Business Category is required')
                return
            }
            if (businessType !== 'Business Name' && !businessClass) {
                toast.error('Business Class is required')
                return
            }
            if (!proposedName1.trim()) {
                toast.error('At least one Proposed Name is required')
                return
            }
            const names = [proposedName1, proposedName2, proposedName3].filter(n => n.trim())
            for (const name of names) {
                if (name.length < 3) {
                    toast.error('Proposed names must be at least 3 characters')
                    return
                }
                if (/^\d+$/.test(name)) {
                    toast.error('Proposed names cannot be numbers alone')
                    return
                }
                if (/^\d/.test(name)) {
                    toast.error('Proposed names cannot start with numbers')
                    return
                }
            }
            const uniqueNames = new Set(names.map(n => n.toLowerCase()))
            if (uniqueNames.size !== names.length) {
                toast.error('Proposed names must be unique')
                return
            }
            setStep(2)
        } else if (step === 2) {
            if (natures.length === 0) {
                toast.error('Please add at least one nature of business')
                return
            }
            setStep(3)
        } else if (step === 3) {
            if (!firstName.trim()) {
                toast.error('First Name is required')
                return
            }
            if (!lastName.trim()) {
                toast.error('Last Name is required')
                return
            }
            if (!addressLine1.trim()) {
                toast.error('Address Line 1 is required')
                return
            }
            if (!city.trim()) {
                toast.error('City is required')
                return
            }
            if (!country) {
                toast.error('Country is required')
                return
            }
            if (!email.trim()) {
                toast.error('Email is required')
                return
            }
            if (!validateEmail(email)) {
                toast.error('Please enter a valid email address')
                return
            }
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        try {
            await createSubmission.mutateAsync({
                services_id: Number(serviceId),
                form_id: selectedForm?.id,
                created_by: 1,
                formAnswers: [
                    { form_field_id: 1, answer: businessType },
                    { form_field_id: 2, answer: businessCategory },
                    { form_field_id: 3, answer: businessClass },
                    { form_field_id: 4, answer: proposedName1 },
                    { form_field_id: 5, answer: proposedName2 },
                    { form_field_id: 6, answer: proposedName3 },
                    { form_field_id: 7, answer: JSON.stringify(natures) },
                    { form_field_id: 8, answer: firstName },
                    { form_field_id: 9, answer: lastName },
                    { form_field_id: 10, answer: addressLine1 },
                    { form_field_id: 11, answer: addressLine2 },
                    { form_field_id: 12, answer: city },
                    { form_field_id: 13, answer: country },
                    { form_field_id: 14, answer: state },
                    { form_field_id: 15, answer: zipCode },
                    { form_field_id: 16, answer: email },
                ].filter(a => a.answer)
            })
            toast.success('Case created successfully!')
            setStep(4)
        } catch (error) {
            toast.error('Failed to create case. Please try again.')
        }
    }

    const handleBack = () => {
        if (step > 0) setStep(step - 1)
    }

    const addNature = () => {
        setNatures([...natures, currentNature])
        setCurrentNature({ level1: '', level2: '', level3: '', level4: '', isMain: false })
        setShowNatureDialog(false)
    }

    const editNature = (index: number) => {
        setCurrentNature(natures[index])
        setNatures(natures.filter((_, i) => i !== index))
        setShowNatureDialog(true)
    }

    const deleteNature = (index: number) => {
        setNatures(natures.filter((_, i) => i !== index))
    }

    return (
        <>
            <Dialog open={open && !showNatureDialog} onOpenChange={(o) => { onOpenChange(o); if (!o) resetModal() }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {step === 0 && 'Create Case'}
                            {step === 1 && 'Business Details'}
                            {step === 2 && 'Nature of Business'}
                            {step === 3 && 'Billing'}
                            {step === 4 && 'Success'}
                        </DialogTitle>
                        {step > 0 && step < 4 && <div className="text-sm text-gray-600">Step {step} of 3</div>}
                    </DialogHeader>

                    {step === 0 && (
                        <div className="space-y-6 py-4">
                            <div>
                                <Label>Select Service *</Label>
                                <Select value={serviceId} onValueChange={setServiceId}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Choose a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map(service => (
                                            <SelectItem key={service.id} value={String(service.id)}>
                                                {service.service_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {serviceId && selectedForm && (
                                    <p className="text-sm text-gray-600 mt-2">Form: {selectedForm.form_name}</p>
                                )}
                            </div>
                            <Button onClick={handleNext} disabled={!serviceId} className="w-full bg-[#8B6F47] hover:bg-[#6F5838]">
                                Next
                            </Button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Business Type *</Label>
                                    <Select value={businessType} onValueChange={(v) => { setBusinessType(v); setBusinessCategory(''); setBusinessClass('') }}>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {businessTypes.map(type => (
                                                <SelectItem key={type.id} value={type.collection_item || ''}>
                                                    {type.collection_item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Business Category *</Label>
                                    <Select value={businessCategory} onValueChange={setBusinessCategory} disabled={!businessType}>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {businessCategories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.collection_item || ''}>
                                                    {cat.collection_item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {businessType !== 'Business Name' && (
                                    <div>
                                        <Label>Business Class *</Label>
                                        <Select value={businessClass} onValueChange={setBusinessClass} disabled={!businessType}>
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {businessClasses.map(cls => (
                                                    <SelectItem key={cls.id} value={cls.collection_item || ''}>
                                                        {cls.collection_item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <RadioGroup value={applicationType} onValueChange={setApplicationType} className="flex gap-6">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="New Business" id="new" />
                                    <Label htmlFor="new">New Business</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Change of Name" id="change" disabled />
                                    <Label htmlFor="change" className="opacity-50">Change of Name</Label>
                                </div>
                            </RadioGroup>

                            {getAlert() && (
                                <div className="flex gap-2 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <span>{getAlert()}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <Label>Proposed Name 1 *</Label>
                                    <Input value={proposedName1} onChange={(e) => setProposedName1(e.target.value)} className="mt-2" />
                                </div>
                                <div>
                                    <Label>Proposed Name 2</Label>
                                    <Input value={proposedName2} onChange={(e) => setProposedName2(e.target.value)} className="mt-2" />
                                </div>
                                <div>
                                    <Label>Proposed Name 3</Label>
                                    <Input value={proposedName3} onChange={(e) => setProposedName3(e.target.value)} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handleNext} className="bg-[#8B6F47] hover:bg-[#6F5838]" disabled={createSubmission.isPending}>Next</Button>
                                <Button variant="ghost" onClick={handleBack} disabled={createSubmission.isPending}>Back</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 py-4">
                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-3 gap-4 p-4 font-semibold bg-gray-50 dark:bg-stone-800">
                                    <div>Nature</div>
                                    <div>Main</div>
                                    <div>Actions</div>
                                </div>
                                {natures.map((nature, i) => (
                                    <div key={i} className="grid grid-cols-3 gap-4 p-4 border-t">
                                        <div>{nature.level1}</div>
                                        <div>{nature.isMain ? 'Yes' : 'No'}</div>
                                        <div className="flex gap-2">
                                            <button onClick={() => editNature(i)} className="p-1 hover:bg-gray-100 dark:hover:bg-stone-800 rounded">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => deleteNature(i)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={() => setShowNatureDialog(true)} variant="outline">Add Nature of Business</Button>
                            <div className="flex gap-4">
                                <Button onClick={handleNext} className="bg-[#8B6F47] hover:bg-[#6F5838]" disabled={createSubmission.isPending}>Next</Button>
                                <Button variant="ghost" onClick={handleBack} disabled={createSubmission.isPending}>Back</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>First Name *</Label>
                                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label>Last Name *</Label>
                                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <Label>Address Line 1 *</Label>
                                    <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="mt-1" />
                                </div>
                                <div>
                                    <Label>Address Line 2</Label>
                                    <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="mt-1" />
                                </div>
                                <div>
                                    <Label>City *</Label>
                                    <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Country/Region *</Label>
                                        <Select value={country} onValueChange={setCountry}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ZM">Zambia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>State/Province</Label>
                                        <Input value={state} onChange={(e) => setState(e.target.value)} className="mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <Label>Zip/Postal Code</Label>
                                    <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="mt-1" />
                                </div>
                                <div>
                                    <Label>Email *</Label>
                                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
                                </div>
                            </div>
                            <div className="bg-[#D4AF7A] p-4 rounded">
                                <div className="font-semibold mb-2">Total amount</div>
                                <div className="text-2xl font-bold">112.59 ZK</div>
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={handleNext} className="bg-[#8B6F47] hover:bg-[#6F5838]" disabled={createSubmission.isPending}>
                                    {createSubmission.isPending ? 'Creating...' : 'Proceed to Pay'}
                                </Button>
                                <Button variant="ghost" onClick={handleBack} disabled={createSubmission.isPending}>Back</Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="py-4">
                            <div className="text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-semibold">Case Created Successfully!</h2>
                                <p className="text-gray-600">Your form has been submitted successfully.</p>
                                <p className="text-sm text-gray-600">Case ID: <span className="font-mono font-semibold">CASE-{Date.now()}</span></p>
                                <Button className="w-full bg-[#8B6F47] hover:bg-[#6F5838]" onClick={() => { onOpenChange(false); resetModal() }}>Close</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showNatureDialog} onOpenChange={setShowNatureDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Nature of Business</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Level 1</Label>
                            <Select value={currentNature.level1} onValueChange={(v) => setCurrentNature({ ...currentNature, level1: v, level2: '', level3: '', level4: '' })}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {natureLevel1Items.map(item => (
                                        <SelectItem key={item.id} value={item.collection_item || ''}>
                                            {item.collection_item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Level 2</Label>
                            <Select value={currentNature.level2} onValueChange={(v) => setCurrentNature({ ...currentNature, level2: v, level3: '', level4: '' })} disabled={!currentNature.level1}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {natureLevel2Items.map(item => (
                                        <SelectItem key={item.id} value={item.collection_item || ''}>
                                            {item.collection_item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Level 3</Label>
                            <Select value={currentNature.level3} onValueChange={(v) => setCurrentNature({ ...currentNature, level3: v, level4: '' })} disabled={!currentNature.level2}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {natureLevel3Items.map(item => (
                                        <SelectItem key={item.id} value={item.collection_item || ''}>
                                            {item.collection_item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Level 4</Label>
                            <Select value={currentNature.level4} onValueChange={(v) => setCurrentNature({ ...currentNature, level4: v })} disabled={!currentNature.level3}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {natureLevel4Items.map(item => (
                                        <SelectItem key={item.id} value={item.collection_item || ''}>
                                            {item.collection_item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch checked={currentNature.isMain} onCheckedChange={(v) => setCurrentNature({ ...currentNature, isMain: v })} />
                            <Label>Use this as main nature of business</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowNatureDialog(false)}>Close</Button>
                        <Button onClick={addNature} className="bg-[#8B6F47] hover:bg-[#6F5838]">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
