
export type PlanType = 'Free' | 'Pro' | 'Enterprice'
export type PaymentStatus = "pending" | "completed"

export interface OnboardingState {
  currentStep: number // 1: Plan, 2: Details, 3: Payment
  isCompleted: boolean
  paymentStatus?: PaymentStatus
  data:OnboardingData
}

export interface OnboardingData{
    planName:PlanType,
    workspaceName?:string,
    companyName?:string,
    companySize?:string,
    role?:string,
    paymentMethod?:string
}