"use client"

import { z } from "zod"
import { CustomForm } from "@/components/form/CustomForm"
import { toast } from "sonner"
import { Switch } from "../ui/switch"

const updatePlanSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  projects: z.coerce.number(),
  teams: z.coerce.number(),
  members: z.coerce.number(),
  customRoles: z.coerce.number(),
  storageBytes: z.coerce.number(),
  githubAutomation: z.boolean().default(false),
  automationScripts: z.boolean().default(false),
})

interface UpdatePlanFormProps {
  id: string
  name: string
  price: number
  limits: {
    projects: number
    teams: number
    members: number
    customRoles: number
    storageBytes: number
  }
  features: {
    githubAutomation: boolean
    automationScripts: boolean
  }
  onSuccess: () => void
}

export default function UpdatePlanForm({ id, name, price, limits, features, onSuccess }: UpdatePlanFormProps) {
  const handleSubmit = (values: z.infer<typeof updatePlanSchema>) => {
    // Simulate API call
    console.log("Updating plan", id, values)
    toast.success("Plan updated successfully")
    onSuccess()
  }

  const isFreePlan = name.toLowerCase() === "free"

  return (
    <CustomForm
      schema={updatePlanSchema}
      defaultValues={{
        name,
        price,
        projects: limits.projects,
        teams: limits.teams,
        members: limits.members,
        customRoles: limits.customRoles,
        storageBytes: limits.storageBytes,
        githubAutomation: features.githubAutomation,
        automationScripts: features.automationScripts,
      }}
      onSubmit={handleSubmit}
      submitText="Save Changes"
      fields={[
        {
          name: "name",
          label: "Plan Name",
          placeholder: "Enter Plan Name",
          disabled:true
        },
        {
          name: "price",
          label: "Price (Monthly)",
          type: "number",
          placeholder: "0",
          disabled:isFreePlan
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
          label: "Max Projects (-1 for unlimited)",
          type: "number",
          placeholder: "5",
        },
        {
            name: "teams",
            label: "Max Teams (-1 for unlimited)",
            type: "number",
            placeholder: "2",
        },
        {
            name: "members",
            label: "Max Members (-1 for unlimited)",
            type: "number",
            placeholder: "5",
        },
        {
            name: "customRoles",
            label: "Max Custom Roles",
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
