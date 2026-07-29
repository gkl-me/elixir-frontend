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
  Sparkles,
  Zap,
  Crown,
  Calendar,
  CreditCard,
  Building2,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminSubscription } from "@/data/demoData";

export function getSubscriptionColumns(
  openDetailsModal: (id: string) => void,
  openCancelModal: (sub: AdminSubscription) => void
): ColumnDef<AdminSubscription>[] {
  return [
    {
      accessorKey: "workspaceName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:text-purple-300 h-auto p-0 font-semibold text-white hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Workspace / Company
            <ArrowUpDown className="ml-2 h-4 w-4 text-purple-400" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const sub = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-1 ring-purple/30">
              <AvatarFallback className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple to-purpleDark text-xs font-bold text-white shadow-sm">
                {sub.workspaceName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-white tracking-wide truncate">
                {sub.workspaceName}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {sub.companyName}
              </span>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "ownerEmail",
      header: "Owner Email",
      cell: ({ row }) => (
        <span className="text-gray-300 text-sm">{row.getValue("ownerEmail")}</span>
      ),
    },
    {
      accessorKey: "planType",
      header: "Plan",
      cell: ({ row }) => {
        const plan = (row.getValue("planType") as string) || "Free";

        if (plan === "Pro") {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/40 bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <Zap className="h-3.5 w-3.5 text-blue-400 fill-blue-400/20" />
              Pro Plan
            </span>
          );
        }

        if (plan === "Enterprice") {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-fuchsia-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <Crown className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
              Enterprise
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-xs font-semibold text-slate-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-slate-400" />
            Free Plan
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price / Cycle",
      cell: ({ row }) => {
        const sub = row.original;
        const priceFmt = sub.price === 0 ? "$0" : `$${(sub.price / 100).toFixed(2)}`;
        const cycle = sub.billingCycle === "yearly" ? "/yr" : "/mo";

        return (
          <div className="flex items-center space-x-1 text-sm font-semibold text-white">
            <span>{priceFmt}</span>
            <span className="text-xs font-normal text-gray-400">{cycle}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const sub = row.original;
        const status = (sub.status as string)?.toLowerCase();
        const isPendingCancel = status === "active" && sub.cancelAtPeriodEnd;

        let badgeStyle = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
        let dotStyle = "bg-emerald-400";
        let label = status.replace("_", " ");

        if (isPendingCancel) {
          badgeStyle = "border-amber-500/40 bg-amber-500/15 text-amber-300";
          dotStyle = "bg-amber-400 animate-pulse";
          label = "Canceling at End";
        } else if (status === "canceled") {
          badgeStyle = "border-red-500/30 bg-red-500/10 text-red-400";
          dotStyle = "bg-red-400";
        } else if (status === "past_due") {
          badgeStyle = "border-amber-500/30 bg-amber-500/10 text-amber-400";
          dotStyle = "bg-amber-400 animate-pulse";
        } else if (status === "paused") {
          badgeStyle = "border-sky-500/30 bg-sky-500/10 text-sky-400";
          dotStyle = "bg-sky-400";
        }

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium capitalize shadow-sm ${badgeStyle}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} />
            {label}
          </span>
        );
      },
    },
    {
      accessorKey: "currentPeriodEnd",
      header: "Renewal Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("currentPeriodEnd") as string;
        const dateFmt = dateStr
          ? new Date(dateStr).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "N/A";
        return (
          <div className="flex items-center gap-1.5 text-gray-300 text-xs">
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
            <span>{dateFmt}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const sub = row.original;
        const isReactivating = sub.status === "canceled" || (sub.status === "active" && sub.cancelAtPeriodEnd);

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
                className="w-52 border border-purple/30 bg-navy text-white shadow-xl"
              >
                <DropdownMenuItem
                  onClick={() => openDetailsModal(sub.id)}
                  className="cursor-pointer text-white hover:!bg-purple/20 hover:!text-white focus:bg-purple/20 focus:text-white"
                >
                  <Eye className="mr-2 h-4 w-4 text-blue-400" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openCancelModal(sub)}
                  className="cursor-pointer text-white hover:!bg-purple/20 hover:!text-white focus:bg-purple/20 focus:text-white"
                >
                  {isReactivating ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />
                      Re-activate Plan
                    </>
                  ) : (
                    <>
                      <Ban className="mr-2 h-4 w-4 text-red-400" />
                      Cancel Subscription
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
