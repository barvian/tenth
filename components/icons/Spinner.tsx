import clsx from "clsx"

export default ({ className }: { className?: string}) => (
    <svg className={clsx(className, 'animate-spin h-5 w-5')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeDasharray="{0.1 * 2*Math.PI*10} {2*Math.PI*10}" strokeWidth="4"></circle>
    </svg>
)