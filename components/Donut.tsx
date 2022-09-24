import { useEffect, useMemo } from "react"
import {motion, MotionValue, useMotionTemplate, useMotionValue, useSpring, useTransform} from 'framer-motion'

interface DonutProps {
    className?: string,
    percent: number | string
}

const getXForPercent = (p: number) => Math.cos(2 * Math.PI * p)
const getYForPercent = (p: number) => Math.sin(2 * Math.PI * p)

export default function({ className, ...props }: DonutProps) {
    const percent = useSpring(0.005)
    useEffect(() => 
        percent.set(typeof props.percent === 'string' ? (+props.percent)/100 : props.percent),
        [props.percent]
    )

    const h = useMotionValue(0.675) // radius of hole as percentage of outer circle
    
    const startX = useMotionValue(getXForPercent(0))
    const startY = useMotionValue(getYForPercent(0))
    const startXInner = useTransform([startX, h], ([x, h]: number[]) => x * h)
    const startYInner = useTransform([startY, h], ([y, h]: number[]) => y * h)
    const largeArcFlag = useTransform(percent, p => p > 0.5 ? 1 : 0)
    const endX = useTransform(percent, getXForPercent)
    const endY = useTransform(percent, getYForPercent)
    const endXInner = useTransform([endX, h], ([x, h]: number[]) => x * h)
    const endYInner = useTransform([endY, h], ([y, h]: number[]) => y * h)
    
    const outlineStartX = useTransform(percent, p => getXForPercent(p + 0.01))
    const outlineStartY = useTransform(percent, p => getYForPercent(p + 0.01))
    const outlineStartXInner = useTransform([outlineStartX, h], ([x, h]: number[]) => x * h)
    const outlineStartYInner = useTransform([outlineStartY, h], ([y, h]: number[]) => y * h)
    const outlineLargeArcFlag = useTransform(largeArcFlag, l => l ? 0 : 1)
    const outlineEndX = useMotionValue(getXForPercent(0.99))
    const outlineEndY = useMotionValue(getYForPercent(0.99))
    const outlineEndXInner = useTransform([outlineEndX, h], ([x, h]: number[]) => x * h)
    const outlineEndYInner = useTransform([outlineEndY, h], ([y, h]: number[]) => y * h)

    // https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/
    const fillPath = useMotionTemplate`
        M ${startX} ${startY}
        A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}
        L ${endXInner} ${endYInner}
        A ${h} ${h} 0 ${largeArcFlag} 0 ${startXInner} ${startYInner} z
    `
    
    const outlinePath = useMotionTemplate`
        M ${outlineStartX} ${outlineStartY}
        A 1 1 0 ${outlineLargeArcFlag} 1 ${outlineEndX} ${outlineEndY}
        L ${outlineEndXInner} ${outlineEndYInner}
        A ${h} ${h} 0 ${outlineLargeArcFlag} 0 ${outlineStartXInner} ${outlineStartYInner} z
    `
    
    return (
        <div className={className}>
            <svg className="w-full -scale-x-100 rotate-90" viewBox="-1 -1 2 2">
                <defs>
                    <radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0px" cy="0px" r="1px">
                    <stop offset={h.get()*100+'%'} stopColor="#FD7660"/>
                    <stop offset="100%" stopColor="#FEDDBE"/>
                    </radialGradient>
                </defs>
                <motion.path
                    d={outlinePath}
                    fill="#FFEDDF"
                />
                <motion.path
                    d={fillPath}
                    fill="url(#grad)"
                />
            </svg>
            <svg className="absolute overflow-visible top-0 left-0 w-full -scale-x-100 rotate-90 -translate-x-1.5 -translate-y-1.5" viewBox="-1 -1 2 2">
                <motion.path
                    d={fillPath}
                    fill="none" stroke="black" strokeWidth="1px" vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    )
}