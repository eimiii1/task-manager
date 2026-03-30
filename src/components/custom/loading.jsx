import { Loader2 } from "lucide-react";
import { Logo } from "./logo";

export function Loading() {
    return (
        <div
        className="w-screen h-screen flex flex-col gap-6 justify-center items-center overflow-hidden z-40"
        >
            <Logo scale={225} />
            <Loader2
            size={28}
            className="animate-spin"
            />
        </div>
    )
}