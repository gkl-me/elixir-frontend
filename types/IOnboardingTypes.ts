

export type PlanType = 'Free' |'Pro'|'Enterprice'

export interface IOnboardingState{


    currentStep:number,
    isCompleted:boolean,

    paymentStatus:'idle'|'completed'|'failed'|'processing',

    planType:PlanType,
    planId:string,
    planPrice:number,

    workspaceName?:string,

    company?:{
        name:string,
        type:string,
        email:string,
        phone:string,
        size:number
    } 
}