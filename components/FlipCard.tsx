import clsx from "clsx"
import type { ReactNode } from "react"
import Arrow from "./icons/Arrow"
import Shadow from "./Shadow"

interface FlipCardProps {
    className?: string,
    flipped: boolean,
    complete: boolean,
    front: ReactNode,
    back: ReactNode,
    onFlip?: () => any
}

export default ({
    className,
    flipped = false,
    complete = false,
    front, back,
    onFlip
}: FlipCardProps) => (
    <div className={clsx('flipcard relative round-2xl perspective-1400', className)}>
        <Shadow className="top-1 left-1 -bottom-4 -right-4 clip-[inset(0_theme(space.3)_theme(space.2)_0_round_var(--round))] {flipping ? 'animate-flipcard-shadow' : ''}" />
        <div className={clsx(
            'overlap transform-3d motion-safe:transition-transform motion-safe:duration-[600ms]',
            { 'rotate-y-[-180deg]': flipped }
        )}>
            <div className={clsx('backface-hidden bg-white relative motion-safe:transition-transform duration-[600ms] rounded p-10 border', { 'translate-z-1': flipped })}>
                {front}
            </div>
            <div className="backface-hidden bg-white relative rounded p-10 border rotate-y-180">
                <div className="absolute transition-[clip-path] inset-0 rounded border-t-primary border-t-4 {complete ? 'clip-[inset(0_0_0_0)]' : 'clip-[inset(0_50%_0_0)]'}" />
                {back}
                <button className="absolute top-6 left-5"><Arrow className="h-4 transition-transform hover:-translate-x-0.5" /></button>
                <div role="presentation" className={clsx('motion-reduce:hidden shade absolute transition-opacity duration-[600ms] pointer-events-none inset-0 bg-gradient-to-r from-black/30 to-black/60', { 'opacity-0': flipped })} />
            </div>
        </div>
    </div>
)