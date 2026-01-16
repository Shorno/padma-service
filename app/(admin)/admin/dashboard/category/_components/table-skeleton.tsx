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
}

export default function TableSkeleton({
    columns = 4,
    rows = 5,
}: CategoryTableSkeletonProps) {
    return (
        <div className="w-full space-y-4">
            {/* Filter and button skeleton */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Skeleton className="h-10 w-full sm:max-w-sm" />
                <Skeleton className="h-10 w-full sm:w-[120px]" />
            </div>

            {/* Desktop Table skeleton */}
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, index) => (
                                <TableHead key={index}>
                                    <Skeleton className="h-4 w-[100px]" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-12 w-full" />
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
                    <div key={index} className="rounded-lg border bg-card p-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <Skeleton className="h-5 flex-1" />
                            <Skeleton className="h-8 w-8 rounded" />
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
