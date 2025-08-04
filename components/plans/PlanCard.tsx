import { Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useSubscribeMutation } from "@/redux/api/user/userSubscriptionApi"
import { toast } from "sonner"
import { AxiosErrorHandler } from "@/lib/errorHandler"


export interface PlanCardProps{
    id:string,
    name:string,
    price:number,
    limits:{
        maxProjects:number,
        maxTeams:number,
        maxUsersPerTeam:number
    },
}

export default function PlanCard({
    id,
    name,
    price,
    limits,
}:PlanCardProps){

  const user = useSelector((state:RootState) => state.user)
  const [subscribe] = useSubscribeMutation()

  const handleSubscribe = async (id:string,userId:string) => {
    try {

      const res = await subscribe({planId:id,userId}).unwrap()
      console.log(res.data)
      window.location.href = res.data.checkoutUrl
    } catch (error) {
      console.log(error)
      toast.error(AxiosErrorHandler(error))
    }
  }

    return (
        <div className="">
          <Card key={id} className="bg-navy overflow-hidden border border-purpleDark">
            <CardHeader className="text-center">
              <div className="text-white top-2 right-2 absolute">
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
                </div>
              </div>
              <Button className="w-full"
              onClick={() => {
                handleSubscribe(id,user.id)
              }}
              variant={'light'}>Select</Button>
            </CardContent>
          </Card>
      </div>
    )
}