"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
    ...props
}: PaginationProps) {
    return (
        <div className={cn("flex items-center justify-center py-4", className)} {...props}>
            <div className="flex items-center space-x-2">
                <Button
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || totalPages === 0}
                    className="bg-navy/50 border-purple/30 text-white hover:bg-purple/20 
                    hover:border-purple disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />Previous
                </Button>
                <div className="flex items-center space-x-1">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple to-purpleDark 
                        text-white text-sm font-medium rounded-md">
                        {currentPage}
                    </span>
                    {totalPages > 0 && (
                        <span className="text-gray-400 text-sm font-medium">
                            of {totalPages}
                        </span>
                    )}
                </div>
                <Button
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || totalPages === 0}
                    className="bg-navy/50 border-purple/30 text-white hover:bg-purple/20 
                    hover:border-purple disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300"
                >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}
