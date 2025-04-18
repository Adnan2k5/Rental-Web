import React from 'react'

export const CategorySkeleton = () => {
    return (
        <div className="flex space-x-3 pb-2 overflow-x-auto">
            <Skeleton className="h-9 w-32 rounded-full" />
            {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-9 w-28 rounded-full" />
            ))}
        </div>
    );
};
