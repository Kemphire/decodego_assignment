const paths = {
  home: <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  reload: <path d="M20 7v5h-5M4 17v-5h5m-4.5-4a8 8 0 0 1 13-3L20 8M4 16l2.5 3a8 8 0 0 0 13-3" />,
  receipt: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6" />,
  check: <path d="m5 12 4 4L19 6" />,
  alert: (
    <>
      <path d="m12 3 10 18H2L12 3Zm0 6v5" />
      <path d="M12 17h.01" />
    </>
  ),
}

export function Icon({
  name,
  className = 'size-4',
}: {
  name: keyof typeof paths
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {paths[name]}
    </svg>
  )
}
