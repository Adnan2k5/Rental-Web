import React from 'react'

export const GridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden border border-gray-100"
                >
                    <div className="relative h-48 bg-gray-100">
                        <Skeleton className="w-full h-full" />
                        <div className="absolute top-3 right-3 flex space-x-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="absolute bottom-3 left-3">
                            <Skeleton className="h-5 w-20 rounded-md" />
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <Skeleton className="h-6 w-6 rounded-full mr-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-5/6 mb-3" />
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-16" />
                            <div className="flex space-x-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};