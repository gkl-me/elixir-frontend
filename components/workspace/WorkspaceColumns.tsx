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
  Ban,
  CheckCircle,
  Users,
  Sparkles,
  Zap,
  Crown,
  Layers,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type Workspace = {
  id: string;
  name: string;
  ownerEmail: string;
  planType: "Free" | "Pro" | "Enterprice" | string;
  status: "active" | "suspended" | string;
  totalUsers: number;
  createdAt: Date;
};

export function getWorkspaceColumns(
  openDetailsModal: (id: string) => void,
  openSuspendModal: (workspace: Workspace) => void
): ColumnDef<Workspace>[] {
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
            Workspace Name
            <ArrowUpDown className="ml-2 h-4 w-4 text-purple-400" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const workspace = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-1 ring-purple/30">
              <AvatarFallback className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple to-purpleDark text-xs font-bold text-white shadow-sm">
                {workspace.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-white tracking-wide">{workspace.name}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "ownerEmail",
      header: "Owner",
      cell: ({ row }) => (
        <span className="text-gray-300 text-sm">{row.getValue("ownerEmail")}</span>
      ),
    },
    {
      accessorKey: "planType",
      header: "Plan",
      cell: ({ row }) => {
        const rawPlan = row.getValue("planType") as string;
        const plan = rawPlan?.toLowerCase() || "";

        let label = rawPlan || "Free";
        let icon = <Sparkles className="mr-1.5 h-3.5 w-3.5 text-slate-400" />;
        let badgeStyle =
          "border-slate-700/60 bg-slate-800/60 text-slate-300 shadow-sm";

        if (plan.includes("pro")) {
          label = "Pro";
          icon = <Zap className="mr-1.5 h-3.5 w-3.5 text-blue-400 fill-blue-400/20" />;
          badgeStyle =
            "border-blue-500/40 bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]";
        } else if (plan.includes("enter")) {
          label = "Enterprise";
          icon = <Crown className="mr-1.5 h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />;
          badgeStyle =
            "border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-fuchsia-500/15 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]";
        } else if (plan.includes("free")) {
          label = "Free";
          icon = <Sparkles className="mr-1.5 h-3.5 w-3.5 text-slate-400" />;
          badgeStyle =
            "border-slate-700/60 bg-slate-800/60 text-slate-300 shadow-sm";
        } else {
          icon = <Layers className="mr-1.5 h-3.5 w-3.5 text-purple-400" />;
          badgeStyle =
            "border-purple-500/30 bg-purple-500/10 text-purple-300";
        }

        return (
          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide transition-all duration-200 ${badgeStyle}`}
          >
            {icon}
            {label}
          </span>
        );
      },
    },
    {
      accessorKey: "totalUsers",
      header: "Users",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 text-gray-300">
          <Users className="h-4 w-4 text-purple-400" />
          <span className="font-medium">{row.getValue("totalUsers")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const isSuspended = status === "suspended" || status === "blocked";

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium capitalize shadow-sm ${
              isSuspended
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isSuspended ? "bg-red-400 animate-pulse" : "bg-emerald-400"
              }`}
            />
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const workspace = row.original;

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
                  onClick={() => openDetailsModal(workspace.id)}
                  className="cursor-pointer text-white hover:!bg-purple/20 hover:!text-white focus:bg-purple/20 focus:text-white"
                >
                  <Eye className="mr-2 h-4 w-4 text-blue-400" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openSuspendModal(workspace)}
                  className="cursor-pointer text-white hover:!bg-purple/20 hover:!text-white focus:bg-purple/20 focus:text-white"
                >
                  {workspace.status === "suspended" ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />
                      Activate Workspace
                    </>
                  ) : (
                    <>
                      <Ban className="mr-2 h-4 w-4 text-red-400" />
                      Suspend Workspace
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

