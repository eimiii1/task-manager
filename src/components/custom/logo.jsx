export function Logo({ scale }) {
    const scaleClass = {
        50: 'scale-50',
        75: 'scale-75',
        100: 'scale-100',
        125: 'scale-125',
        150: 'scale-150',
        175: 'scale-175',
        200: 'scale-200',
        225: 'scale-225',
    }[scale] || 'scale-100'

    return (
        <div className={`flex gap-1 ${scaleClass}`}>
            <span
                className="text-xl"
            >Noto</span>
            <span
                className={`mt-4 block h-1.5 w-1.5 rounded-full bg-[#ef4444]`}
            ></span>
        </div>
    )
}