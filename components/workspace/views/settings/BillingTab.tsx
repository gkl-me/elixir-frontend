'use client';

import React, { useState } from 'react';
import {
  CreditCard, ArrowRight, Check, X, Zap,
  Star, Building, Package, Download, Eye as ViewIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/modal/CustomModal';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/table/DataTable';
import {
  demoWorkspace, demoSubscriptions, demoInvoices, Invoice,
} from '../../../../data/demoData';
import { Section } from './shared';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────
const fmt = (cents: number) =>
  cents === 0 ? '$0.00' : `$${(cents / 100).toFixed(2)}`;

// ─── Status badge ─────────────────────────────────────────
const StatusBadge = ({ status }: { status: Invoice['status'] }) => {
  const map = {
    paid:     { label: 'Paid',     cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    failed:   { label: 'Failed',   cls: 'bg-red-500/15 text-red-400 border-red-500/25'             },
    refunded: { label: 'Refunded', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25'       },
    pending:  { label: 'Pending',  cls: 'bg-sky-500/15 text-sky-400 border-sky-500/25'             },
  };
  const { label, cls } = map[status] ?? map.pending;
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
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
  if (!invoice) return null;
  return (
    <CustomModal
      isOpen={!!invoice}
      onClose={onClose}
      title={invoice.invoiceNumber}
      description={`Invoice for ${invoice.period}`}
      className="sm:max-w-lg"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#07112b] border border-[#1e2a4a]">
          <div>
            <p className="text-xs text-[#6b7db3] mb-1">Billed on</p>
            <p className="text-sm font-semibold text-white">{invoice.date}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="rounded-xl border border-[#1e2a4a] overflow-hidden">
          <div className="px-4 py-2.5 bg-[#0a1327] border-b border-[#1e2a4a]">
            <p className="text-[10px] font-semibold text-[#4B5578] uppercase tracking-widest">
              Line Items
            </p>
          </div>
          <div className="divide-y divide-[#1e2a4a]">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-white font-medium">{invoice.plan} Plan</p>
                <p className="text-xs text-[#6b7db3]">{invoice.period}</p>
              </div>
              <p className="text-sm font-semibold text-white">{fmt(invoice.amount)}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-[#8b9cc8]">
                {invoice.seats} seat{invoice.seats !== 1 ? 's' : ''} × /month
              </p>
              <p className="text-sm text-[#8b9cc8]">×{invoice.seats}</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a1327] border-t border-[#1e2a4a]">
            <p className="text-sm font-bold text-white">Total</p>
            <p className="text-lg font-bold text-white">{fmt(invoice.amount)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#07112b] border border-[#1e2a4a]">
          <div className="w-9 h-9 rounded-lg bg-[#132353] flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-4 h-4 text-[#8735C9]" />
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
            onClick={() => {
              console.log('[API TODO] Download invoice', invoice.id);
              alert(`Downloading ${invoice.invoiceNumber}…`);
            }}
            className="flex-1 bg-[#8735C9] hover:bg-[#6a29a0] text-white gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]"
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
      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
    ) : (
      <X className="w-3.5 h-3.5 text-[#4B5578] flex-shrink-0" />
    )}
    <span className={ok ? 'text-[#c9d3ed]' : 'text-[#4B5578]'}>{text}</span>
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

  const [search, setSearch]     = useState('');
  const [pageIndex, setPage]    = useState(0);
  const [sorting, setSorting]   = useState<SortingState>([]);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const PAGE_SIZE = 5;

  const filtered = demoInvoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.plan.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

  const columns: ColumnDef<Invoice, unknown>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-semibold text-white">{row.original.invoiceNumber}</p>
          <p className="text-xs text-[#6b7db3]">{row.original.period}</p>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-sm text-[#8b9cc8]">{row.original.date}</span>
      ),
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#8735C9]/15 text-[#c084fc] border border-[#8735C9]/25">
          {row.original.plan}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm font-bold text-white">{fmt(row.original.amount)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelected(row.original)}
            className="h-7 px-2 text-[#8735C9] hover:text-white hover:bg-[#8735C9] gap-1 text-xs"
          >
            <ViewIcon className="w-3.5 h-3.5" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('[API TODO] Download', row.original.id)}
            className="h-7 px-2 text-[#6b7db3] hover:text-white hover:bg-[#0f1d3d] text-xs"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current plan badge */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1a0f35] to-[#0C1635] border border-[#8735C9]/40 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8735C9]/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#c084fc]" />
          </div>
          <div>
            <p className="text-xs text-[#6b7db3]">Current plan</p>
            <p className="text-lg font-black text-white">
              {currentPlan.name}{' '}
              <span className="text-sm font-normal text-[#6b7db3]">
                · {fmt(currentPlan.price)}/seat/mo
              </span>
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-xs border border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d] gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" />
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
              'grid gap-4',
              upgradePlans.length === 1 ? 'md:grid-cols-1 max-w-sm' : 'md:grid-cols-2'
            )}
          >
            {upgradePlans.map((plan) => {
              const Icon = planIcons[plan.id] ?? Star;
              return (
                <div
                  key={plan.id}
                  className="bg-[#07112b] border border-[#1e2a4a] hover:border-[#8735C9]/40 rounded-xl p-5 flex flex-col gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#132353] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#8b9cc8]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-[#6b7db3]">
                        {plan.price === 0
                          ? 'Free'
                          : `$${plan.price / 100}/seat/mo`}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 flex-1">
                    <Feature
                      ok
                      text={`${plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects} Projects`}
                    />
                    <Feature
                      ok
                      text={`${plan.limits.members === -1 ? 'Unlimited' : plan.limits.members} Members`}
                    />
                    <Feature ok={plan.features.githubAutomation} text="GitHub Automation" />
                    <Feature
                      ok={plan.limits.customRoles > 0}
                      text={`${plan.limits.customRoles} Custom Roles`}
                    />
                    <Feature ok={plan.id !== 'free'} text="Priority Support" />
                    <Feature ok={plan.id === 'enterprise'} text="SSO / SAML" />
                  </ul>
                  <Button
                    onClick={() =>
                      console.log('[API TODO] Upgrade to', plan.id)
                    }
                    className="w-full bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 mt-auto shadow"
                  >
                    Upgrade to {plan.name}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Invoice history */}
      <Section title="Billing History" description="All your past invoices and receipts.">
        <div className="flex justify-end mb-3 -mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('[API TODO] Download all')}
            className="text-[#6b7db3] hover:text-white border border-[#1e2a4a] hover:bg-[#0f1d3d] gap-1.5 text-xs h-7"
          >
            <Download className="w-3.5 h-3.5" />
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
