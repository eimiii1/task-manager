import { Search } from "lucide-react";
import { Input } from "../ui/input";

export function SearchBar({ classname }) {
    return (
        <div className={classname}>
            <Search className="absolute top-1/2 ring-0 outline-0 opacity-50 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                className='pl-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none'
                placeholder="Search..."
            />
        </div>
    )
}