import { useEffect, useState } from "react";

export function FormModel({
    open,
    onClose,
    onSubmit,
    title = "Add Item",
    submitLabel = "Add",
    fields = [],
    initialValues = {},
}) {
    const [form, setForm] = useState({});

    const getInitialState = () => {
        const base = {};
        fields.forEach((field) => {
            base[field.name] = initialValues[field.name] ?? "";
        });
        return base;
    };

    useEffect(() => {
        if (open) {
            setForm(getInitialState());
        }
    }, [open]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="glass-panel w-full max-w-2xl p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                    <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
                        Close
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {fields.map((field) => (
                        <input
                            key={field.name}
                            name={field.name}
                            type={field.type || "text"}
                            value={form[field.name] || ""}
                            onChange={handleChange}
                            placeholder={field.placeholder || field.label || field.name}
                            required={field.required !== false}
                            className={`field-input ${field.fullWidth ? "md:col-span-2" : ""}`}
                        />
                    ))}

                    <div className="mt-2 flex justify-end gap-2 md:col-span-2">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
