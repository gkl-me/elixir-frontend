'use client';

import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PERMISSION_GROUPS, ROLE_PRESETS } from './shared';

interface RoleFormProps {
  initialName?: string;
  initialPerms?: string[];
  onSave: (name: string, perms: string[]) => void;
  onClose: () => void;
  saveLabel?: string;
}

export const RoleForm = ({
  initialName = '',
  initialPerms = [...ROLE_PRESETS.member],
  onSave,
  onClose,
  saveLabel = 'Create Role',
}: RoleFormProps) => {
  const [name,   setName]   = useState(initialName);
  const [perms,  setPerms]  = useState<string[]>(initialPerms);
  const [preset, setPreset] = useState<'blank' | 'member' | 'admin'>('member');
  const [err,    setErr]    = useState('');

  const toggle = (id: string) =>
    setPerms(ps => ps.includes(id) ? ps.filter(p => p !== id) : [...ps, id]);

  const applyPreset = (p: 'blank' | 'member' | 'admin') => {
    setPreset(p);
    setPerms(p === 'blank' ? [] : [...ROLE_PRESETS[p]]);
  };

  const handleSave = () => {
    if (!name.trim()) { setErr('Role name is required'); return; }
    onSave(name, perms);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-y-auto max-h-[65vh] pr-1 space-y-5">

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">
            Role Name *
          </label>
          <input
            value={name}
            onChange={e => { setName(e.target.value); setErr(''); }}
            placeholder="e.g. Guest Developer"
            className={cn(
              'w-full bg-[#07112b] border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors',
              err ? 'border-red-400/50' : 'border-[#1e2a4a] focus:border-[#8735C9]'
            )}
          />
          {err && <p className="text-red-400 text-[11px] mt-1">{err}</p>}
        </div>

        {/* Preset selector */}
        <div>
          <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">
            Start From
          </label>
          <div className="flex gap-2">
            {(['blank', 'member', 'admin'] as const).map(p => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={cn(
                  'flex-1 py-2 rounded-xl border text-xs font-semibold capitalize transition-all',
                  preset === p
                    ? 'border-[#8735C9] bg-[#8735C9]/15 text-[#c084fc]'
                    : 'border-[#1e2a4a] text-[#6b7db3] hover:border-[#293d6b] hover:text-white bg-[#07112b]'
                )}
              >
                {p === 'blank' ? 'Blank' : p === 'member' ? 'Member' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#8b9cc8] uppercase tracking-wider">
              Permissions
            </label>
            <span className="text-[10px] text-[#c084fc] font-semibold">{perms.length} selected</span>
          </div>
          <div className="space-y-4">
            {PERMISSION_GROUPS.map(g => (
              <div key={g.group}>
                <p className="text-[10px] font-bold text-[#4B5578] uppercase tracking-widest mb-2">
                  {g.group}
                </p>
                <div className="space-y-1">
                  {g.items.map(item => {
                    const on = perms.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all',
                          on ? 'border-[#8735C9]/50 bg-[#8735C9]/08' : 'border-[#1e2a4a] hover:border-[#293d6b]'
                        )}
                      >
                        <div className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                          on ? 'bg-[#8735C9] border-[#8735C9]' : 'border-[#293d6b]'
                        )}>
                          {on && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-medium', on ? 'text-white' : 'text-[#8b9cc8]')}>
                            {item.label}
                          </p>
                          <p className="text-[10px] text-[#4B5578]">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 pt-2 border-t border-[#1e2a4a]">
        <Button
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold"
        >
          <Shield className="w-4 h-4" />{saveLabel}
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
