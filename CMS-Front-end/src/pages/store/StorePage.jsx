import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicProducts } from "../../services/marketService";
import { addProductToCart, getCartCount } from "../../services/storeOrderService";
import { Card, CardHeader, SectionHeader, InfoBox } from "../../lib/designSystem";
import { ShoppingCart, Search } from "lucide-react";

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
        <div className="space-y-8 px-4 py-8 md:px-8">
            {/* Header Section */}
            <div>
                <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Campus Store
                </span>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-800">
                    Explore rewards, essentials, and learning gear
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    Browse curated student products, sort by value, and move directly from discovery to wallet checkout. Earn points through assignments and activity, then redeem them here.
                </p>
            </div>

            {/* Filters Section */}
            <Card className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 grid gap-3 md:grid-cols-3">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                            />
                        </div>
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
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
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                            <option value="stock">Most In Stock</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/order")}
                        className="flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 whitespace-nowrap"
                    >
                        <ShoppingCart size={18} />
                        Cart ({cartCount})
                    </button>
                </div>
                {loadError && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                        {loadError}
                    </div>
                )}
            </Card>

            {/* Products Grid */}
            {isLoading ? (
                <Card className="p-12 text-center">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">Loading products...</p>
                </Card>
            ) : visibleProducts.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-slate-600 font-medium">No products found</p>
                    <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search query</p>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleProducts.map((product) => (
                        <Card key={product.id} className="p-0 overflow-hidden flex flex-col group hover:shadow-md transition">
                            <div className="relative overflow-hidden bg-slate-100 h-48 w-full">
                                <img
                                    src={product.image || product.imageUrl || "/logo.png"}
                                    alt={product.name}
                                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                                    onError={(e) => (e.target.src = "/placeholder.png")}
                                />
                                <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                    {product.category || "General"}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-base font-semibold text-slate-800 line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="mt-4 flex items-center justify-between mb-4">
                                    <span className="text-2xl font-semibold text-slate-900">
                                        ₹{product.price}
                                    </span>
                                    {product.rating && (
                                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                            ★ {product.rating}
                                        </span>
                                    )}
                                </div>
                                {product.stock <= 5 && (
                                    <p className="text-xs text-rose-600 font-medium mb-3">
                                        Only {product.stock} left in stock
                                    </p>
                                )}
                                <div className="mt-auto grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700"
                                        disabled={product.stock === 0}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOrderNow(product)}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                        disabled={product.stock === 0}
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
