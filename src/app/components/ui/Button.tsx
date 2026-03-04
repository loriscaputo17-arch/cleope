'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'ghost' | 'glass'
}

export default function Button({
  children,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={clsx(
        'relative rounded-full px-7 py-3 text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-md',
        variant === 'primary' &&
          'bg-white text-black hover:bg-neutral-200',
        variant === 'ghost' &&
          'border border-white/20 text-white hover:bg-white hover:text-black',
        variant === 'glass' &&
          'bg-white/10 border border-white/20 text-white hover:bg-white/20',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}