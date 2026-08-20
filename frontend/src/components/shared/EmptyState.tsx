interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-400">{description}</p>}
      {action}
    </div>
  );
}