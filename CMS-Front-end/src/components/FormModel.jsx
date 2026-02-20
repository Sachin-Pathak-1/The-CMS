import { useEffect, useState } from "react";

const initialForm = {
    name: "",
    email: "",
    teacherId: "",
    subjects: "",
    classes: "",
    phone: "",
    address: "",
    photo: "",
};

export function FormModel({ open, onClose, onSubmit }) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (open) {
            setForm(initialForm);
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
                    <h2 className="text-lg font-semibold">Add Teacher</h2>
                    <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
                        Close
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500" />
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500" />
                    <input name="teacherId" value={form.teacherId} onChange={handleChange} placeholder="Teacher ID" required className="rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500" />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required className="rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500" />
                    <input name="subjects" value={form.subjects} onChange={handleChange} placeholder="Subjects (comma separated)" required className="rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500" />
                    <input name="classes" value={form.classes} onChange={handleChange} placeholder="Classes (comma separated)" required className="rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500" />
                    <input name="photo" value={form.photo} onChange={handleChange} placeholder="Photo URL (optional)" className="rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500 md:col-span-2" />
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required className="rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500 md:col-span-2" />

                    <div className="mt-2 flex justify-end gap-2 md:col-span-2">
                        <button type="button" onClick={onClose} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                            Add Teacher
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
