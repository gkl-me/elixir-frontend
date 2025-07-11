import { EditFormFields, PlanCardProps } from "@/types/IPlan"
import CustomForm from "../CustomForm"
import { EditPlanSchema, EditPlanType } from "@/validator/admin/PlanSchema"
import { useEditPlanMutation } from "@/redux/api/admin/adminPlan"
import { toast } from "sonner"


function EditPlanForm({
    id,
    name,
    price,
    limits,
    onSuccess
}:Partial<PlanCardProps> & {onSuccess:() => void}) {

    const [editPlan] = useEditPlanMutation()

    const handleUpdatePlan = async (data:EditPlanType) => {
        onSuccess()
        try {
            const res = await editPlan({data,id})
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error as string)
        }
    }

  return (
    <CustomForm
        buttonText="Edit Plan"
        defaultValues={{
            name:name,
            price:price ? price/100 : 0,
            limits:limits
        }}
        fields={EditFormFields}
        isLoading={false}
        schema={EditPlanSchema}
        onSubmit={handleUpdatePlan}
    />
  )
}

export default EditPlanForm