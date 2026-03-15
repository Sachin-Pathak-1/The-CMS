import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicProducts } from "../../services/marketService";
import { addProductToCart, getCartCount } from "../../services/storeOrderService";

export function StorePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("featured");
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                const apiProducts = await getPublicProducts();
                if (!isMounted) return;
                setProducts(apiProducts);
                setLoadError("");
            } catch {
                if (!isMounted) return;
                setProducts([]);
                setLoadError("Backend products could not be loaded.");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                    try {
                        setCartCount(await getCartCount());
                    } catch {
                        setCartCount(0);
                    }
                }
            }
        };

        loadProducts();
        return () => {
            isMounted = false;
        };
    }, []);

    const categories = useMemo(() => {
        const unique = new Set(products.map((item) => item.category).filter(Boolean));
        return ["All", ...Array.from(unique)];
    }, [products]);

    const visibleProducts = useMemo(() => {
        const text = query.trim().toLowerCase();

        let rows = products.filter((product) => {
            const matchesCategory = category === "All" || product.category === category;
            const matchesSearch =
                text === "" ||
                product.name.toLowerCase().includes(text) ||
                (product.description || "").toLowerCase().includes(text);
            return matchesCategory && matchesSearch;
        });

        rows = [...rows];

        if (sortBy === "price-low") rows.sort((a, b) => a.price - b.price);
        if (sortBy === "price-high") rows.sort((a, b) => b.price - a.price);
        if (sortBy === "rating") rows.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        if (sortBy === "stock") rows.sort((a, b) => b.stock - a.stock);

        return rows;
    }, [products, query, category, sortBy]);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

    const handleAddToCart = async (product) => {
        try {
            await addProductToCart(product, 1);
            setCartCount(await getCartCount());
            setLoadError("");
        } catch (err) {
            setLoadError(err.message || "Failed to add product to cart.");
        }
    };

    const handleOrderNow = (product) => {
        navigate("/order", { state: { product } });
    };

    return (
        <>
            <div className="p-4">
                <section className="hero-panel">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <span className="page-tag">Campus Store</span>
                            <h1 className="mt-4 text-3xl font-semibold text-slate-800">Explore rewards, essentials, and learning gear</h1>
                            <p className="section-copy max-w-2xl">Browse curated student products, sort by value, and move directly from discovery to wallet checkout.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/order")}
                            className="btn-primary"
                        >
                            Cart Items: {cartCount}
                        </button>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search products..."
                            className="field-input"
                        />
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="field-select"
                        >
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className="field-select"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                            <option value="stock">Most In Stock</option>
                        </select>
                    </div>
                    {loadError ? <p className="mt-3 text-xs text-amber-600">{loadError}</p> : null}
                </section>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {isLoading ? (
                        <div className="glass-panel col-span-full p-6 text-center text-sm text-slate-500">
                            Loading products...
                        </div>
                    ) : null}
                    {visibleProducts.map((product) => (
                        <article key={product.id} className="glass-panel overflow-hidden p-0">
                            <img src={product.image || product.imageUrl || "/logo.png"} alt={product.name} className="h-48 w-full object-cover" />
                            <div className="p-4">
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <h2 className="text-base font-semibold leading-tight text-slate-800">{product.name}</h2>
                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{product.category || "General"}</span>
                                </div>
                                <p className="text-sm text-slate-500">{product.description}</p>
                                <div className="mt-3 flex items-center justify-between text-sm">
                                    <span className="font-semibold text-sky-700">{formatCurrency(product.price)}</span>
                                    <span className="text-amber-600">* {product.rating ?? "-"}</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-500">Stock: {product.stock}</div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        className="btn-primary rounded-2xl py-2"
                                    >
                                        Add To Cart
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOrderNow(product)}
                                        className="btn-secondary rounded-2xl py-2"
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {!isLoading && visibleProducts.length === 0 ? (
                    <div className="glass-panel mt-6 p-6 text-center text-sm text-slate-500">
                        No products found for the current filters.
                    </div>
                ) : null}
            </div>
        </>
    );
}
