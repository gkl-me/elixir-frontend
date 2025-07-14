import { UpdateFormFields, PlanCardProps } from "@/types/IPlan"
import CustomForm from "../CustomForm"
import { UpdatePlanSchema, UpdatePlanType } from "@/validator/admin/PlanSchema"
import {  useUpdatePlanMutation } from "@/redux/api/admin/adminPlan"
import { toast } from "sonner"


function UpdatePlanForm({
    id,
    name,
    price,
    limits,
    onSuccess
}:Partial<PlanCardProps> & {onSuccess:() => void}) {

    const [updatePlan] = useUpdatePlanMutation()

    const handleUpdatePlan = async (data:UpdatePlanType) => {
        onSuccess()
        try {
            const res = await updatePlan({data,id})
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error as string)
        }
    }

  return (
    <CustomForm
        buttonText="Update Plan"
        defaultValues={{
            name:name,
            price:price ? price/100 : 0,
            limits:limits
        }}
        fields={UpdateFormFields}
        isLoading={false}
        schema={UpdatePlanSchema}
        onSubmit={handleUpdatePlan}
    />
  )
}

export default UpdatePlanForm