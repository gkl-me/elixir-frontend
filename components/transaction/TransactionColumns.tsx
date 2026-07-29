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
  CreditCard,
  Clock,
  Receipt,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminTransaction } from "@/data/demoData";

export function getTransactionColumns(
  openDetailsModal: (id: string) => void
): ColumnDef<AdminTransaction>[] {
  return [
    {
      accessorKey: "id",
      header: "Transaction Ref",
      cell: ({ row }) => {
        const txn = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Receipt className="text-purple-400 h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-mono text-xs font-semibold text-white">
                {txn.invoiceNumber}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "workspaceName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:text-purple-300 h-auto p-0 font-semibold text-white hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Workspace / Customer
            <ArrowUpDown className="text-purple-400 ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const txn = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-1 ring-purple/30">
              <AvatarFallback className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple to-purpleDark text-xs font-bold text-white shadow-sm">
                {txn.workspaceName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-semibold tracking-wide text-white">
                {txn.workspaceName}
              </span>
              <span className="truncate text-xs text-gray-400">
                {txn.customerEmail}
              </span>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:text-purple-300 h-auto p-0 font-semibold text-white hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="text-purple-400 ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const txn = row.original;
        const formatted =
          txn.amount === 0 ? "$0.00" : `$${(txn.amount / 100).toFixed(2)}`;
        return (
          <span className="text-sm font-bold text-white">
            {formatted}{" "}
            <span className="text-[10px] font-normal text-gray-400">
              {txn.currency ?? "USD"}
            </span>
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => {
        const txn = row.original;
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <CreditCard className="text-purple-400 h-3.5 w-3.5" />
            <span>
              {txn.paymentMethod} •••• {txn.last4}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.getValue("status") as string)?.toLowerCase();
        let badgeStyle =
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
        let dotStyle = "bg-emerald-400";

        if (status === "failed") {
          badgeStyle = "border-red-500/30 bg-red-500/10 text-red-400";
          dotStyle = "bg-red-400 animate-pulse";
        } else if (status === "refunded") {
          badgeStyle = "border-amber-500/30 bg-amber-500/10 text-amber-400";
          dotStyle = "bg-amber-400";
        } else if (status === "pending") {
          badgeStyle = "border-sky-500/30 bg-sky-500/10 text-sky-400";
          dotStyle = "bg-sky-400 animate-pulse";
        }

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium capitalize shadow-sm ${badgeStyle}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} />
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string;
        const dateFmt = dateStr
          ? new Date(dateStr).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A";
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <Clock className="text-purple-400 h-3.5 w-3.5" />
            <span>{dateFmt}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const txn = row.original;

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
                  onClick={() => openDetailsModal(txn.id)}
                  className="cursor-pointer text-white hover:!bg-purple/20 hover:!text-white focus:bg-purple/20 focus:text-white"
                >
                  <Eye className="mr-2 h-4 w-4 text-blue-400" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
