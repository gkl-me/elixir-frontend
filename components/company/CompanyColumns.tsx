'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal, Eye, Mail } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type Company = {
    id: string
    name: string
    email: string
    status: 'active' | 'pending' | 'blocked'
    logo?: string
    description?: string
    website?: string
    phone?: string
}

export function getCompanyColumns(
    openDetailsModal: (id: string) => void
): ColumnDef<Company>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold text-white hover:text-purple-300 hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Company Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const company = row.original
                return (
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage src={company?.logo} />
                            <AvatarFallback className="w-8 h-8 rounded-md bg-gradient-to-br from-purple to-purpleDark flex items-center justify-center text-white font-medium text-sm">
                                {company.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-white font-medium">{company.name}</span>
                        </div>
                    </div>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'email',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold text-white hover:text-purple-300 hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Contact Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-white/90">{row.getValue("email")}</span>
                    </div>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue("status") as string

                let badgeClass = "bg-gray-500"
                if (status === 'active') {return badgeClass = "bg-gradient-to-r from-green-500 to-green-600"}
                if (status === 'blocked') {return badgeClass = "bg-gradient-to-r from-red-500 to-red-600"}
                if (status === 'pending') {return badgeClass = "bg-gradient-to-r from-yellow-500 to-yellow-600"}

                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm capitalize ${badgeClass}`}>
                        {status}
                    </span>
                )
            }
        },
        {
            id: "actions",
            header: 'Actions',
            cell: ({ row }) => {
                const company = row.original

                return (
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 bg-blueDark/50 border-purple/30 border hover:!bg-purple/20 hover:text-white transition-all duration-200"
                                >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4 text-white" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-navy border border-purple/30 text-white shadow-xl">
                                <DropdownMenuItem
                                    onClick={() => openDetailsModal(company.id)}
                                    className="cursor-pointer hover:!bg-purple/20 hover:!text-white text-white focus:bg-purple/20 focus:text-white"
                                >
                                    <Eye className="mr-2 h-4 w-4 text-blue-400" />
                                    View Details
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]
}
