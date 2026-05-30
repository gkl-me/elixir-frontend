'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal, UserX, UserCheck, Mail } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type User = {
    id: string
    name: string
    email: string
    isBlocked: boolean
    role?: 'user' | 'company'
    image?: string
}

export function getUserColumns(
    handleToggleBlock: (id: string) => void
): ColumnDef<User>[] {
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
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage src={user?.image} />
                            <AvatarFallback className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-purpleDark flex items-center justify-center text-white font-medium text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium">{user.name}</span>
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
                        Email
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
            accessorKey: 'isBlocked',
            header: 'Status',
            cell: ({ row }) => {
                const isBlocked = row.getValue("isBlocked") as boolean
                return (
                    <div className="flex items-center">
                        {isBlocked ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
                                <UserX className="w-3 h-3 mr-1" />
                                Blocked
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Active
                            </span>
                        )}
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: 'Actions',
            cell: ({ row }) => {
                const user = row.original

                const toggleBlock = () => {
                    handleToggleBlock(user.id)
                }

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
                            <DropdownMenuContent align="end" className="w-56 bg-navy border border-purple/30 text-white shadow-xl">
                                <DropdownMenuItem
                                    onClick={toggleBlock}
                                    className="cursor-pointer hover:!bg-purple/20 hover:!text-white text-white focus:bg-purple/20 focus:text-white"
                                >
                                    {user.isBlocked ? (
                                        <>
                                            <UserCheck className="mr-2 h-4 w-4 text-green-400" />
                                            Unblock User
                                        </>
                                    ) : (
                                        <>
                                            <UserX className="mr-2 h-4 w-4 text-yellow-400" />
                                            Block User
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
