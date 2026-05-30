"use client";

import React, { useState } from "react";
import {
  CreditCard,
  ArrowRight,
  Check,
  X,
  Zap,
  Star,
  Building,
  Package,
  Download,
  Eye as ViewIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import {
  demoWorkspace,
  demoSubscriptions,
  demoInvoices,
  Invoice,
} from "../../../../data/demoData";
import { Section } from "./shared";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────
const fmt = (cents: number) =>
  cents === 0 ? "$0.00" : `$${(cents / 100).toFixed(2)}`;

// ─── Status badge ─────────────────────────────────────────
const StatusBadge = ({ status }: { status: Invoice["status"] }) => {
  const map = {
    paid: {
      label: "Paid",
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    },
    failed: {
      label: "Failed",
      cls: "bg-red-500/15 text-red-400 border-red-500/25",
    },
    refunded: {
      label: "Refunded",
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    },
    pending: {
      label: "Pending",
      cls: "bg-sky-500/15 text-sky-400 border-sky-500/25",
    },
  };
  const { label, cls } = map[status] ?? map.pending;
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {label}
    </span>
  );
};

// ─── Invoice detail modal ─────────────────────────────────
const InvoiceModal = ({
  invoice,
  onClose,
}: {
  invoice: Invoice | null;
  onClose: () => void;
}) => {
  if (!invoice) {
    return null;
  }
  return (
    <CustomModal
      isOpen={!!invoice}
      onClose={onClose}
      title={invoice.invoiceNumber}
      description={`Invoice for ${invoice.period}`}
      className="sm:max-w-lg"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-xl border border-[#1e2a4a] bg-[#07112b] p-4">
          <div>
            <p className="mb-1 text-xs text-[#6b7db3]">Billed on</p>
            <p className="text-sm font-semibold text-white">{invoice.date}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="overflow-hidden rounded-xl border border-[#1e2a4a]">
          <div className="border-b border-[#1e2a4a] bg-[#0a1327] px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4B5578]">
              Line Items
            </p>
          </div>
          <div className="divide-y divide-[#1e2a4a]">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">
                  {invoice.plan} Plan
                </p>
                <p className="text-xs text-[#6b7db3]">{invoice.period}</p>
              </div>
              <p className="text-sm font-semibold text-white">
                {fmt(invoice.amount)}
              </p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-[#8b9cc8]">
                {invoice.seats} seat{invoice.seats !== 1 ? "s" : ""} × /month
              </p>
              <p className="text-sm text-[#8b9cc8]">×{invoice.seats}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#1e2a4a] bg-[#0a1327] px-4 py-3">
            <p className="text-sm font-bold text-white">Total</p>
            <p className="text-lg font-bold text-white">
              {fmt(invoice.amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#07112b] p-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#132353]">
            <CreditCard className="h-4 w-4 text-[#8735C9]" />
          </div>
          <div>
            <p className="text-xs text-[#6b7db3]">Payment method</p>
            <p className="text-sm font-medium text-white">
              {invoice.paymentMethod} ending in {invoice.last4}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => {}}
            className="flex-1 gap-2 bg-[#8735C9] text-white hover:bg-[#6a29a0]"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Plan feature row ─────────────────────────────────────
const Feature = ({ ok, text }: { ok: boolean; text: string }) => (
  <li className="flex items-center gap-2 text-sm">
    {ok ? (
      <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
    ) : (
      <X className="h-3.5 w-3.5 flex-shrink-0 text-[#4B5578]" />
    )}
    <span className={ok ? "text-[#c9d3ed]" : "text-[#4B5578]"}>{text}</span>
  </li>
);

// ─── BillingTab ───────────────────────────────────────────
export const BillingTab = () => {
  const currentPlan =
    demoSubscriptions.find((s) => s.id === demoWorkspace.subscriptionPlan) ??
    demoSubscriptions[1];

  const planOrder: Record<string, number> = { free: 0, pro: 1, enterprise: 2 };
  const upgradePlans = demoSubscriptions.filter(
    (p) =>
      (planOrder[p.type.toLowerCase()] ?? 99) >
      (planOrder[currentPlan.type.toLowerCase()] ?? 0)
  );
  const planIcons: Record<string, React.ElementType> = {
    free: Package,
    pro: Star,
    enterprise: Building,
  };

  const [search, setSearch] = useState("");
  const [pageIndex, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const PAGE_SIZE = 5;

  const filtered = demoInvoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.plan.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  );

  const columns: ColumnDef<Invoice, unknown>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-semibold text-white">
            {row.original.invoiceNumber}
          </p>
          <p className="text-xs text-[#6b7db3]">{row.original.period}</p>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-[#8b9cc8]">{row.original.date}</span>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <span className="rounded-full border border-[#8735C9]/25 bg-[#8735C9]/15 px-2 py-0.5 text-[11px] font-semibold text-[#c084fc]">
          {row.original.plan}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-white">
          {fmt(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelected(row.original)}
            className="h-7 gap-1 px-2 text-xs text-[#8735C9] hover:bg-[#8735C9] hover:text-white"
          >
            <ViewIcon className="h-3.5 w-3.5" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            className="h-7 px-2 text-xs text-[#6b7db3] hover:bg-[#0f1d3d] hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current plan badge */}
      <div className="flex items-center justify-between rounded-2xl border border-[#8735C9]/40 bg-gradient-to-r from-[#1a0f35] to-[#0C1635] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8735C9]/20">
            <Zap className="h-5 w-5 text-[#c084fc]" />
          </div>
          <div>
            <p className="text-xs text-[#6b7db3]">Current plan</p>
            <p className="text-lg font-black text-white">
              {currentPlan.name}{" "}
              <span className="text-sm font-normal text-[#6b7db3]">
                · {fmt(currentPlan.price)}/seat/mo
              </span>
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="gap-1.5 border border-[#1e2a4a] text-xs text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
        >
          <CreditCard className="h-3.5 w-3.5" />
          Manage Payment
        </Button>
      </div>

      {/* Upgrade plans */}
      {upgradePlans.length > 0 && (
        <Section
          title="Upgrade Plan"
          description="Unlock more features and higher limits for your team."
        >
          <div
            className={cn(
              "grid gap-4",
              upgradePlans.length === 1
                ? "max-w-sm md:grid-cols-1"
                : "md:grid-cols-2"
            )}
          >
            {upgradePlans.map((plan) => {
              const Icon = planIcons[plan.id] ?? Star;
              return (
                <div
                  key={plan.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#1e2a4a] bg-[#07112b] p-5 transition-colors hover:border-[#8735C9]/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#132353]">
                      <Icon className="h-5 w-5 text-[#8b9cc8]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-[#6b7db3]">
                        {plan.price === 0
                          ? "Free"
                          : `$${plan.price / 100}/seat/mo`}
                      </p>
                    </div>
                  </div>
                  <ul className="flex-1 space-y-1.5">
                    <Feature
                      ok
                      text={`${plan.limits.projects === -1 ? "Unlimited" : plan.limits.projects} Projects`}
                    />
                    <Feature
                      ok
                      text={`${plan.limits.members === -1 ? "Unlimited" : plan.limits.members} Members`}
                    />
                    <Feature
                      ok={plan.features.githubAutomation}
                      text="GitHub Automation"
                    />
                    <Feature
                      ok={plan.limits.customRoles > 0}
                      text={`${plan.limits.customRoles} Custom Roles`}
                    />
                    <Feature ok={plan.id !== "free"} text="Priority Support" />
                    <Feature ok={plan.id === "enterprise"} text="SSO / SAML" />
                  </ul>
                  <Button
                    onClick={() => {}}
                    className="mt-auto w-full gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-white shadow hover:opacity-90"
                  >
                    Upgrade to {plan.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Invoice history */}
      <Section
        title="Billing History"
        description="All your past invoices and receipts."
      >
        <div className="-mt-2 mb-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            className="h-7 gap-1.5 border border-[#1e2a4a] text-xs text-[#6b7db3] hover:bg-[#0f1d3d] hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            Download All
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={paged}
          totalCount={filtered.length}
          pageIndex={pageIndex}
          pageSize={PAGE_SIZE}
          search={search}
          sorting={sorting}
          onPageChange={setPage}
          onSearchChange={(s) => {
            setSearch(s);
            setPage(0);
          }}
          onSortingChange={setSorting}
        />
      </Section>

      <InvoiceModal invoice={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
