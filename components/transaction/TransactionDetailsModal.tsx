"use client";

import React from "react";
import {
  Building2,
  Mail,
  Clock,
  CreditCard,
  Receipt,
  DollarSign,
  Package,
  Download,
} from "lucide-react";
import { CustomModal } from "@/components/modal/CustomModal";
import { Button } from "@/components/ui/button";
import { AdminTransaction } from "@/data/demoData";
import { toastHandler } from "@/lib/toastHandler";
import { useRouter } from "next/navigation";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  transaction: AdminTransaction | null;
  onClose: () => void;
}

export function TransactionDetailsModal({
  isOpen,
  transaction,
  onClose,
}: TransactionDetailsModalProps) {
  if (!transaction) {return null;}

  const isFailed = transaction.status === "failed";
  const isRefunded = transaction.status === "refunded";
  const isPending = transaction.status === "pending";

  const amountFmt =
    transaction.amount === 0
      ? "$0.00 USD"
      : `$${(transaction.amount / 100).toFixed(2)} ${transaction.currency ?? "USD"}`;

  const dateFmt = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const router = useRouter();

  const handleDownloadInvoice = () => {
    if (!transaction.invoicePdfUrl) {
      toastHandler({
        success: false,
        message: `Invoice PDF not available for ${transaction.invoiceNumber}`,
      });
      return;
    }
    router.push(transaction.invoicePdfUrl);
    toastHandler({
      success: true,
      message: `Downloading PDF invoice for ${transaction.invoiceNumber}...`,
    });
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Receipt"
      description={`Audit log and payment breakdown for transaction ${transaction.id}`}
      className="sm:max-w-xl"
    >
      <div className="space-y-5">
        {/* Header Summary Card */}
        <div className="relative overflow-hidden rounded-2xl border border-purple/20 bg-gradient-to-r from-[#0a1128] via-[#0f1b3e] to-[#0a1128] p-4 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple to-purpleDark text-white shadow-md ring-2 ring-purple/30 ring-offset-2 ring-offset-navy">
              <Receipt className="h-7 w-7 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-bold tracking-wide text-white">
                  {transaction.invoiceNumber}
                </h3>
              </div>
              <p className="mt-0.5 truncate font-mono text-xs text-gray-400">
                {transaction.id}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  isFailed
                    ? "border border-red-500/30 bg-red-500/10 text-red-400"
                    : isRefunded
                      ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : isPending
                        ? "border border-sky-500/30 bg-sky-500/10 text-sky-400"
                        : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isFailed
                      ? "animate-pulse bg-red-400"
                      : isRefunded
                        ? "bg-amber-400"
                        : isPending
                          ? "animate-pulse bg-sky-400"
                          : "bg-emerald-400"
                  }`}
                />
                {transaction.status}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-2">
          {/* Amount Paid */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="font-medium">Total Amount</span>
            </div>
            <p className="mt-2 text-sm font-bold text-white">{amountFmt}</p>
          </div>

          {/* Customer Company */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Building2 className="text-purple-400 h-4 w-4" />
              <span className="font-medium">Workspace</span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {transaction.workspaceName}
            </p>
          </div>

          {/* Customer Email */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="h-4 w-4 text-blue-400" />
              <span className="font-medium">Customer Email</span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {transaction.customerEmail}
            </p>
          </div>

          {/* Subscription Plan */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Package className="h-4 w-4 text-amber-400" />
              <span className="font-medium">Item / Plan</span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {transaction.planType}
            </p>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <CreditCard className="h-4 w-4 text-indigo-400" />
              <span className="font-medium">Payment Source</span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {transaction.paymentMethod} •••• {transaction.last4}
            </p>
          </div>

          {/* Date & Time */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4 text-pink-400" />
              <span className="font-medium">Processed At</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{dateFmt}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-purple/20 pt-4">
          <Button
            onClick={handleDownloadInvoice}
            className="text-purple-300 gap-2 border border-purple/30 bg-purple/20 text-xs font-semibold hover:bg-purple/30 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF Invoice
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="border-purple/30 bg-navy/50 font-medium text-gray-300 hover:bg-purple/20 hover:text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
