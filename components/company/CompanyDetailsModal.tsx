"use client";

import React from "react";
import { Building2, Mail, Phone, Globe, Layers, Users } from "lucide-react";
import { CustomModal } from "@/components/modal/CustomModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Company } from "./CompanyColumns";

interface CompanyDetailsModalProps {
  isOpen: boolean;
  company: Company | null;
  onClose: () => void;
}

export function CompanyDetailsModal({
  isOpen,
  company,
  onClose,
}: CompanyDetailsModalProps) {
  if (!company) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Company Details"
      description={`Overview for ${company.name}`}
      className="sm:max-w-lg"
    >
      <div className="space-y-4">
        {/* Header Profile */}
        <div className="flex items-center gap-3.5 rounded-xl border border-[#1e2a4a] bg-[#07112b] p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={company.logo} />
            <AvatarFallback className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] text-base font-bold text-white">
              {company.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-white">{company.name}</h3>
            <p className="truncate text-xs text-[#6b7db3]">{company.email}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
              company.status === "active"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                : "bg-red-500/15 border border-red-500/30 text-red-400"
            }`}
          >
            {company.status || "Active"}
          </span>
        </div>

        {/* Details Grid: Name, Email, Type, Size, Phone, Website */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Name */}
          <div className="rounded-xl border border-[#1e2a4a] bg-[#0c1635] p-3">
            <div className="flex items-center gap-1.5 text-[#6b7db3]">
              <Building2 className="h-3.5 w-3.5" />
              <span className="font-medium">Company Name</span>
            </div>
            <p className="mt-1 truncate font-semibold text-white">{company.name}</p>
          </div>

          {/* Email */}
          <div className="rounded-xl border border-[#1e2a4a] bg-[#0c1635] p-3">
            <div className="flex items-center gap-1.5 text-[#6b7db3]">
              <Mail className="h-3.5 w-3.5" />
              <span className="font-medium">Email Address</span>
            </div>
            <p className="mt-1 truncate font-semibold text-white">{company.email}</p>
          </div>

          {/* Type */}
          <div className="rounded-xl border border-[#1e2a4a] bg-[#0c1635] p-3">
            <div className="flex items-center gap-1.5 text-[#6b7db3]">
              <Layers className="h-3.5 w-3.5" />
              <span className="font-medium">Company Type</span>
            </div>
            <p className="mt-1 truncate font-semibold capitalize text-white">
              {company.type || "N/A"}
            </p>
          </div>

          {/* Size */}
          <div className="rounded-xl border border-[#1e2a4a] bg-[#0c1635] p-3">
            <div className="flex items-center gap-1.5 text-[#6b7db3]">
              <Users className="h-3.5 w-3.5" />
              <span className="font-medium">Company Size</span>
            </div>
            <p className="mt-1 truncate font-semibold text-white">
              {company.size ? `${company.size} employees` : "N/A"}
            </p>
          </div>

          {/* Phone */}
          <div className="rounded-xl border border-[#1e2a4a] bg-[#0c1635] p-3">
            <div className="flex items-center gap-1.5 text-[#6b7db3]">
              <Phone className="h-3.5 w-3.5" />
              <span className="font-medium">Phone Number</span>
            </div>
            <p className="mt-1 truncate font-semibold text-white">
              {company.phone || "N/A"}
            </p>
          </div>

          {/* Website */}
          <div className="rounded-xl border border-[#1e2a4a] bg-[#0c1635] p-3">
            <div className="flex items-center gap-1.5 text-[#6b7db3]">
              <Globe className="h-3.5 w-3.5" />
              <span className="font-medium">Website</span>
            </div>
            {company.website ? (
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate font-semibold text-purple-400 hover:underline"
              >
                {company.website}
              </a>
            ) : (
              <p className="mt-1 font-semibold text-white">N/A</p>
            )}
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
