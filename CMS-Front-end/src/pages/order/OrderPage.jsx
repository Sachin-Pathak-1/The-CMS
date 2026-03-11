import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "../Layout";
import { addProductToCart, checkoutCart, getCartItems, removeCartItem } from "../../services/storeOrderService";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const normalizeCartItem = (item) => ({
    id: item.id,
    productId: item.productId || item.id,
    name: item.product?.name || item.name,
    price: Number(item.product?.price ?? item.price ?? 0),
    image: item.product?.image || item.image || "/logo.png",
    category: item.product?.category || item.category || "General",
    quantity: Number(item.quantity || 1),
});

export function OrderPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [customerName, setCustomerName] = useState("Sachin Pathak");
    const [note, setNote] = useState("");
    const [pin, setPin] = useState("");
    const [loadError, setLoadError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const directProduct = location.state?.product || null;
    const isDirectOrder = Boolean(directProduct);

    useEffect(() => {
        if (isDirectOrder) {
            setCartItems([
                {
                    id: directProduct.id,
                    productId: directProduct.id,
                    name: directProduct.name,
                    price: Number(directProduct.price || 0),
                    image: directProduct.image || directProduct.imageUrl || "/logo.png",
                    category: directProduct.category || "General",
                    quantity: 1,
                },
            ]);
            return;
        }

        getCartItems()
            .then((items) => setCartItems(items.map(normalizeCartItem)))
            .catch((err) => setLoadError(err.message || "Failed to load cart"));
    }, [directProduct, isDirectOrder]);

    const subtotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
        [cartItems]
    );
    const serviceFee = cartItems.length ? 15 : 0;
    const total = subtotal + serviceFee;

    const handleRemove = async (productId) => {
        if (isDirectOrder) {
            setCartItems((prev) => prev.filter((item) => item.id !== productId));
            return;
        }

        try {
            await removeCartItem(productId);
            const items = await getCartItems();
            setCartItems(items.map(normalizeCartItem));
        } catch (err) {
            setLoadError(err.message || "Failed to remove cart item");
        }
    };

    const handlePlaceOrder = async () => {
        if (!customerName.trim() || cartItems.length === 0 || !pin.trim()) return;

        try {
            setIsSubmitting(true);
            setLoadError("");

            if (isDirectOrder && directProduct) {
                await addProductToCart(directProduct, 1);
            }

            await checkoutCart(pin.trim());
            navigate("/orders");
        } catch (err) {
            setLoadError(err.message || "Failed to create order");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="p-4">
                <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#fff6dc] via-white to-[#e4f4ff] p-6 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                {isDirectOrder ? "Direct Order" : "Cart Checkout"}
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold text-slate-800">Review and create your order</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Confirm the selected products, review the bill, and place the order. After that, you can track it from the orders page.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800">Items</h2>
                        <div className="mt-5 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                                    No items selected yet.
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
                                        <img src={item.image} alt={item.name} className="h-24 w-full rounded-2xl object-cover sm:w-24" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                                                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{item.category}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(item.price)}</p>
                                                    <p className="mt-1 text-xs text-slate-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(item.id)}
                                            className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800">Order details</h2>
                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Student name</label>
                                <input
                                    value={customerName}
                                    onChange={(event) => setCustomerName(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                                    placeholder="Enter student name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Order note</label>
                                <textarea
                                    value={note}
                                    onChange={(event) => setNote(event.target.value)}
                                    className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                                    placeholder="Optional note for this order"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Wallet PIN</label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(event) => setPin(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                                    placeholder="Enter 6-digit wallet PIN"
                                />
                            </div>

                            {loadError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</div> : null}

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                                    <span>Service fee</span>
                                    <span>{formatCurrency(serviceFee)}</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-800">
                                    <span>Total bill</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={!customerName.trim() || cartItems.length === 0 || !pin.trim() || isSubmitting}
                                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? "Creating Order..." : "Create Order"}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
