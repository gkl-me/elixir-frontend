"use client"

import { z } from "zod"
import { CustomForm } from "@/components/form/CustomForm"
import { Switch } from "../ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState, useTransition } from "react"
import { createPlanAction } from "@/app/actions/plan.action"

const CreatePlanSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  type: z.enum(['Free','Pro','Enterprice']),
  projects: z.coerce.number(),
  teams: z.coerce.number(),
  members: z.coerce.number(),
  customRoles: z.coerce.number(),
  storageBytes: z.coerce.number(),
  githubAutomation: z.boolean().default(false),
  automationScripts: z.boolean().default(false),
})

interface CreatePlanFormProps {
  onSuccess: () => void
}

export default function CreatePlanForm({ onSuccess }: CreatePlanFormProps) {

  const [planType,setPlanType] = useState('Free')
  const [isPending,startTransition] = useTransition()

  const handleSubmit = async (values: z.infer<typeof CreatePlanSchema>) => {

    // console.log(values)
    //call  server action here create plan
    startTransition(async () => {
      await createPlanAction({
        name:values.name,
        type:values.type,
        limits:{
          projects:values.projects,
          teams:values.teams,
          members:values.members,
          customRoles:values.customRoles,
          storageBytes:values.storageBytes
        },
        features:{
          githubAutomation:values.githubAutomation,
          automationScripts:values.automationScripts
        }
      })
    })
    onSuccess()
  }

  const isFreePlan = planType.toLowerCase() === "free"

  return (
    <CustomForm
      schema={CreatePlanSchema}
      defaultValues={{
        name:"",
        type:"Free",
        price:0,
        projects: 0,
        teams: 0,
        members: 0,
        customRoles: 0,
        storageBytes: 0,
        githubAutomation: false,
        automationScripts: false,
      }}
      onSubmit={handleSubmit}
      submitText={isPending?"Loading....": "Save Changes"}
      disabled={isPending}
      fields={[
        {
          name: "name",
          label: "Plan Name",
          placeholder: "Enter Plan Name",
        },
        {
          name: "price",
          label: "Price (Monthly)",
          type: "number",
          placeholder: "Enter the money",
          disabled:isFreePlan
        },
        {
          name: "type",
          label: "Plan Type",
          component: ({ value, onChange, disabled }) => (
            <div className="space-y-2">
              <Select
                value={value as string}
                onValueChange={(val) => {
                  onChange(val)
                  setPlanType(val) 
                }}
                disabled={disabled}
              >
                <SelectTrigger className="bg-white/5 border-purpleDark/50 text-white">
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>

                <SelectContent className="bg-navyDark  border-purpleDark/50 text-white">
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Enterprice">Enterprice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )
        },
        {
          name:'githubAutomation',
          label:"Github Automations",
          component: ({ value, onChange, disabled }) => (
                <div className="flex flex-row items-center justify-between rounded-lg border border-purpleDark/50 p-4 bg-white/5">
                    <div className="space-y-0.5">
                        <label className="text-base font-medium text-white">GitHub Automation</label>
                        <p className="text-sm text-gray-400">Enable GitHub integration features for this plan.</p>
                    </div>
                    <Switch
                         className="
                        data-[state=checked]:bg-green-500
                        data-[state=unchecked]:bg-gray-600
                      "
                        checked={value as boolean}
                        onCheckedChange={onChange}
                        disabled={disabled}
                    />
                </div>
            )
        },
        {
            name: "automationScripts",
            label: "Automation Scripts",
            component: ({ value, onChange, disabled }) => (
                <div className="flex flex-row items-center justify-between rounded-lg border border-purpleDark/50 p-4 bg-white/5">
                    <div className="space-y-0.5">
                        <label className="text-base font-medium text-white">Automation Scripts</label>
                        <p className="text-sm text-gray-400">Allow users to run custom automation scripts.</p>
                    </div>
                    <Switch
                    className="
                        data-[state=checked]:bg-green-500
                        data-[state=unchecked]:bg-gray-600
                      "
                        checked={value as boolean}
                        onCheckedChange={onChange}
                        disabled={disabled}
                    />
                </div>
            )
        },
        {
          name: "projects",
          label: "Limit on Projects",
          type: "number",
          placeholder: "5",
        },
        {
            name: "teams",
            label: "Limit on Teams",
            type: "number",
            placeholder: "2",
        },
        {
            name: "members",
            label: "Limit on Members",
            type: "number",
            placeholder: "5",
        },
        {
            name: "customRoles",
            label: "Limit on Custom Roles",
            type: "number",
            placeholder: "0",
        },
        {
            name: "storageBytes",
            label: "Storage (Bytes)",
            type: "number",
            placeholder: "104857600",
        },
      ]}
    />
  )
}
