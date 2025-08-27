import UserLoginForm from "@/components/auth/LoginForm";


export default function Login(){
    return (
        <div className="fixed w-full min-h-screen bg-[radial-gradient(circle_at_50%_1%,_#4B2070_0%,_#040A1D_100%)]">
            <UserLoginForm />
        </div>
    )
}