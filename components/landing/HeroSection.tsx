import { Button } from "../ui/button";
import CodeDesign from "./CodeDesign";
import Link from "next/link";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";

export default function HeroSection() {
  return (
    <div className="mt-16 flex h-screen flex-col items-center text-center md:mt-32">
      <h1 className="bg-gradient-to-r from-white via-white/90 to-black/0 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
        Automated Project Management
      </h1>
      <h4 className="text-md mt-2 flex w-full items-center justify-center text-center font-thin md:w-1/2 md:text-2xl">
        Streamline your workflow, automate tasks, and boost team productivity
        with our intelligent project management platform.
      </h4>
      <div className="mt-4 flex gap-3">
        <Link href={AUTH_CLIENT_ROUTES.REGISTER}>
          <Button variant={"dark"}>Get Started</Button>
        </Link>
        <Link href={AUTH_CLIENT_ROUTES.LOGIN}>
          <Button variant={"white"}>Login </Button>
        </Link>
      </div>
      <div className="mt-5">
        <CodeDesign />
      </div>
    </div>
  );
}
