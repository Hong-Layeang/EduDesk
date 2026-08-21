export function EmptyStudentsIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="60" cy="58" r="52" fill="#EFF6FF" />
      <rect x="32" y="30" width="46" height="58" rx="8" fill="white" stroke="#BFDBFE" strokeWidth="2" />
      <rect x="40" y="42" width="30" height="4" rx="2" fill="#93C5FD" />
      <rect x="40" y="52" width="22" height="4" rx="2" fill="#DBEAFE" />
      <rect x="40" y="62" width="26" height="4" rx="2" fill="#DBEAFE" />
      <rect x="40" y="72" width="18" height="4" rx="2" fill="#DBEAFE" />
      <circle cx="80" cy="78" r="17" fill="#2563EB" />
      <circle cx="77" cy="75" r="6" fill="none" stroke="white" strokeWidth="2.4" />
      <path d="M81 79l5 5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}