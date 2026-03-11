"use client"

import { togglePlanStatus } from "@/app/actions/plan.action"
import { Switch } from "../ui/switch"
import { useState } from "react"
import { toastHandler } from "@/lib/toastHandler"

export function TogglePlanStatus({ id,isActive }: { id: string,isActive:boolean }) {

  const [status,setStatus] = useState(isActive)

  const handleToggle = async () => {
    setStatus(!isActive)
    const res = await togglePlanStatus(id)
    toastHandler(res)
  }

  return (
    <Switch
        checked={status}
      onCheckedChange={handleToggle}
      className="
        data-[state=checked]:bg-green-500
        data-[state=unchecked]:bg-gray-600
      "
    />
  )
}
