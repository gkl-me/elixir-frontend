import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";

export default function LandingHeader() {

    return (
    <div className="flex justify-between items-center p-4 sm:w-2/3 w-11/12 mx-auto mt-6 fixed top-0 left-0 right-0 z-50
        border border-white/10 rounded-2xl bg-navyDark/70 backdrop-blur-xl
        shadow-lg shadow-black/50 transition-all duration-300
    ">
        <div className="flex items-center space-x-2">
            <Image src={"/elixir-logo.svg"} alt="elixir-logo" width={25} height={2}  />
            <h1 className="text-xl font-bold tracking-tight text-white">Elixir</h1>
        </div>
        <div className="md:flex lg:space-x-8 md:text-sm lg:text-base md:space-x-4 hidden font-medium text-gray-300">
            <Link href={"#features"} className="hover:text-purple transition-colors"><p>Features</p></Link>
            <Link href={"#automation"} className="hover:text-purple transition-colors"><p>Automation</p></Link>
            <Link href={"#pricing"} className="hover:text-purple transition-colors"><p>Pricing</p></Link>

        </div> 
        <div className="flex items-center space-x-4">
            <Link href={AUTH_CLIENT_ROUTES.LOGIN}>
            <Button className="hidden md:block bg-white text-navyDark hover:bg-gray-200 transition-colors font-semibold" variant={"secondary"}>Login</Button>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
            <Menu size={24} className="block md:hidden text-white"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-navyDark border border-blueDark text-white w-48 mr-2 mt-2">
                    <DropdownMenuItem><Link href={"#features"} className="w-full">Features</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href={"#automation"} className="w-full">Automation</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href={"#pricing"} className="w-full">Pricing</Link></DropdownMenuItem>

                    <DropdownMenuItem>
                        <Link href={AUTH_CLIENT_ROUTES.LOGIN} className="w-full">
                        <Button className="w-full mt-2" variant={"secondary"}>Login</Button>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
    )
}