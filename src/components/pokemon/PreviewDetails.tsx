export function PreviewDetails({
  details,
}: {
  details: Array<[string, string | number, boolean?]>
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {details.map(([label, value, wide]) => (
        <div
          key={String(label)}
          className={`${wide ? 'col-span-2' : ''} rounded-md bg-black/10 p-2 dark:bg-white/10`}
        >
          <div className="label text-[0.65rem]">{label}</div>
          <div className="truncate text-sm font-black">{value}</div>
        </div>
      ))}
    </div>
  )
}
