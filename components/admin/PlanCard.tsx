import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Check } from "lucide-react"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Switch } from "../ui/switch"
import { useUpdatePlanMutation } from "@/redux/api/admin/adminPlan"
import { toast } from "sonner"
import { PlanCardProps } from "@/types/IPlan"
import UpdatePlanForm from "./UpdatePlanForm"
import { useState } from "react"
import { AxiosErrorHandler } from "@/lib/errorHandler"


export default function PlanCard({
    id,
    name,
    price,
    limits,
    isActive
}:PlanCardProps){

  const [localStatus,setLocalStatus] = useState(isActive)
  const [updatePlan] = useUpdatePlanMutation()

  const handleToggle = async (id:string,data:{isActive:boolean}) => {
    setLocalStatus(p => !p)
    try {
      await updatePlan({data,id}).unwrap()
    } catch (error) {
      const err  = AxiosErrorHandler(error)
      toast.error(err)
      setLocalStatus(p => !p)
    }
  }

    return(
        
        <div className="">
          <Card key={id} className="bg-navy relative overflow-hidden border border-purpleDark">
            <CardHeader className="text-center">
              <div className="text-white top-2 right-2 absolute">
               <Switch className="data-[state=checked]:bg-purple data-[state=unchecked]:bg-blueDark"
                  checked={localStatus}
                  onCheckedChange={() => {
                    handleToggle(id,{isActive:!isActive})
                  }}
               />
              </div>
              <CardTitle className="text-white text-xl">{name}</CardTitle>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{price/100}$</span>
                <span className="text-gray-400 ml-1">/Monthly</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{limits.maxProjects?limits.maxProjects :'Unlimited'} Project Allowed</span>
                  </div>
              </div>
              <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{limits.maxTeams?limits.maxTeams :'Unlimited'} Teams Allowed</span>
                  </div>
              </div>
              <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{limits.maxUsersPerTeam?limits.maxUsersPerTeam :'Unlimited'} Users Allowed</span>
                  </div>
              </div>
              
              <div className="pt-4 border-t border-blueDark">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Subscribers</span>
                  <Badge variant="secondary" className="bg-blueDark text-white">
                    {"subscribers"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-400">Status</span>
                  <Badge className={`${localStatus?"bg-green-600":"bg-red-600"}`}>
                    {localStatus?'Active':'Inactive'}
                  </Badge>
                </div>
              </div>
              <UpdateCardModal 
                name={name}
                price={price}
                limits={limits}
                id={id}
              />
            </CardContent>
          </Card>
      </div>
    )
}


function UpdateCardModal({
  id,
  name,
  price,
  limits
}:Partial<PlanCardProps>){

  const [openModal,setOpenModal] = useState(false)

  return(
    <Dialog open={openModal} onOpenChange={setOpenModal}>
  <DialogTrigger asChild>
    <Button
      variant="outline"
      className="w-full border-purple text-purple hover:bg-purple hover:text-white"
    >
      Update Plan
    </Button>
  </DialogTrigger>

  <DialogContent
    className="bg-navy border border-purpleDark p-6 sm:max-w-xl w-full rounded-xl shadow-lg"
  >
    <DialogHeader className="mb-4">
      <DialogTitle className="text-white text-2xl font-semibold">
        Update Plan Info
      </DialogTitle>
    </DialogHeader>

    <div className="w-full space-y-6">
      <UpdatePlanForm
        id={id}
        name={name}
        price={price}
        limits={limits}
        onSuccess={() => setOpenModal(false)}
      />
    </div>
  </DialogContent>
</Dialog>

  )
}


