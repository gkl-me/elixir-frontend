"use client"

import { z } from "zod"
import { CustomForm } from "@/components/form/CustomForm"
import { ArrowLeft } from "lucide-react"
import { OnboardingData } from "@/types/IOnboardingTypes"

interface Step2DetailsProps {
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  data: OnboardingData
}

// Schemas
const WorkspaceSchema = z.object({
  workspaceName: z.string().min(2, "Workspace name must be at least 2 characters"),
})

const EnterpriseSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companySize: z.string().min(1, "Please select company size"),
  role: z.string().min(2, "Please enter your role"),
})

export default function Step2Details({ onNext, onBack, data }: Step2DetailsProps) {
  const isEnterprise = data.planName === 'Enterprice'

  const handleSubmit = (values : z.infer<typeof WorkspaceSchema> | z.infer<typeof EnterpriseSchema>) => {
    onNext(values)
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">
          {isEnterprise ? "Tell us about your company" : "Set up your workspace"}
        </h2>
        <p className="text-gray-400">
           {isEnterprise 
             ? "We need a few details to tailor the experience for your organization." 
             : "Give your workspace a name to get started."}
        </p>
      </div>

      <div className="bg-navy border border-white/10 rounded-xl p-8 shadow-lg">
        {isEnterprise ? (
          <CustomForm
            schema={EnterpriseSchema}
            defaultValues={{
              companyName: data.companyName || "",
              companySize: data.companySize || "",
              role: data.role || "",
            }}
            onSubmit={handleSubmit}
            submitText="Continue to Payment"
            fields={[
              { name: "companyName", label: "Company Name", placeholder: "Acme Corp" },
              { name: "companySize", label: "Company Size", placeholder: "e.g. 1-10, 11-50, 50+" },
              { name: "role", label: "Your Role", placeholder: "e.g. CTO, Manager" },
            ]}
          />
        ) : (
          <CustomForm
            schema={WorkspaceSchema}
            defaultValues={{
              workspaceName: data.workspaceName || "",
            }}
            onSubmit={handleSubmit}
            submitText="Continue"
            fields={[
              { name: "workspaceName", label: "Workspace Name", placeholder: "My Awesome Workspace" },
            ]}
          />
        )}
      </div>
      
      <div className="flex justify-center">
         <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Plans
         </button>
      </div>
    </div>
  )
}
