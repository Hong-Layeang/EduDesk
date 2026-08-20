interface WelcomeBannerProps {
  name: string;
  academicYear: string;
  avatarUrl: string;
}

export function WelcomeBanner({ name, academicYear, avatarUrl }: WelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-b-3xl bg-linear-to-br from-blue-600 to-blue-700 px-5 pb-8 pt-6 text-white">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://picsum.photos/seed/edudesk-classroom/800/500"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-blue-700/40 to-blue-700/80" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-blue-100">សូមស្វាគមន៍មកវិញ</p>
          <h1 className="text-2xl font-bold leading-tight">{name}</h1>
          <p className="text-sm text-blue-100">{academicYear}</p>
        </div>
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/70">
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}