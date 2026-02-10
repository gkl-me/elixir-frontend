"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomModal } from "../modal/CustomModal"
import UpdatePlanForm from "./UpdatePlanForm"

interface UpdateCardModalProps {
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
}

export default function UpdateCardModal({ id, name, price, limits, features }: UpdateCardModalProps) {
    const [isOpen, setIsOpen] = useState(false) // State to manage modal visibility

    return (
        <>
            <Button
                variant="dark"
                className="w-full"
                onClick={() => setIsOpen(true)}
            >
                Update Plan
            </Button>

            <CustomModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={`Update ${name} Plan`}
                description="Modify the plan details below. Changes will be reflected immediately."
            >
                <div className="mt-4 max-h-[80vh] overflow-y-auto pr-2">
                    <UpdatePlanForm 
                        id={id}
                        name={name}
                        price={price}
                        limits={limits} 
                        features={features}
                        onSuccess={() => setIsOpen(false)}
                    />
                </div>
            </CustomModal>
        </>
    )
}
