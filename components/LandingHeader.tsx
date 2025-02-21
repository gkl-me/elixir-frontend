import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export default function LandingHeader() {

    return (
    <div className="flex justify-between items-center p-4 sm:w-2/3 w-3/4 mx-auto mt-4 fixed top-0 left-0 right-0 z-10
        border border-blueDark rounded-lg bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 
        shadow-sm shadow-navyDark bg-black
    ">
        <div className="flex items-center space-x-2">
            <Image src={"/elixir-logo.svg"} alt="elixir-logo" width={25} height={2}  />
            <h1 className="text-xl font-semibold">Elixir</h1>
        </div>
        <div className="md:flex space-x-4 hidden ">
            <Link href={"#features"}><p>Features</p></Link>
            <Link href={"#automation"}><p>Automation</p></Link>
            <Link href={"#pricing"}><p>Pricing</p></Link>
            <Link href={"#contact"}><p>Contact Us</p></Link>
            
        </div> 
        <div className="flex items-center space-x-4">
            <Button className="hidden md:block" variant={"light"}>Login</Button>
            <DropdownMenu>
                <DropdownMenuTrigger>
            <Menu size={24} className="block md:hidden"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-navyDark border border-blueDark text-white">
                    <DropdownMenuItem><Link href={"#features"}><p>Features</p></Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href={"#automation"}><p>Automation</p></Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href={"#pricing"}><p>Pricing</p></Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href={"#contact"}><p>Contact Us</p></Link></DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button className="w-full" variant={"light"}>Login</Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
    )
}