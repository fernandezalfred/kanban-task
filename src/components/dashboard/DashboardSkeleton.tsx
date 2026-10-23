export function DashboardSkeleton() {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="hidden w-[261px] shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="px-6 pt-8 pb-4">
          <div className="h-6 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-col gap-2 px-2 pt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="mx-4 h-8 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-4 sm:px-6">
          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          <div className="h-8 w-28 animate-pulse rounded-full bg-muted" />
        </header>
        <main className="flex flex-1 gap-6 overflow-hidden px-4 py-6 sm:px-6">
          {Array.from({ length: 3 }).map((_, columnIndex) => (
            <div key={columnIndex} className="flex w-[280px] shrink-0 flex-col gap-4">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <div
                  key={cardIndex}
                  className="h-20 animate-pulse rounded-lg bg-card ring-1 ring-border/50"
                />
              ))}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
