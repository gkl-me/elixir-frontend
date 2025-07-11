import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Check } from "lucide-react"
import { Badge } from "../ui/badge"

export enum PlanType  {
    'Free'="Free",
    'Pro'='Pro',
    'Enterprice'='Enterprise'
}

export interface PlanCardProps{
    id?:string
    name:PlanType,
    price:number,
    limits:{
        maxProjects:number,
        maxTeams:number
        maxUsersPerTeam:number
    },
    stripePriceId?:string,
    stripeProductId?:string,
    isActive:boolean,
}


export default function PlanCard({
    id,
    name,
    price,
    limits,
    isActive
}:PlanCardProps){


    return(
        
        <div className="">
          <Card key={id} className="bg-navy border-blueDark relative overflow-hidden">
            <CardHeader className="text-center">
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
                  <Badge className="bg-green-600">
                    {isActive?'Active':'Inactive'}
                  </Badge>
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-purple text-purple hover:bg-purple hover:text-white">
                Edit Plan
              </Button>
            </CardContent>
          </Card>
      </div>
    )
}


