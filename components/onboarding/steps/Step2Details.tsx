"use client"

import { z } from "zod"
import { CustomForm } from "@/components/form/CustomForm"
import { ArrowLeft } from "lucide-react"
import { IOnboardingState } from "@/types/IOnboardingTypes"

interface Step2DetailsProps {
  onNext: (data: Partial<IOnboardingState>) => void
  onBack: () => void
  data: IOnboardingState
}

// Schemas
const WorkspaceSchema = z.object({
  workspaceName: z.string().min(2, "Workspace name must be at least 2 characters"),
})

const EnterpriseSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  type: z.string().min(1, "Please select company size"),
  size: z.string().min(2, "Please enter your role"),
  email: z.string(),
  phone: z.string(),
  workspaceName: z.string()
})

export default function Step2Details({ onNext, onBack, data }: Step2DetailsProps) {
  const isEnterprise = data.planType === 'Enterprice'

  const handleSubmit = (values : z.infer<typeof WorkspaceSchema> | z.infer<typeof EnterpriseSchema>) => {
    if(isEnterprise){
      const enterpriseValues = values as z.infer<typeof EnterpriseSchema>

      onNext({
        company:{
          name:enterpriseValues.name,
          email:enterpriseValues.email,
          type:enterpriseValues.type,
          phone:enterpriseValues.phone,
          size:enterpriseValues.size
        },
        workspaceName:enterpriseValues.workspaceName
      })
    }else{
      onNext({
        workspaceName:values.workspaceName
      })
    }
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
              name: data.company.name || "",
              size: data.company.size || "",
              type: data.company.type || "",
              email: data.company.email || "",
              phone: data.company.phone || "",
              workspaceName:data.workspaceName || "",

            }}
            onSubmit={handleSubmit}
            submitText="Continue to Payment"
            fields={[
              {
                name:"name",
                label:"Company Name",
                type:"text"
              },{
                name:"email",
                label:"Company Email",
                type:"text"
              },{
                name:"size",
                label:"Company Size",
                type:"text"
              },{
                name:"phone",
                label:"Company Phone",
                type:"text",
              },{
                name:"type",
                label:"Company Type",
                type:"text"
              },{
                name:"workspaceName",
                label:"Workspace Name",
                type:"text"
              }
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
