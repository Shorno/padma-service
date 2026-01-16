import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface ServiceTableSkeletonProps {
    rows?: number
}

export default function ServiceTableSkeleton({
    rows = 5,
}: ServiceTableSkeletonProps) {
    return (
        <div className="w-full space-y-4">
            {/* Filter and button skeleton */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Skeleton className="h-10 w-full sm:max-w-sm" />
                <Skeleton className="h-10 w-full sm:w-[140px]" />
            </div>

            {/* Desktop Table skeleton */}
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                <TableCell>
                                    <Skeleton className="h-16 w-16 rounded-md" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-32" />
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-12 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1 justify-center">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card skeleton */}
            <div className="md:hidden space-y-3">
                {Array.from({ length: rows }).map((_, index) => (
                    <div key={index} className="rounded-lg border bg-card p-3">
                        <div className="flex gap-3">
                            <Skeleton className="h-20 w-20 rounded-md shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <Skeleton className="h-5 w-32" />
                                    <div className="flex gap-1">
                                        <Skeleton className="h-7 w-7" />
                                        <Skeleton className="h-7 w-7" />
                                        <Skeleton className="h-7 w-7" />
                                    </div>
                                </div>
                                <Skeleton className="h-3 w-24" />
                                <div className="flex gap-2 pt-1">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-[70px]" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    )
}
