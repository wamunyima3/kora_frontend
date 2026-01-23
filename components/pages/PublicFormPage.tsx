"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@/hooks/Forms";
import { useService } from "@/hooks/Services";
import { useCollections } from "@/hooks/Collections";
import { useCollectionItems } from "@/hooks/CollectionItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface PublicFormPageProps {
  formId: string;
  serviceId?: string;
}

export default function PublicFormPage({ formId, serviceId }: PublicFormPageProps) {
  const router = useRouter();
  const { data: form } = useForm(Number(formId));
  const { data: service } = useService(serviceId ? Number(serviceId) : undefined);
  const { data: collections = [] } = useCollections();
  const { data: collectionItems = [] } = useCollectionItems();
  
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessClass, setBusinessClass] = useState("");
  const [applicationType, setApplicationType] = useState("New Business");
  const [proposedName1, setProposedName1] = useState("");
  const [proposedName2, setProposedName2] = useState("");
  const [proposedName3, setProposedName3] = useState("");
  const [natures, setNatures] = useState<
    Array<{
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      isMain: boolean;
    }>
  >([]);
  const [showNatureDialog, setShowNatureDialog] = useState(false);
  const [currentNature, setCurrentNature] = useState({
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    isMain: false,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");

  // Get collection IDs
  const businessTypeCollection = collections.find(c => c.collection_name === 'Business Type');
  const businessCategoryCollection = collections.find(c => c.collection_name === 'Business Category');
  const businessClassCollection = collections.find(c => c.collection_name === 'Business Class');

  // Get business types
  const businessTypes = useMemo(() => 
    collectionItems.filter(item => item.collection_id === businessTypeCollection?.id),
    [collectionItems, businessTypeCollection]
  );

  // Get business categories based on selected type
  const businessCategories = useMemo(() => {
    const selectedType = businessTypes.find(t => t.collection_item === businessType);
    return collectionItems.filter(item => 
      item.collection_id === businessCategoryCollection?.id && 
      item.relation_collection_items_id === selectedType?.id
    );
  }, [collectionItems, businessCategoryCollection, businessTypes, businessType]);

  // Get business classes based on selected type
  const businessClasses = useMemo(() => {
    const selectedType = businessTypes.find(t => t.collection_item === businessType);
    return collectionItems.filter(item => 
      item.collection_id === businessClassCollection?.id && 
      item.relation_collection_items_id === selectedType?.id
    );
  }, [collectionItems, businessClassCollection, businessTypes, businessType]);

  const getAlert = () => {
    if (businessType === "Foreign Company" && businessCategory) {
      return "Please note that a certificate of incorporation and a letter of authorisation from the country of origin, indicating the company's intention to register the entity in Zambia, must be attached.";
    }
    if (
      businessType === "Business Name" &&
      businessCategory === "By Corporation / Other"
    ) {
      return "Please note that this type of application requires you to enlist a registered business as a partner.";
    }
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!businessType || !businessCategory || !proposedName1) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Validate proposed names
      const names = [proposedName1, proposedName2, proposedName3].filter(n => n.trim());
      
      // Check for numbers only or starting with numbers
      for (const name of names) {
        if (/^\d+$/.test(name)) {
          toast.error("Proposed names cannot be numbers alone");
          return;
        }
        if (/^\d/.test(name)) {
          toast.error("Proposed names cannot start with numbers");
          return;
        }
      }
      
      // Check for duplicates
      const uniqueNames = new Set(names.map(n => n.toLowerCase()));
      if (uniqueNames.size !== names.length) {
        toast.error("Proposed names must be unique");
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setStep(4);
  };

  const addNature = () => {
    setNatures([...natures, currentNature]);
    setCurrentNature({
      level1: "",
      level2: "",
      level3: "",
      level4: "",
      isMain: false,
    });
    setShowNatureDialog(false);
  };

  const editNature = (index: number) => {
    setCurrentNature(natures[index]);
    setNatures(natures.filter((_, i) => i !== index));
    setShowNatureDialog(true);
  };

  const deleteNature = (index: number) => {
    setNatures(natures.filter((_, i) => i !== index));
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-sm text-gray-600">
          Step {step > 3 ? 3 : step} of 3
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-semibold mb-8">
              {service?.service_name || 'Service'} - Business Details
            </h1>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <Label>Business Type</Label>
                <Select
                  value={businessType}
                  onValueChange={(v) => {
                    setBusinessType(v);
                    setBusinessCategory("");
                    setBusinessClass("");
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.id} value={type.collection_item || ''}>
                        {type.collection_item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Business Category</Label>
                <Select
                  value={businessCategory}
                  onValueChange={setBusinessCategory}
                  disabled={!businessType}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.collection_item || ''}>
                        {cat.collection_item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {businessType !== "Business Name" && (
                <div>
                  <Label>Business Class</Label>
                  <Select
                    value={businessClass}
                    onValueChange={setBusinessClass}
                    disabled={!businessType}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.collection_item || ''}>
                          {cls.collection_item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <RadioGroup
              value={applicationType}
              onValueChange={setApplicationType}
              className="flex gap-6 mb-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="New Business" id="new" />
                <Label htmlFor="new">New Business</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Change of Name" id="change" disabled />
                <Label htmlFor="change" className="opacity-50">
                  Change of Name
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="After Cessation"
                  id="cessation"
                  disabled
                />
                <Label htmlFor="cessation" className="opacity-50">
                  After Cessation
                </Label>
              </div>
            </RadioGroup>

            {getAlert() && (
              <div className="flex gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{getAlert()}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <Label>Proposed Name 1</Label>
                <Input
                  value={proposedName1}
                  onChange={(e) => setProposedName1(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Proposed Name 2</Label>
                <Input
                  value={proposedName2}
                  onChange={(e) => setProposedName2(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Proposed Name 3</Label>
                <Input
                  value={proposedName3}
                  onChange={(e) => setProposedName3(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="mb-8">
              <Label>Upload supporting documentation if any</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-white dark:bg-stone-900">
                <Button variant="outline" type="button" className="bg-white dark:bg-stone-800 dark:text-white">
                  CHOOSE FILES
                </Button>
                <span className="ml-2 text-gray-600 dark:text-stone-300">
                  or drag and drop pdf files here
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleNext}
                className="bg-[#8B6F47] hover:bg-[#6F5838]"
              >
                Next
              </Button>
              <Button variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-3xl font-semibold mb-8">
              {service?.service_name || 'Service'} - Nature of Business
            </h1>

            <div className="mb-6 bg-white dark:bg-stone-900 rounded-lg border border-gray-200 dark:border-stone-700 overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 font-semibold bg-gray-50 dark:bg-stone-800 border-b border-gray-200 dark:border-stone-700">
                <div>Nature</div>
                <div>Main</div>
                <div>Actions</div>
              </div>
              {natures.map((nature, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 dark:border-stone-700 last:border-b-0">
                  <div>{nature.level1}</div>
                  <div>{nature.isMain ? "Yes" : "No"}</div>
                  <div className="flex gap-2">
                    <button onClick={() => editNature(i)} className="p-1 hover:bg-gray-100 dark:hover:bg-stone-800 rounded" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => deleteNature(i)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setShowNatureDialog(true)}
              variant="outline"
              className="mb-8"
            >
              Add Nature of Business
            </Button>

            <div className="flex gap-4">
              <Button
                onClick={handleNext}
                className="bg-[#8B6F47] hover:bg-[#6F5838]"
              >
                Next
              </Button>
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-3xl font-semibold mb-8">
              {service?.service_name || 'Service'} - Billing
            </h1>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Billing Information
                  </h2>
                  <div className="text-sm text-right mb-4">
                    * Required field
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Name *</Label>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Last Name *</Label>
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Address Line 1 *</Label>
                      <Input
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Address Line 2</Label>
                      <Input
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>City *</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 w-1/2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Country/Region *</Label>
                        <Select value={country} onValueChange={setCountry}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ZM">Zambia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>State/Province</Label>
                        <Input
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Zip/Postal Code</Label>
                      <Input
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="mt-1 w-1/2"
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Payment Details
                  </h2>
                  <div className="text-sm text-gray-600 mb-4">
                    With this payment option, you will be redirected to a secure
                    site to enter your bank card details. Once the payment has
                    been made, you will return to this portal to complete your
                    application.
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#8B6F47] hover:bg-[#6F5838]"
                  >
                    Proceed to Pay
                  </Button>
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                </div>
              </div>

              <div>
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Order</h2>
                  <div className="bg-[#D4AF7A] p-4 rounded">
                    <div className="font-semibold mb-2">Total amount</div>
                    <div className="text-2xl font-bold">112.59 ZK</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-2xl mx-auto">
            <div className="border rounded-lg p-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold">
                  Case Created Successfully!
                </h2>
                <p className="text-gray-600">
                  Your form has been submitted successfully.
                </p>
                <p className="text-sm text-gray-600">
                  Case ID:{" "}
                  <span className="font-mono font-semibold">
                    CASE-{Date.now()}
                  </span>
                </p>

                <div className="border-t pt-6 text-left">
                  <h3 className="font-semibold mb-4">Next Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Proceed to payment to complete your application</li>
                    <li>
                      You will receive a confirmation email once payment is
                      processed
                    </li>
                    <li>
                      Your application will be reviewed within 3-5 business days
                    </li>
                  </ol>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  {/* <Button className="w-full bg-[#8B6F47] hover:bg-[#6F5838]">Proceed to Payment</Button> */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard")}
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={showNatureDialog} onOpenChange={setShowNatureDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Nature of Business</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Level 1</Label>
                <Select
                  value={currentNature.level1}
                  onValueChange={(v) =>
                    setCurrentNature({ ...currentNature, level1: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level 2</Label>
                <Select
                  value={currentNature.level2}
                  onValueChange={(v) =>
                    setCurrentNature({ ...currentNature, level2: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Option1">Option 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level 3</Label>
                <Select
                  value={currentNature.level3}
                  onValueChange={(v) =>
                    setCurrentNature({ ...currentNature, level3: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Option1">Option 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level 4</Label>
                <Select
                  value={currentNature.level4}
                  onValueChange={(v) =>
                    setCurrentNature({ ...currentNature, level4: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Option1">Option 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={currentNature.isMain}
                  onCheckedChange={(v) =>
                    setCurrentNature({ ...currentNature, isMain: v })
                  }
                />
                <Label>Use this as main nature of business</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowNatureDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={addNature}
                className="bg-[#8B6F47] hover:bg-[#6F5838]"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
