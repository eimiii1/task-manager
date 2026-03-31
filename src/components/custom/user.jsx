import { Skeleton } from "../ui/skeleton"

export function UserSkeleton() {
    return (
        <div className='flex items-center gap-4'>
            <Skeleton className='h-8 w-8 rounded-full' />
            <div className="space-y-2">
                <Skeleton className='h-2 w-16' />
                <Skeleton className='h-2 w-16' />
            </div>
        </div>
    )
}

import { User2 } from "lucide-react"
import { Avatar, AvatarFallback } from "../ui/avatar"

export function UserData({ userdata, className }) {
    return (
        <>
            {!userdata ? <UserSkeleton /> : (
                <div className={className}>
                    <Avatar className='rounded-full'>
                        <AvatarFallback className='rounded-full'>
                            <User2 className="size-4" />
                        </AvatarFallback>
                    </Avatar>
                    <span
                        className="font-medium opacity-40"
                    >
                        {userdata?.username}
                    </span>
                </div>
            )
            }
        </>
    )
}