"use client"

import { z } from "zod"
import { CustomForm } from "@/components/form/CustomForm"
import { ArrowLeft } from "lucide-react"
import { IOnboardingState } from "@/types/IOnboardingTypes"
import { WorkspaceSchema } from "@/validator/WorkspaceSchema"
import { CompanySchema } from "@/validator/CompanySchema"

interface Step2DetailsProps {
  onNext: (data: Partial<IOnboardingState>) => void
  onBack: () => void
  data: IOnboardingState
}

export default function Step2Details({ onNext, onBack, data }: Step2DetailsProps) {
  const isEnterprice = data.planType === 'Enterprice'

  const handleSubmit = (values : z.infer<typeof WorkspaceSchema> | z.infer<typeof CompanySchema>) => {
    if(isEnterprice){
      const enterpriceValues = values as z.infer<typeof CompanySchema>

      onNext({
        company:{
         name:enterpriceValues.name,
          email:enterpriceValues.email,
          type:enterpriceValues.type,
          phone:enterpriceValues.phone,
          size:enterpriceValues.size
        },
        workspaceName:enterpriceValues.workspaceName
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
          {isEnterprice ? "Tell us about your company" : "Set up your workspace"}
        </h2>
        <p className="text-gray-400">
           {isEnterprice 
             ? "We need a few details to tailor the experience for your organization." 
             : "Give your workspace a name to get started."}
        </p>
      </div>

      <div className="bg-navy border border-white/10 rounded-xl p-8 shadow-lg">
        {isEnterprice ? (
          <CustomForm
            schema={CompanySchema}
            defaultValues={{
              name: data.company.name || "",
              size: data.company.size || 0,
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
