export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8 fade-up">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-slate-400 mt-2">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
