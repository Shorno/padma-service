"use client"

import * as React from "react"
import { toast } from "sonner"
import { Trash2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader } from "lucide-react"
import deleteService from "@/app/(admin)/admin/dashboard/services/actions/delete-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface DeleteServiceDialogProps {
    serviceId: number
    serviceName: string
}

export default function DeleteServiceDialog({ serviceId, serviceName }: DeleteServiceDialogProps) {
    const [open, setOpen] = React.useState(false)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: number) => deleteService(id),
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 401:
                        toast.error("You are not authorized to perform this action.")
                        break
                    case 404:
                        toast.error("Service not found.")
                        break
                    default:
                        toast.error(result.error || "Failed to delete service.")
                }
                return
            }
            queryClient.invalidateQueries({ queryKey: ['admin-services'] })
            toast.success(result.message)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred while deleting the service.")
        },
    })

    const handleDelete = () => {
        mutation.mutate(serviceId)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete {serviceName}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the service
                        from your listing.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-semibold text-destructive mb-1">Warning</p>
                        <p className="text-muted-foreground">
                            All associated service data, including images, will be permanently deleted.
                        </p>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={mutation.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Service
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
