export default function capitalizar(str?: string): string {
    if (!str) return ""; 

    const normalizada = str.trim();
    if (normalizada.length === 0) return "";

    return normalizada.charAt(0).toUpperCase() + normalizada.slice(1).toLowerCase();
}
