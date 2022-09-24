import clsx from 'clsx'
import React from 'react'

interface GridProps extends React.PropsWithChildren {
    className?: string
    as?: React.ElementType
}

export default React.forwardRef<HTMLElement, GridProps>(function Grid(
    {children, className, as: Tag = 'div'},
    ref,
  ) {
    return (
      <Tag
        ref={ref}
        className={clsx(
            className,
            'inner grid grid-cols-4 gap-y-6 gap-x-4 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-10'
        )}
      >
          {children}
      </Tag>
    )
  })