"use client";

import React, { useState } from "react";
import { CustomModal } from "@/components/modal/CustomModal";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, Users, Briefcase } from "lucide-react";

export interface ICompanyDetailsForm {
  name: string;
  email: string;
  phone: string;
  size: number;
  type: string;
}

interface CompanyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ICompanyDetailsForm) => Promise<void>;
  isLoading: boolean;
  planName: string;
}

export const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  planName,
}) => {
  const [formData, setFormData] = useState<ICompanyDetailsForm>({
    name: "",
    email: "",
    phone: "",
    size: 10,
    type: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "size" ? Number(value) || 0 : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; phone?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Company email is required.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Company phone number is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upgrade to ${planName}`}
      description="Please enter your company details to complete your upgrade."
      className="sm:max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-300">
            Company Name <span className="text-red-400">*</span>
          </label>
          <div className="relative mt-1">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-purple" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Acme Inc."
              className="w-full rounded-xl border border-white/10 bg-navy/80 py-2 pl-9 pr-3 text-sm text-white focus:border-purple focus:outline-none"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Company Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-300">
            Company Email <span className="text-red-400">*</span>
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-purple" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@acme.com"
              className="w-full rounded-xl border border-white/10 bg-navy/80 py-2 pl-9 pr-3 text-sm text-white focus:border-purple focus:outline-none"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Company Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-300">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-purple" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-xl border border-white/10 bg-navy/80 py-2 pl-9 pr-3 text-sm text-white focus:border-purple focus:outline-none"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        {/* Size & Type */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Company Size */}
          <div>
            <label className="block text-xs font-semibold text-gray-300">
              Company Size
            </label>
            <div className="relative mt-1">
              <Users className="absolute left-3 top-3 h-4 w-4 text-purple" />
              <input
                type="number"
                name="size"
                value={formData.size || ""}
                onChange={handleChange}
                placeholder="e.g. 25"
                min={1}
                className="w-full rounded-xl border border-white/10 bg-navy/80 py-2 pl-9 pr-3 text-sm text-white focus:border-purple focus:outline-none"
              />
            </div>
          </div>

          {/* Company Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-300">
              Company Type
            </label>
            <div className="relative mt-1">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-purple" />
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="e.g. Technology"
                className="w-full rounded-xl border border-white/10 bg-navy/80 py-2 pl-9 pr-3 text-sm text-white focus:border-purple focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-purple font-semibold text-white hover:bg-purple/90"
          >
            {isLoading ? "Redirecting..." : "Proceed to Payment"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};
