"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  UserX,
  UserCheck,
  Mail,
  Shield,
  Building2,
  User as UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type User = {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  image?: string;
};

export function getUserColumns(
  handleToggleBlock: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:text-purple-300 h-auto p-0 font-semibold text-white hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4 text-purple-400" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-1 ring-purple/30">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple to-purpleDark text-xs font-bold text-white shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-white tracking-wide">{user.name}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:text-purple-300 h-auto p-0 font-semibold text-white hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4 text-purple-400" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-purple-400" />
            <span className="text-gray-300 text-sm">{row.getValue("email")}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "isBlocked",
      header: "Status",
      cell: ({ row }) => {
        const isBlocked = row.getValue("isBlocked") as boolean;
        return (
          <div className="flex items-center">
            {isBlocked ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-0.5 text-xs font-medium text-red-400 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                <UserX className="h-3 w-3" />
                Blocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <UserCheck className="h-3 w-3" />
                Active
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        const toggleBlock = () => {
          handleToggleBlock(user.id);
        };

        return (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 border border-purple/30 bg-blueDark/50 p-0 transition-all duration-200 hover:!bg-purple/20 hover:text-white"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border border-purple/30 bg-navy text-white shadow-xl"
              >
                <DropdownMenuItem
                  onClick={toggleBlock}
                  className="cursor-pointer text-white hover:!bg-purple/20 hover:!text-white focus:bg-purple/20 focus:text-white"
                >
                  {user.isBlocked ? (
                    <>
                      <UserCheck className="mr-2 h-4 w-4 text-emerald-400" />
                      Unblock User
                    </>
                  ) : (
                    <>
                      <UserX className="mr-2 h-4 w-4 text-red-400" />
                      Block User
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}

