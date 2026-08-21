interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      {icon && <div className="flex items-center justify-center">{icon}</div>}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mx-auto max-w-[240px] text-sm text-slate-400">{description}</p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}