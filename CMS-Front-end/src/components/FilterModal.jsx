/* eslint-disable react-hooks/set-state-in-effect */
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
            <div className="glass-panel w-full max-w-md p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-slate-500 hover:text-slate-700"
                    >
                        Close
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Enter keyword..."
                        className="field-input"
                        autoFocus
                    />
                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Apply
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
