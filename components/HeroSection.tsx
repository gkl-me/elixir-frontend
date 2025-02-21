import { Button } from "./ui/button"
import CodeDesign from "./CodeDesign"

export default function HeroSection() {
    return (
        <div className="flex flex-col items-center mt-32  h-screen ">
            <h1 className="text-5xl font-bold">Automated Project Management</h1>
            <h4 className="mt-2 text-2xl font-thin w-1/2 flex items-center justify-center text-center ">Streamline your workflow, automate tasks, and boost team productivity with our intelligent project management platform.</h4>
            <div className="mt-4 gap-3 flex">
            <Button variant={'light'}>Get Started Free</Button>
            <Button variant={'secondary'}>Login Now</Button>
            </div>
            <div className="mt-5">
                <CodeDesign/>
            </div>
        </div>
    )
}