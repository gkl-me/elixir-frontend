"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomModal } from "../modal/CustomModal"
import CreatePlanForm from "./CreatePlanForm"

export default function CreateCardModal() {
    const [isOpen, setIsOpen] = useState(false) // State to manage modal visibility

    return (
        <>
            <Button
                variant="dark"
                className="w-full"
                onClick={() => setIsOpen(true)}
            >
                Create Plan
            </Button>

            <CustomModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={`Create Plan`}
                description="Create the plan details below. Changes will be reflected immediately."
            >
                <div className="mt-4 max-h-[80vh] overflow-y-auto pr-2">
                    <CreatePlanForm 
                        onSuccess={() => setIsOpen(false)}
                    />
                </div>
            </CustomModal>
        </>
    )
}
