'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal, Eye, Ban, CheckCircle, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export type Workspace = {
    id: string
    name: string
    ownerEmail: string
    plan: 'free' | 'pro' | 'enterprice'
    status: 'active' | 'suspended' | 'blocked'
    userCount: number
    createdAt: string
}

export function getWorkspaceColumns(
    openDetailsModal: (id: string) => void,
    openSuspendModal: (workspace: Workspace) => void
): ColumnDef<Workspace>[] {
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
                        Workspace Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const workspace = row.original
                return (
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarFallback className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                                {workspace.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium">{workspace.name}</span>
                    </div>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'ownerEmail',
            header: 'Owner',
            cell: ({ row }) => <span className="text-gray-300">{row.getValue("ownerEmail")}</span>,
        },
        {
            accessorKey: 'plan',
            header: 'Plan',
            cell: ({ row }) => {
                const plan = row.getValue("plan") as string
                let badgeClass = "bg-gray-500"
                if (plan === 'free') badgeClass = "bg-gray-600 text-gray-200"
                if (plan === 'pro') badgeClass = "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                if (plan === 'enterprise') badgeClass = "bg-gradient-to-r from-purple to-purpleDark text-white border border-purple/50"
                
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold shadow-sm capitalize ${badgeClass}`}>
                        {plan}
                    </span>
                )
            },
        },
        {
            accessorKey: 'userCount',
            header: 'Users',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{row.getValue("userCount")}</span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                let badgeClass = "bg-gray-500"
                if (status === 'active') { badgeClass = "bg-gradient-to-r from-green-500 to-green-600" }
                if (status === 'suspended' || status === 'blocked') { badgeClass = "bg-gradient-to-r from-red-500 to-red-600" }

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
                const workspace = row.original

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
                                    onClick={() => openDetailsModal(workspace.id)}
                                    className="cursor-pointer hover:!bg-purple/20 hover:!text-white text-white focus:bg-purple/20 focus:text-white"
                                >
                                    <Eye className="mr-2 h-4 w-4 text-blue-400" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => openSuspendModal(workspace)}
                                    className="cursor-pointer hover:!bg-purple/20 hover:!text-white text-white focus:bg-purple/20 focus:text-white"
                                >
                                    {workspace.status === 'suspended' || workspace.status === 'blocked' ? (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                                            Activate Workspace
                                        </>
                                    ) : (
                                        <>
                                            <Ban className="mr-2 h-4 w-4 text-red-500" />
                                            Suspend Workspace
                                        </>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]
}
