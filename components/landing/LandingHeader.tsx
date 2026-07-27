import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";

export default function LandingHeader() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 mx-auto mt-6 flex w-11/12 items-center justify-between rounded-2xl border border-white/10 bg-navyDark/70 p-4 shadow-lg shadow-black/50 backdrop-blur-xl transition-all duration-300 sm:w-2/3">
      <div className="flex items-center space-x-2">
        <Image
          src={"/elixir-logo.svg"}
          alt="elixir-logo"
          width={25}
          height={2}
        />
        <h1 className="text-xl font-bold tracking-tight text-white">Elixir</h1>
      </div>
      <div className="hidden font-medium text-gray-300 md:flex md:space-x-4 md:text-sm lg:space-x-8 lg:text-base">
        <Link
          href={"#features"}
          className="transition-colors hover:text-purple"
        >
          <p>Features</p>
        </Link>
        <Link
          href={"#automation"}
          className="transition-colors hover:text-purple"
        >
          <p>Automation</p>
        </Link>
        <Link href={"#pricing"} className="transition-colors hover:text-purple">
          <p>Pricing</p>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href={AUTH_CLIENT_ROUTES.LOGIN}>
          <Button
            className="hidden bg-white font-semibold text-navyDark transition-colors hover:bg-gray-200 md:block"
            variant={"secondary"}
          >
            Login
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Menu size={24} className="block text-white md:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2 mt-2 w-48 border border-blueDark bg-navyDark text-white">
            <DropdownMenuItem>
              <Link href={"#features"} className="w-full">
                Features
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"#automation"} className="w-full">
                Automation
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"#pricing"} className="w-full">
                Pricing
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href={AUTH_CLIENT_ROUTES.LOGIN} className="w-full">
                <Button className="mt-2 w-full" variant={"secondary"}>
                  Login
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
