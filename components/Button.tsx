import clsx from "clsx"
import React, { PropsWithChildren } from "react"
import Spinner from "./icons/Spinner"
import Shadow from "./Shadow"

type ButtonProps = PropsWithChildren & 
    {
        shadow?: boolean,
        loading?: boolean,
        fullWidth?: boolean,

    } & JSX.IntrinsicElements['button']

export default React.forwardRef<HTMLButtonElement, ButtonProps>((
  { shadow = false, loading = false, fullWidth = false, children, className, ...props },
  ref,
) => {
    return (
        <div className={clsx(className, 'round-2xl relative', fullWidth ? 'w-full' : 'w-min')}>
            {shadow && <Shadow className="top-1.5 left-1" />}
            <button
                {...(props as JSX.IntrinsicElements['button'])} 
                disabled={loading}
                className={clsx(
                    fullWidth ? 'w-full' : 'w-min',
                    'bg-dark text-white whitespace-nowrap relative rounded text-lg px-5 py-4 transition-transform font-medium',
                    {
                        'cursor-not-allowed': loading,
                        'hover:-translate-y-1 active:translate-y-0 active:transition-none': shadow && !loading
                    }
                )}
                ref={ref}
            >
                {children}
                {loading && <Spinner className="inline-block align-middle text-white" />}
            </button>
        </div>
    )
})