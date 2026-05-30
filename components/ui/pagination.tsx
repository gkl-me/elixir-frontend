"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  return (
    <div
      className={cn("flex items-center justify-center py-4", className)}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || totalPages === 0}
          className="border-purple/30 bg-navy/50 text-white transition-all duration-300 hover:border-purple hover:bg-purple/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          <span className="rounded-md bg-gradient-to-r from-purple to-purpleDark px-3 py-1 text-sm font-medium text-white">
            {currentPage}
          </span>
          {totalPages > 0 && (
            <span className="text-sm font-medium text-gray-400">
              of {totalPages}
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="border-purple/30 bg-navy/50 text-white transition-all duration-300 hover:border-purple hover:bg-purple/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
