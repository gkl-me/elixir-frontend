import { Button } from "./ui/button"
import CodeDesign from "./CodeDesign"

export default function HeroSection() {
    return (
        <div className="flex flex-col items-center mt-16 text-center md:mt-32  h-screen ">
            <h1 className="md:text-5xl text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-black/0 bg-clip-text text-transparent">Automated Project Management</h1>
            <h4 className="mt-2 text-md w-full md:text-2xl font-thin md:w-1/2 flex items-center justify-center text-center ">Streamline your workflow, automate tasks, and boost team productivity with our intelligent project management platform.</h4>
            <div className="mt-4 gap-3 flex">
            <Button variant={'light'}>Get Started</Button>
            <Button variant={'secondary'}>Login </Button>
            </div>
            <div className="mt-5">
                <CodeDesign/>
            </div>
        </div>
    )
}