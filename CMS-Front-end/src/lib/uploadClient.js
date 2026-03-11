import { apiRequest } from "./apiClient";

const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });

export async function uploadFileToCloudinary(file, folder, publicId) {
    const dataUrl = await readFileAsDataUrl(file);
    const response = await apiRequest("/uploads/cloudinary", {
        method: "POST",
        body: JSON.stringify({
            fileName: file.name,
            dataUrl,
            folder,
            publicId,
        }),
    });

    return response?.data;
}
