import clsx from 'clsx'

const baseStyles = {
  solid:
    'inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
}

const variantStyles = {
  solid: {
    slate: 'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-800',
    primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400',
    white:
      'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:bg-slate-200 active:text-slate-600 focus-visible:outline-white',
    danger:
      'bg-red-500 text-white border-none hover:bg-red-600 active:bg-red-600 active:text-white focus-visible:outline-white focus:ring-red-400',
  },
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: 'slate' | 'primary' | 'white' | 'danger'
  variant?: 'solid'
}

export function Button({ buttonType = 'primary', variant = 'solid', className, ...props }: Props) {
  const completeClass = clsx(baseStyles[variant], variantStyles[variant][buttonType], className)

  return <button className={completeClass} {...props} />
}
