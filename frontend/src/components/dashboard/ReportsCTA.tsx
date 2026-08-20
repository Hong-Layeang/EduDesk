interface ReportsCTAProps {
  onGenerate?: () => void;
}

export function ReportsCTA({ onGenerate }: ReportsCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-blue-500 p-5 text-white shadow-md">
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://picsum.photos/seed/edudesk-reports/600/300"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">របាយការណ៍ប្រចាំខែរួចរាល់</h2>
          <p className="mt-1 text-sm text-blue-50">
            បង្កើតរបាយការណ៍ Excel ដ៏ប្រណីតសម្រាប់គ្រប់ថ្នាក់បានភ្លាមៗ។
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
        >
          បង្កើត
        </button>
      </div>
    </div>
  );
}