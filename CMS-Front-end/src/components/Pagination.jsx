export function Pagination () {
    return (
        <div className="mt-4 flex items-center justify-between text-slate-500">
            <button className="btn-secondary rounded-2xl px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
            <div className="flex items-center gap-2 text-xs">
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">1</button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70">2</button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70">3</button>
                ...
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70">10</button>
            </div>
            <button className="btn-secondary rounded-2xl px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50">Next</button>
        </div>
    );
}
