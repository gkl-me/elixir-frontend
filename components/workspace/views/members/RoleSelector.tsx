'use client';

import React from 'react';
import { Shield, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleOption { id: string; label: string; desc: string; }

interface RoleSelectorProps {
  roles: RoleOption[];
  value: string;
  onChange: (id: string) => void;
}

export const RoleSelector = ({ roles, value, onChange }: RoleSelectorProps) => (
  <div className="space-y-1.5">
    {roles.map(r => {
      const sel = value === r.id;
      return (
        <button
          key={r.id}
          type="button"
          onClick={() => onChange(r.id)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all',
            sel ? 'border-[#8735C9] bg-[#8735C9]/10' : 'border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]'
          )}
        >
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', sel ? 'bg-[#8735C9]/20' : 'bg-[#132353]')}>
            <Shield className={cn('w-3.5 h-3.5', sel ? 'text-[#c084fc]' : 'text-[#6b7db3]')} />
          </div>
          <div className="flex-1">
            <p className={cn('text-xs font-semibold', sel ? 'text-white' : 'text-[#8b9cc8]')}>{r.label}</p>
            <p className="text-[10px] text-[#4B5578]">{r.desc}</p>
          </div>
          {sel && <Check className="w-3.5 h-3.5 text-[#c084fc]" />}
        </button>
      );
    })}
  </div>
);
