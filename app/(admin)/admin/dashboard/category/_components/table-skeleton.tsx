import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface CategoryTableSkeletonProps {
    columns?: number
    rows?: number
    showHeader?: boolean
}

export default function TableSkeleton({
    columns = 4,
    rows = 5,
    showHeader = true,
}: CategoryTableSkeletonProps) {
    return (
        <div className="w-full space-y-4">
            {/* Header skeleton */}
            {showHeader && (
                <div className="flex items-center gap-3 pb-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            )}

            {/* Filter and button skeleton */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Skeleton className="h-10 w-full sm:max-w-sm" />
                <Skeleton className="h-10 w-full sm:w-[140px]" />
            </div>

            {/* Desktop Table skeleton */}
            <div className="hidden md:block rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {Array.from({ length: columns }).map((_, index) => (
                                <TableHead key={index}>
                                    <Skeleton className="h-4 w-[80px]" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-10 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card skeleton */}
            <div className="md:hidden space-y-3">
                {Array.from({ length: rows }).map((_, index) => (
                    <div key={index} className="rounded-lg border bg-card shadow-sm p-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-14 rounded-full shrink-0" />
                            <Skeleton className="h-8 w-8 rounded shrink-0" />
                            <Skeleton className="h-8 w-8 rounded shrink-0" />
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
