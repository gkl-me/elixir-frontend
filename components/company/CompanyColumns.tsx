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
  Eye,
  Mail,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Company = {
  id: string;
  name: string;
  email: string;
  type?: string;
  size?: number | string;
  status: "active" | "pending" | "blocked" | "suspended";
  isBlocked?: boolean;
  logo?: string;
  description?: string;
  website?: string;
  phone?: string;
  createdAt?: string;
};

export function getCompanyColumns(
  openDetailsModal: (id: string) => void,
  openSuspendModal: (company: Company) => void
): ColumnDef<Company>[] {
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
            Company Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={company?.logo} />
              <AvatarFallback className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-purple to-purpleDark text-sm font-medium text-white">
                {company.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-white">{company.name}</span>
            </div>
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
            Contact Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-white/90">{row.getValue("email")}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        let badgeClass = "bg-gray-500";
        if (status === "active") {
          badgeClass = "bg-gradient-to-r from-green-500 to-green-600";
        }
        if (status === "blocked") {
          badgeClass = "bg-gradient-to-r from-red-500 to-red-600";
        }
        if (status === "pending") {
          badgeClass = "bg-gradient-to-r from-yellow-500 to-yellow-600";
        }

        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize text-white shadow-sm ${badgeClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const company = row.original;

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
                className="w-48 border border-purple/30 bg-navy text-white shadow-xl"
              >
                <DropdownMenuItem
                  onClick={() => openDetailsModal(company.id)}
                  className="cursor-pointer text-white hover:!bg-purple/20 hover:!text-white focus:bg-purple/20 focus:text-white"
                >
                  <Eye className="mr-2 h-4 w-4 text-blue-400" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openSuspendModal(company)}
                  className="cursor-pointer text-white hover:!bg-purple/20 hover:!text-white focus:bg-purple/20 focus:text-white"
                >
                  {company.status === "suspended" ||
                  company.status === "blocked" ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                      Activate Company
                    </>
                  ) : (
                    <>
                      <Ban className="mr-2 h-4 w-4 text-red-500" />
                      Suspend Company
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
