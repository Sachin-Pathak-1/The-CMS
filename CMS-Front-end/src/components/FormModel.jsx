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
            <div className="w-full max-w-2xl rounded-xl bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
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
                            className={`rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500 ${field.fullWidth ? "md:col-span-2" : ""}`}
                        />
                    ))}

                    <div className="mt-2 flex justify-end gap-2 md:col-span-2">
                        <button type="button" onClick={onClose} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
