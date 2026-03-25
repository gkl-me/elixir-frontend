'use client';

import React, { useState } from 'react';
import {
  User, Building2, Shield, Bell, Plug,
  Camera, ChevronRight, Eye, EyeOff, Trash2,
  LogOut, Key, Smartphone, Globe, Save, AlertTriangle,
  CreditCard, ArrowRight, Check, X, Zap,
  FolderKanban, Users, HardDrive, Star, Building, Package,
  Download, Eye as ViewIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CustomModal } from '@/components/modal/CustomModal';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/table/DataTable';
import {
  demoWorkspace, demoUsers, demoSubscriptions,
  demoInvoices, Invoice
} from '../../../data/demoData';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────
type SettingsTab = 'profile' | 'workspace' | 'security' | 'notifications' | 'integrations' | 'usage' | 'billing';

// ─── Shared helpers ───────────────────────────────────────
const Section = ({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) => (
  <div className="bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden">
    <div className="px-6 py-4 border-b border-[#1e2a4a]">
      <h3 className="font-semibold text-white">{title}</h3>
      {description && <p className="text-xs text-[#6b7db3] mt-0.5">{description}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-[#c9d3ed]">{label}</Label>
    {children}
    {hint && <p className="text-xs text-[#4B5578]">{hint}</p>}
  </div>
);

const StyledInput = (props: React.ComponentProps<typeof Input>) => (
  <Input {...props} className={cn(
    'bg-[#07112b] border-[#1e2a4a] text-white placeholder:text-[#4B5578]',
    'focus-visible:ring-[#8735C9] focus-visible:border-[#8735C9] transition-colors',
    props.className
  )} />
);

const Toggle = ({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-[#c9d3ed]">{label}</p>
      {description && <p className="text-xs text-[#4B5578] mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className="relative rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ height: 22, width: 40, backgroundColor: checked ? '#8735C9' : '#1e2a4a' }}
    >
      <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200', checked ? 'left-5' : 'left-0.5')} />
    </button>
  </div>
);

// ─── Usage Meter ─────────────────────────────────────────
const UsageMeter = ({ label, used, limit, unit = '', icon: Icon, color = '#8735C9' }: {
  label: string; used: number; limit: number; unit?: string; icon: React.ElementType; color?: string;
}) => {
  const pct   = limit === -1 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const warn  = pct >= 80;
  const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : color;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-sm font-medium text-[#c9d3ed]">{label}</span>
        </div>
        <span className={cn('text-xs font-semibold', warn ? 'text-amber-400' : 'text-[#6b7db3]')}>
          {limit === -1 ? `${used} / ∞` : `${used} / ${limit}${unit}`}
        </span>
      </div>
      <div className="h-2 bg-[#07112b] rounded-full overflow-hidden">
        {limit !== -1 && (
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        )}
        {limit === -1 && (
          <div className="h-full rounded-full bg-emerald-500/40" style={{ width: '100%' }} />
        )}
      </div>
      {warn && limit !== -1 && (
        <p className="text-[10px] text-amber-400">⚠ Approaching limit — consider upgrading</p>
      )}
    </div>
  );
};

// ─── Billing Tab ─────────────────────────────────────────
const fmt = (cents: number) => cents === 0 ? '$0.00' : `$${(cents / 100).toFixed(2)}`;

const StatusBadge = ({ status }: { status: Invoice['status'] }) => {
  const map = {
    paid:     { label: 'Paid',     cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    failed:   { label: 'Failed',   cls: 'bg-red-500/15 text-red-400 border-red-500/25'             },
    refunded: { label: 'Refunded', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25'       },
    pending:  { label: 'Pending',  cls: 'bg-sky-500/15 text-sky-400 border-sky-500/25'             },
  };
  const { label, cls } = map[status] ?? map.pending;
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>;
};

const InvoiceModal = ({ invoice, onClose }: { invoice: Invoice | null; onClose: () => void }) => {
  if (!invoice) return null;
  return (
    <CustomModal isOpen={!!invoice} onClose={onClose} title={invoice.invoiceNumber} description={`Invoice for ${invoice.period}`} className="sm:max-w-lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#07112b] border border-[#1e2a4a]">
          <div><p className="text-xs text-[#6b7db3] mb-1">Billed on</p><p className="text-sm font-semibold text-white">{invoice.date}</p></div>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="rounded-xl border border-[#1e2a4a] overflow-hidden">
          <div className="px-4 py-2.5 bg-[#0a1327] border-b border-[#1e2a4a]">
            <p className="text-[10px] font-semibold text-[#4B5578] uppercase tracking-widest">Line Items</p>
          </div>
          <div className="divide-y divide-[#1e2a4a]">
            <div className="flex items-center justify-between px-4 py-3">
              <div><p className="text-sm text-white font-medium">{invoice.plan} Plan</p><p className="text-xs text-[#6b7db3]">{invoice.period}</p></div>
              <p className="text-sm font-semibold text-white">{fmt(invoice.amount)}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-[#8b9cc8]">{invoice.seats} seat{invoice.seats !== 1 ? 's' : ''} × /month</p>
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
            <p className="text-sm font-medium text-white">{invoice.paymentMethod} ending in {invoice.last4}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <Button onClick={() => { console.log('[API TODO] Download invoice', invoice.id); alert(`Downloading ${invoice.invoiceNumber}…`); }} className="flex-1 bg-[#8735C9] hover:bg-[#6a29a0] text-white gap-2">
            <Download className="w-4 h-4" />Download PDF
          </Button>
          <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Close</Button>
        </div>
      </div>
    </CustomModal>
  );
};

const Feature = ({ ok, text }: { ok: boolean; text: string }) => (
  <li className="flex items-center gap-2 text-sm">
    {ok ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <X className="w-3.5 h-3.5 text-[#4B5578] flex-shrink-0" />}
    <span className={ok ? 'text-[#c9d3ed]' : 'text-[#4B5578]'}>{text}</span>
  </li>
);

const BillingTab = () => {
  const currentPlan = demoSubscriptions.find(s => s.id === demoWorkspace.subscriptionPlan) ?? demoSubscriptions[1];

  // Only show plans higher than current
  const planOrder: Record<string, number> = { free: 0, pro: 1, enterprise: 2 };
  const upgradePlans = demoSubscriptions.filter(p =>
    (planOrder[p.type.toLowerCase()] ?? 99) > (planOrder[currentPlan.type.toLowerCase()] ?? 0)
  );
  const planIcons: Record<string, React.ElementType> = { free: Package, pro: Star, enterprise: Building };

  const [search, setSearch]     = useState('');
  const [pageIndex, setPage]    = useState(0);
  const [sorting, setSorting]   = useState<SortingState>([]);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const PAGE_SIZE = 5;

  const filtered = demoInvoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.plan.toLowerCase().includes(search.toLowerCase()) ||
    inv.status.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

  const columns: ColumnDef<Invoice, unknown>[] = [
    {
      accessorKey: 'invoiceNumber', header: 'Invoice',
      cell: ({ row }) => (
        <div><p className="text-sm font-semibold text-white">{row.original.invoiceNumber}</p><p className="text-xs text-[#6b7db3]">{row.original.period}</p></div>
      ),
    },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => <span className="text-sm text-[#8b9cc8]">{row.original.date}</span> },
    {
      accessorKey: 'plan', header: 'Plan',
      cell: ({ row }) => <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#8735C9]/15 text-[#c084fc] border border-[#8735C9]/25">{row.original.plan}</span>,
    },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => <span className="text-sm font-bold text-white">{fmt(row.original.amount)}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => setSelected(row.original)} className="h-7 px-2 text-[#8735C9] hover:text-white hover:bg-[#8735C9] gap-1 text-xs">
            <ViewIcon className="w-3.5 h-3.5" />View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => console.log('[API TODO] Download', row.original.id)} className="h-7 px-2 text-[#6b7db3] hover:text-white hover:bg-[#0f1d3d] text-xs">
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
            <p className="text-lg font-black text-white">{currentPlan.name} <span className="text-sm font-normal text-[#6b7db3]">· {fmt(currentPlan.price)}/seat/mo</span></p>
          </div>
        </div>
        {/* TODO: link to /api/billing/portal */}
        <Button variant="ghost" className="text-xs border border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d] gap-1.5">
          <CreditCard className="w-3.5 h-3.5" />Manage Payment
        </Button>
      </div>

      {/* Upgrade plans — only show higher tiers */}
      {upgradePlans.length > 0 && (
        <Section title="Upgrade Plan" description="Unlock more features and higher limits for your team.">
          <div className={cn('grid gap-4', upgradePlans.length === 1 ? 'md:grid-cols-1 max-w-sm' : 'md:grid-cols-2')}>
            {upgradePlans.map(plan => {
              const Icon = planIcons[plan.id] ?? Star;
              return (
                <div key={plan.id} className="bg-[#07112b] border border-[#1e2a4a] hover:border-[#8735C9]/40 rounded-xl p-5 flex flex-col gap-4 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#132353] flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-[#8b9cc8]" /></div>
                    <div>
                      <h3 className="font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-[#6b7db3]">{plan.price === 0 ? 'Free' : `$${plan.price / 100}/seat/mo`}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 flex-1">
                    <Feature ok text={`${plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects} Projects`} />
                    <Feature ok text={`${plan.limits.members === -1 ? 'Unlimited' : plan.limits.members} Members`} />
                    <Feature ok={plan.features.githubAutomation} text="GitHub Automation" />
                    <Feature ok={plan.limits.customRoles > 0} text={`${plan.limits.customRoles} Custom Roles`} />
                    <Feature ok={plan.id !== 'free'} text="Priority Support" />
                    <Feature ok={plan.id === 'enterprise'} text="SSO / SAML" />
                  </ul>
                  <Button
                    onClick={() => console.log('[API TODO] Upgrade to', plan.id)} /* POST /api/billing/subscribe */
                    className="w-full bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 mt-auto shadow"
                  >
                    Upgrade to {plan.name}<ArrowRight className="w-4 h-4" />
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
          <Button variant="ghost" size="sm" onClick={() => console.log('[API TODO] Download all')} className="text-[#6b7db3] hover:text-white border border-[#1e2a4a] hover:bg-[#0f1d3d] gap-1.5 text-xs h-7">
            <Download className="w-3.5 h-3.5" />Download All
          </Button>
        </div>
        <DataTable
          columns={columns} data={paged} totalCount={filtered.length}
          pageIndex={pageIndex} pageSize={PAGE_SIZE} search={search} sorting={sorting}
          onPageChange={setPage} onSearchChange={s => { setSearch(s); setPage(0); }} onSortingChange={setSorting}
        />
      </Section>

      <InvoiceModal invoice={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

// ─── Profile Tab ──────────────────────────────────────────
const ProfileTab = () => {
  const user = demoUsers[0];
  const [name, setName]   = useState(user.name);
  const [email, setEmail] = useState(user.email ?? 'alice@acmecorp.com');
  const [title, setTitle] = useState('Product Manager');
  const [bio, setBio]     = useState('Building great products one sprint at a time.');
  const [tz, setTz]       = useState('Asia/Kolkata');
  const handleSave = () => console.log('[API TODO] POST /api/users/me', { name, email, title, bio, tz });
  return (
    <div className="space-y-6">
      <Section title="Personal Information" description="Your public profile visible to teammates.">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative group">
            <Avatar className="w-20 h-20 border-2 border-[#8735C9]/40">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback className="bg-[#8735C9] text-white text-xl font-bold">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-[#6b7db3] mt-0.5">Owner</p>
            <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs text-[#8735C9] hover:text-white hover:bg-[#132353] px-3 border border-[#8735C9]/30">Change avatar</Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name"><StyledInput value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="Job Title"><StyledInput value={title} onChange={e => setTitle(e.target.value)} /></Field>
          <Field label="Email Address"><StyledInput type="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
          <Field label="Timezone"><StyledInput value={tz} onChange={e => setTz(e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <Field label="Bio" hint="Shown on your member profile.">
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className="w-full bg-[#07112b] border border-[#1e2a4a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4B5578] focus:outline-none focus:border-[#8735C9] focus:ring-1 focus:ring-[#8735C9] transition-colors resize-none" />
            </Field>
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-[#1e2a4a]">
          <Button onClick={handleSave} className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2">
            <Save className="w-4 h-4" />Save Profile
          </Button>
        </div>
      </Section>
    </div>
  );
};

// ─── Workspace Tab ────────────────────────────────────────
const WorkspaceTab = () => {
  const [wsName, setWsName] = useState(demoWorkspace.name);
  const [wsUrl, setWsUrl]   = useState('acmecorp');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  return (
    <div className="space-y-6">
      <Section title="General" description="Basic workspace configuration.">
        <div className="space-y-4">
          <Field label="Workspace Name"><StyledInput value={wsName} onChange={e => setWsName(e.target.value)} /></Field>
          <Field label="Workspace URL" hint="elixir.app/ws/your-url">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6b7db3] flex-shrink-0">elixir.app/ws/</span>
              <StyledInput value={wsUrl} onChange={e => setWsUrl(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
            </div>
          </Field>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-[#1e2a4a]">
          <Button onClick={() => console.log('[API TODO] PATCH /api/workspaces/:id')} className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2">
            <Save className="w-4 h-4" />Save Changes
          </Button>
        </div>
      </Section>
      <div className="bg-[#0C1635] border border-red-500/20 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Delete Workspace</p>
            <p className="text-xs text-[#6b7db3] mt-0.5">Permanently delete this workspace and all its data.</p>
          </div>
          <Button onClick={() => setDeleteOpen(true)} className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white gap-2 flex-shrink-0">
            <Trash2 className="w-4 h-4" />Delete
          </Button>
        </div>
      </div>
      <CustomModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Workspace" description="This action is permanent and cannot be reversed.">
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">All projects, tasks, sprints, and member data will be permanently deleted.</p>
          </div>
          <Field label={`Type "${wsName}" to confirm`}>
            <StyledInput value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder={wsName} />
          </Field>
          <div className="flex gap-2 pt-2">
            <Button disabled={deleteConfirm !== wsName} onClick={() => console.log('[API TODO] DELETE /api/workspaces/:id')} className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-40">Delete Workspace</Button>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

// ─── Security Tab ─────────────────────────────────────────
const SecurityTab = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [twoFaOpen, setTwoFaOpen]     = useState(false);
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const sessions = [
    { device: 'Chrome on macOS',  location: 'Mumbai, India',    last: 'Active now',  current: true  },
    { device: 'Safari on iPhone', location: 'Mumbai, India',    last: '2 hours ago', current: false },
    { device: 'Firefox on Linux', location: 'Bangalore, India', last: '3 days ago',  current: false },
  ];
  return (
    <div className="space-y-6">
      <Section title="Change Password" description="Use a strong, unique password.">
        <div className="space-y-4">
          <Field label="Current Password">
            <div className="relative"><StyledInput type={showCurrent ? 'text' : 'password'} placeholder="••••••••" />
              <button onClick={() => setShowCurrent(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5578] hover:text-white">{showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </Field>
          <Field label="New Password" hint="Minimum 8 characters with at least one number and symbol.">
            <div className="relative"><StyledInput type={showNew ? 'text' : 'password'} placeholder="••••••••" />
              <button onClick={() => setShowNew(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5578] hover:text-white">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </Field>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-[#1e2a4a]">
          <Button onClick={() => console.log('[API TODO] POST /api/auth/change-password')} className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2"><Key className="w-4 h-4" />Update Password</Button>
        </div>
      </Section>
      <Section title="Two-Factor Authentication" description="Add an extra layer of security.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', twoFaEnabled ? 'bg-emerald-500/15' : 'bg-[#132353]')}>
              <Smartphone className={cn('w-5 h-5', twoFaEnabled ? 'text-emerald-400' : 'text-[#6b7db3]')} />
            </div>
            <div><p className="text-sm font-medium text-white">Authenticator App</p><p className="text-xs text-[#6b7db3]">{twoFaEnabled ? '2FA is active' : 'Not configured'}</p></div>
          </div>
          <Button onClick={() => setTwoFaOpen(true)} className={twoFaEnabled ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-[#8735C9] hover:bg-[#6a29a0] text-white'}>
            {twoFaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
        </div>
      </Section>
      <Section title="Active Sessions" description="Devices currently signed in.">
        <div className="divide-y divide-[#1e2a4a]">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#132353] flex items-center justify-center"><Globe className="w-4 h-4 text-[#6b7db3]" /></div>
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-2">{s.device}
                    {s.current && <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full font-semibold">Current</span>}
                  </p>
                  <p className="text-xs text-[#6b7db3]">{s.location} · {s.last}</p>
                </div>
              </div>
              {!s.current && <Button variant="ghost" size="sm" onClick={() => console.log('[API TODO] POST /api/auth/sessions/revoke')} className="text-xs text-red-400 hover:text-white hover:bg-red-500/20 h-7 px-2">Revoke</Button>}
            </div>
          ))}
        </div>
      </Section>
      <div className="flex justify-end">
        <Button className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white gap-2"><LogOut className="w-4 h-4" />Sign Out of All Devices</Button>
      </div>
      <CustomModal isOpen={twoFaOpen} onClose={() => setTwoFaOpen(false)} title={twoFaEnabled ? 'Disable 2FA' : 'Enable 2FA'}>
        <div className="space-y-4">
          {!twoFaEnabled ? (
            <><p className="text-sm text-[#8b9cc8]">Scan this QR code with your authenticator app.</p>
            <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center"><p className="text-xs text-gray-400 text-center p-2">QR Code from API</p></div>
            <Field label="6-digit verification code"><StyledInput placeholder="000000" maxLength={6} /></Field></>
          ) : <p className="text-sm text-[#8b9cc8]">Disabling 2FA makes your account less secure. Are you sure?</p>}
          <div className="flex gap-2">
            <Button onClick={() => { setTwoFaEnabled(p => !p); setTwoFaOpen(false); }} className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white">
              {twoFaEnabled ? 'Confirm Disable' : 'Verify & Enable'}
            </Button>
            <Button variant="outline" onClick={() => setTwoFaOpen(false)} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

// ─── Notifications Tab ────────────────────────────────────
const NotificationsTab = () => {
  const [prefs, setPrefs] = useState({ taskAssigned: true, taskMentioned: true, sprintStart: true, sprintEnd: true, memberJoined: false, weeklyDigest: true, emailEnabled: true, inAppEnabled: true, slackEnabled: false });
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="space-y-6">
      <Section title="Delivery Channels">
        <div className="divide-y divide-[#1e2a4a]">
          <Toggle label="In-App Notifications" description="Show notifications inside the app" checked={prefs.inAppEnabled} onChange={() => toggle('inAppEnabled')} />
          <Toggle label="Email Notifications" description="Receive notifications by email" checked={prefs.emailEnabled} onChange={() => toggle('emailEnabled')} />
          <Toggle label="Slack Integration" description="Forward notifications to Slack" checked={prefs.slackEnabled} onChange={() => toggle('slackEnabled')} />
        </div>
      </Section>
      <Section title="Event Preferences" description="Choose which events notify you.">
        <div className="divide-y divide-[#1e2a4a]">
          <Toggle label="Task Assigned to Me" checked={prefs.taskAssigned} onChange={() => toggle('taskAssigned')} />
          <Toggle label="Mentioned in a Task" checked={prefs.taskMentioned} onChange={() => toggle('taskMentioned')} />
          <Toggle label="Sprint Started" checked={prefs.sprintStart} onChange={() => toggle('sprintStart')} />
          <Toggle label="Sprint Ending Soon" checked={prefs.sprintEnd} onChange={() => toggle('sprintEnd')} />
          <Toggle label="New Member Joined" checked={prefs.memberJoined} onChange={() => toggle('memberJoined')} />
          <Toggle label="Weekly Summary Digest" description="Sent every Monday morning" checked={prefs.weeklyDigest} onChange={() => toggle('weeklyDigest')} />
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-[#1e2a4a]">
          <Button onClick={() => console.log('[API TODO] PATCH /api/users/me/notification-prefs')} className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2"><Save className="w-4 h-4" />Save Preferences</Button>
        </div>
      </Section>
    </div>
  );
};

// ─── Integrations Tab ─────────────────────────────────────
const IntegrationsTab = () => {
  const integrations = [
    { name: 'GitHub',  desc: 'Sync PRs, issues, and commits to tasks.',    connected: true,  icon: '🐙' },
    { name: 'Slack',   desc: 'Send notifications and updates to channels.', connected: false, icon: '💬' },
    { name: 'Figma',   desc: 'Attach design files directly to tasks.',      connected: true,  icon: '🎨' },
    { name: 'Jira',    desc: 'Import and sync issues from Jira projects.',  connected: false, icon: '🔷' },
    { name: 'Notion',  desc: 'Link Notion docs to projects.',               connected: false, icon: '📄' },
    { name: 'Zapier',  desc: 'Connect to thousands of apps via Zapier.',    connected: false, icon: '⚡' },
  ];
  return (
    <div className="space-y-3">
      {integrations.map(int => (
        <div key={int.name} className="bg-[#0C1635] border border-[#1e2a4a] rounded-xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#07112b] border border-[#1e2a4a] flex items-center justify-center text-2xl flex-shrink-0">{int.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">{int.name}</p>
              {int.connected && <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full font-semibold">Connected</span>}
            </div>
            <p className="text-xs text-[#6b7db3] mt-0.5">{int.desc}</p>
          </div>
          <Button size="sm" onClick={() => console.log('[API TODO]', int.connected ? 'Disconnect' : 'Connect', int.name)} className={int.connected ? 'border border-[#1e2a4a] bg-transparent text-[#6b7db3] hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 text-xs' : 'bg-[#8735C9] hover:bg-[#6a29a0] text-white text-xs'}>
            {int.connected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      ))}
    </div>
  );
};

// ─── Usage Tab (extracted from BillingTab) ───────────────
const UsageTab = () => {
  const currentPlan = demoSubscriptions.find(s => s.id === demoWorkspace.subscriptionPlan) ?? demoSubscriptions[1];
  const seatsUsed    = demoWorkspace.members.length;
  const projectsUsed = 2;
  const teamsUsed    = 2;
  const storageUsed  = 52428800; // ~50 MB demo
  return (
    <div className="space-y-6">
      <Section
        title="Usage & Limits"
        description="Seats = active members who can log in and collaborate. Each person using the workspace counts as one seat."
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <UsageMeter label="Projects"            used={projectsUsed}              limit={currentPlan.limits.projects}                icon={FolderKanban} color="#8735C9" />
          <UsageMeter label="Members (Seats)"     used={seatsUsed}                 limit={currentPlan.limits.members}                 icon={Users}        color="#60a5fa" />
          <UsageMeter label="Teams"               used={teamsUsed}                 limit={currentPlan.limits.teams}                   icon={Users}        color="#34d399" />
          <UsageMeter label="Storage"             used={storageUsed / 1048576}     limit={currentPlan.limits.storageBytes / 1048576}  icon={HardDrive}    color="#f59e0b" unit=" MB" />
        </div>
        <p className="text-xs text-[#4B5578] mt-4 pt-4 border-t border-[#1e2a4a]">
          💡 <strong className="text-[#6b7db3]">What is a seat?</strong> A seat is one named user in your workspace. If you have 3 members (Alice, Bob, Charlie), you&apos;re using 3 seats. Removing a member frees a seat immediately.
        </p>
      </Section>
      <Section title="Custom Roles" description="Manage custom roles available in your plan.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#c9d3ed]">Custom Roles Used</p>
            <p className="text-2xl font-black text-white mt-1">{demoWorkspace.customRoles.length} <span className="text-sm font-normal text-[#6b7db3]">/ {currentPlan.limits.customRoles === -1 ? '∞' : currentPlan.limits.customRoles}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#6b7db3]">Plan: {currentPlan.name}</p>
            <p className="text-xs text-[#4B5578] mt-0.5">Upgrade for more roles</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────
const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile',       label: 'Profile',       icon: User       },
  { id: 'workspace',     label: 'Workspace',     icon: Building2  },
  { id: 'security',      label: 'Security',      icon: Shield     },
  { id: 'notifications', label: 'Notifications', icon: Bell       },
  { id: 'integrations',  label: 'Integrations',  icon: Plug       },
  { id: 'usage',         label: 'Usage',         icon: Zap        },
  { id: 'billing',       label: 'Billing',       icon: CreditCard },
];

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabContent: Record<SettingsTab, React.ReactNode> = {
    profile:       <ProfileTab />,
    workspace:     <WorkspaceTab />,
    security:      <SecurityTab />,
    notifications: <NotificationsTab />,
    integrations:  <IntegrationsTab />,
    usage:         <UsageTab />,
    billing:       <BillingTab />,
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[#6b7db3] mt-1">Manage your profile, workspace, and preferences.</p>
      </div>
      <div className="flex gap-6 flex-col md:flex-row">
        <aside className="w-full md:w-48 flex-shrink-0">
          <nav className="bg-[#0C1635] border border-[#1e2a4a] rounded-2xl p-2 space-y-0.5 sticky top-4">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn(
                  'flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active ? 'bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-white shadow-[0_2px_8px_rgba(135,53,201,0.3)]'
                         : 'text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white'
                )}>
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4', active ? 'text-white' : 'text-[#6b7db3]')} />
                    {tab.label}
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/50" />}
                </button>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{tabContent[activeTab]}</div>
      </div>
    </div>
  );
};
