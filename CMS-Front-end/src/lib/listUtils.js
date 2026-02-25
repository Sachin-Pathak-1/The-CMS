const toText = (value) => {
    if (Array.isArray(value)) return value.join(" ");
    if (value === null || value === undefined) return "";
    return String(value);
};

const compareValues = (a, b) => {
    if (typeof a === "number" && typeof b === "number") {
        return a - b;
    }

    const textA = toText(a).trim();
    const textB = toText(b).trim();
    const maybeNumberA = Number(textA);
    const maybeNumberB = Number(textB);

    if (textA !== "" && textB !== "" && !Number.isNaN(maybeNumberA) && !Number.isNaN(maybeNumberB)) {
        return maybeNumberA - maybeNumberB;
    }

    const maybeDateA = Date.parse(textA);
    const maybeDateB = Date.parse(textB);

    if (!Number.isNaN(maybeDateA) && !Number.isNaN(maybeDateB)) {
        return maybeDateA - maybeDateB;
    }

    return textA.localeCompare(textB, undefined, { numeric: true, sensitivity: "base" });
};

export const getVisibleRows = (rows, { query = "", sortAccessor, sortDirection = "none" } = {}) => {
    const normalizedQuery = query.trim().toLowerCase();

    let nextRows = rows;
    if (normalizedQuery) {
        nextRows = rows.filter((row) =>
            Object.entries(row).some(([key, value]) => {
                if (key === "id" || key === "photo") return false;
                return toText(value).toLowerCase().includes(normalizedQuery);
            })
        );
    }

    if (sortDirection !== "none" && sortAccessor) {
        const sortMultiplier = sortDirection === "asc" ? 1 : -1;
        nextRows = [...nextRows].sort((a, b) => compareValues(a[sortAccessor], b[sortAccessor]) * sortMultiplier);
    }

    return nextRows;
};
