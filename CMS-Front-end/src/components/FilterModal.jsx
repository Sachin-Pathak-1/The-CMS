import { useEffect, useState } from "react";

export function FilterModal({
    open,
    title = "Filter List",
    initialValue = "",
    onClose,
    onApply,
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (open) setValue(initialValue);
    }, [open, initialValue]);

    if (!open) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        onApply(value.trim());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Close
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Enter keyword..."
                        className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                        autoFocus
                    />
                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Apply
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
