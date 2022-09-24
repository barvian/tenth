import clsx from "clsx"

export default ({ className }: { className?: string}) => (
    <div role="presentation" className={clsx('rounded absolute bg-svg-shadow-black bg-repeat min-w-full min-h-full', className)} />
)