import StripeProvider from "@/app/providers/StripeProvider";
import PlanForm from "@/components/plans/PlanForm";

export default function Onboarding(){
    return (
        <div>
            <StripeProvider>
            <PlanForm />
            </StripeProvider>
        </div>
    )
}