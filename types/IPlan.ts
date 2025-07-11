import { CustomFormProps } from "@/components/CustomForm"
import { EditPlanSchema } from "@/validator/admin/PlanSchema"


export enum PlanType  {
    'Free'="Free",
    'Pro'='Pro',
    'Enterprice'='Enterprice'
}

export interface PlanCardProps{
    id:string
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


export const EditFormFields:CustomFormProps<typeof EditPlanSchema>['fields'] =[
    {
        name:'name',
        label:'Name',
        placeholder:'Enter Plan Name',
        disabled:true
    },{
        name:'price',
        label:'Price',
        placeholder:'Enter Price',
    },
    {
    name: 'limits.maxProjects',
    label: 'Max Projects',
  },
  {
    name: 'limits.maxTeams',
    label: 'Max Teams',
  },
  {
    name: 'limits.maxUsersPerTeam',
    label: 'Max Users Per Team',
  },
]


