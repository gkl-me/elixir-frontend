'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ArrowUpDown, MoreHorizontal, Eye, UserX, UserCheck, Mail, Shield, Trash2, Edit, Copy } from 'lucide-react'

export type User = {
    id: string
    name: string
    email: string
    isBlocked: boolean
    role?: 'admin' | 'user' | 'manager'
    createdAt?: string
    lastActive?: string
    avatar?: string
}

export const columns: ColumnDef<User>[] = [
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-purpleDark flex items-center justify-center text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-white">{user.name}</div>
                        {user.role && (
                            <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                        )}
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
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.original.role || 'user'
            const roleConfig = {
                admin: { color: 'from-red-500 to-red-600', icon: Shield, text: 'Admin' },
                manager: { color: 'from-blue-500 to-blue-600', icon: UserCheck, text: 'Manager' },
                user: { color: 'from-gray-500 to-gray-600', icon: UserCheck, text: 'User' }
            }
            const config = roleConfig[role as keyof typeof roleConfig]
            const Icon = config.icon

            return (
                <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${config.color} text-white shadow-sm`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config.text}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: 'isBlocked',
        header: 'Status',
        cell: ({ row }) => {
            const isBlocked = row.getValue("isBlocked") as boolean
            return (
                <div className="flex items-center justify-center">
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
        accessorKey: 'lastActive',
        header: 'Last Active',
        cell: ({ row }) => {
            const lastActive = row.original.lastActive
            if (!lastActive) return <span className="text-gray-500">Never</span>
            
            return (
                <div className="text-white/80 text-sm">
                    {lastActive}
                </div>
            )
        }
    },
    {
        id: "actions",
        header: 'Actions',
        cell: ({ row }) => {
            const user = row.original

            const handleCopyId = () => {
                navigator.clipboard.writeText(user.id)
                // You can add a toast notification here
                console.log('User ID copied:', user.id)
            }

            const handleViewUser = () => {
                console.log('View user:', user.id)
                // Navigate to user detail page
            }

            const handleEditUser = () => {
                console.log('Edit user:', user.id)
                // Open edit modal or navigate to edit page
            }

            const handleToggleBlock = () => {
                console.log('Toggle block status for user:', user.id)
                // API call to toggle block status
            }

            const handleDeleteUser = () => {
                console.log('Delete user:', user.id)
                // Show confirmation dialog then delete
            }

            const handleSendEmail = () => {
                console.log('Send email to:', user.email)
                // Open email composer or send notification
            }

            return (
                <div className="flex items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-white hover:bg-purple/20 hover:text-purple-300 transition-all duration-200"
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple to-purpleDark flex items-center justify-center text-white text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span>User Actions</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={handleCopyId} className="cursor-pointer">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy User ID
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={handleViewUser} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={handleEditUser} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={handleSendEmail} className="cursor-pointer">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                                onClick={handleToggleBlock} 
                                className="cursor-pointer"
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
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                                onClick={handleDeleteUser} 
                                className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]