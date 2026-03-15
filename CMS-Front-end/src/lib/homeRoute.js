export function getHomeRoute(userType) {
    if (userType === "admin") return "/admin";
    if (userType === "teacher") return "/teacher";
    return "/student";
}
