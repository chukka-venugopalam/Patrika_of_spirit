export interface EmptyStateProps {
  icon?: React.ReactNode
  heading: string
  subtext: string
}

export default function EmptyState({ icon, heading, subtext }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon ? <div className="mb-3">{icon}</div> : null}
      <h3 className="text-sm font-semibold text-slate-900">{heading}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{subtext}</p>
    </div>
  )
}
