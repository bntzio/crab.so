interface Props {
  children: React.ReactNode
}

export const MainLayout = ({ children }: Props) => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">{children}</div>
  </div>
)
