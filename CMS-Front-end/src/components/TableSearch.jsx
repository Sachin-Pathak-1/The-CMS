export function TableSearch() {
    return(
        <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full border border-slate-200 bg-white/80 px-3 shadow-sm backdrop-blur">
            <img src="/search.png" alt="" width={14} height={14} />
            <input type="text"
                placeholder="Search..."
                className="w-[200px] bg-transparent py-3 outline-none placeholder:text-slate-400" />
        </div>
    );
}
