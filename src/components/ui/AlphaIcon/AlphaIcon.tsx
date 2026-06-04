export function AlphaIcon({
  className = '',
  size = 16,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.2 8.2 5.1 3.8l5.1 2.4" fill="currentColor" />
      <path d="m16.8 8.2 2.1-4.4-5.1 2.4" fill="currentColor" />
      <path
        d="M4.8 13.5c0-4.1 2.9-7 7.2-7s7.2 2.9 7.2 7-2.9 6.9-7.2 6.9-7.2-2.8-7.2-6.9Z"
        fill="currentColor"
      />
      <path
        d="M9 13.1h.1M15 13.1h.1"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
      <path
        d="M9.5 16.3c1.4.8 3.6.8 5 0"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}
