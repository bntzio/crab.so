export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const isProd = process.env.NODE_ENV === 'production'
