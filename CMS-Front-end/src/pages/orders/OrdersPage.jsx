import { useEffect, useState } from "react";
import { getOrders } from "../../services/storeOrderService";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const statusClasses = {
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
    delivered: "bg-sky-100 text-sky-700",
    cancelled: "bg-rose-100 text-rose-700",
};

export function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getOrders()
            .then((rows) => setOrders(rows))
            .catch((err) => setError(err.message || "Failed to load orders"));
    }, []);

    return (
        <>
            <div className="p-4">
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Orders
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold text-slate-800">Track your orders and bills</h1>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Review created orders, see their status, and inspect the bill for each purchase.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Total Orders: <span className="font-semibold text-slate-800">{orders.length}</span>
                        </div>
                    </div>
                </section>

                <div className="mt-4 space-y-4">
                    {error ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : null}
                    {orders.length === 0 ? (
                        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                            No orders created yet.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <article key={order.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-xl font-semibold text-slate-800">{order.id}</h2>
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusClasses[order.status] || "bg-slate-100 text-slate-700"}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-500">
                                            {order.customerName} | {new Date(order.createdAt).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                        {order.note ? (
                                            <p className="mt-2 text-sm leading-6 text-slate-600">{order.note}</p>
                                        ) : null}
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Bill total</p>
                                        <p className="mt-1 text-2xl font-semibold text-slate-800">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div key={`${order.id}-${item.id}`} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                                <img src={item.product?.image || "/logo.png"} alt={item.product?.name} className="h-16 w-16 rounded-2xl object-cover" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-slate-800">{item.product?.name}</p>
                                                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">Product</p>
                                                </div>
                                                <div className="text-right text-sm">
                                                    <p className="font-semibold text-slate-800">{formatCurrency(item.price)}</p>
                                                    <p className="mt-1 text-slate-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <h3 className="text-sm font-semibold text-slate-800">Bill summary</h3>
                                        <div className="mt-4 space-y-3 text-sm text-slate-500">
                                            <div className="flex items-center justify-between">
                                                <span>Subtotal</span>
                                                <span>{formatCurrency(order.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0))}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Service fee</span>
                                                <span>{formatCurrency(0)}</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-slate-200 pt-3 font-semibold text-slate-800">
                                                <span>Total</span>
                                                <span>{formatCurrency(order.totalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
