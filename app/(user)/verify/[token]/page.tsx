import VerifyForm from "@/components/auth/VerifyForm"

interface VerifyPageProps{
    params:{
        token:string
    }
}

export default function VerifyPage({params}:VerifyPageProps){

    const {token} = params

    return(
        <div className="fixed w-full min-h-screen bg-[radial-gradient(circle_at_50%_1%,_#4B2070_0%,_#040A1D_100%)]">
            <VerifyForm token={token} />
        </div>
    )
}