import clsx from "clsx"
import React, { ComponentType, PropsWithChildren, ReactNode } from "react"
import Search from "./icons/Search"
import Shadow from "./Shadow"

type InputProps = PropsWithChildren & 
    {
        shadow?: boolean,
        label?: string,
        showRequired?: boolean,
        icon?: ComponentType | keyof JSX.IntrinsicElements,

    } & (
        ({type: 'textarea'} & JSX.IntrinsicElements['textarea'])
        | JSX.IntrinsicElements['input']
    )

export default React.forwardRef<HTMLInputElement, InputProps>((
  { shadow = false, showRequired = true, icon: Icon, label, children, className, ...props },
  ref,
) => {
  return (
    <div className={className}>
        <div className={clsx('group relative w-full', props.type === 'search' ? 'round-full' : 'round-2xl')}>
            {shadow && <Shadow className="top-1.5 left-1" />}
            <input
                {...(props as JSX.IntrinsicElements['input'])}
                placeholder={label || props.placeholder}
                ref={ref}
                className={clsx(
                    'w-full peer text-lg inherit-case placeholder:normal-case placeholder:font-normal relative transition-all border-black focus:border-primary focus:ring-4 focus:ring-primary/[.2] rounded font-medium', 
                    {
                        'pl-12 pr-5 pb-2.5 pt-3 placeholder:text-dim': props.type === 'search',
                        'pl-11 py-3.5 pr-4 placeholder:text-dim/50': props.type !== 'search' && (Icon || !label),
                        'px-4 pb-2 pt-5 placeholder-shown:pb-3.5 placeholder-shown:pt-3.5 placeholder:text-transparent': props.type !== 'search' && !(Icon || !label),
                        'border-black/[0.2]': !shadow
                    },
                )}
            />
            {props.type === 'search' ? (
                <Search className="w-4 absolute top-1/2 left-5 -translate-y-1/2 -mt-[1px] text-dim peer-focus:text-primary" />
            ) : (Icon ? (
                <Icon className="w-5 absolute top-1/2 left-4 -translate-y-1/2 -mt-[1px] transition-colors text-dim peer-focus:text-primary " />
            ) : (
                <label htmlFor={props.name} className="absolute normal-case whitespace-nowrap pointer-events-none scale-[0.55] text-dim peer-focus:text-primary peer-focus:peer-placeholder-shown:text-dim [&_span]:opacity-0 peer-placeholder-shown:[&_span]:opacity-100 translate-y-[calc(theme(padding.1)*2.25)] peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 left-4 ml-[0.05em] top-0 origin-top-left text-lg transition-all">
                    {label}{props.required && showRequired && <span className="transition-opacity">*</span>}
                    {props.placeholder && <span className="transition-opacity text-dim/50 ml-1">({props.placeholder})</span>}
                </label>
            ))}
        </div>
        {children && (
            <p className={clsx('text-dim leading-snug', shadow ? 'mt-5' : 'mt-2')}>{children}</p>
        )}
    </div>
  )
})

type SelectProps = PropsWithChildren & JSX.IntrinsicElements['select']

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((
    { children, ...props }, ref
) => {
    return (
        <div className="relative inline-block">
            <select
                {...(props as JSX.IntrinsicElements['select'])}
                className="appearance-none bg-transparent border-none opacity-0 absolute inset-0"
            >
                {children}
            </select>
            <label className="relative flex pl-0.5 pr-1 items-baseline text-red-400 border-current leading-extra-tight border-b-4 border-dotted pointer-events-none" htmlFor={props.name}>
                {props.value}
                <svg className="h-[0.7em] ml-1" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 25L9 31L15 25" stroke="currentColor" vectorEffect="non-scaling-stroke" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round"/>
                    <path d="M3 8L9 2L15 8" stroke="currentColor" vectorEffect="non-scaling-stroke" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round"/>
                </svg>            
            </label>
        </div>        
    )
})