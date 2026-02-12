export function getApiBaseUrl() {
    const { hostname, port, protocol } = window.location;

    // 외부: 프론트가 23000으로 열려 있으면 API는 28080
    if (hostname === "114.71.147.30" && port === "23000") {
        return `${protocol}//${hostname}:28080`;
    }

    // 내부: 프론트가 3000이면 API는 8080 (또는 같은 host)
    if (hostname === "114.71.147.30" && port === "3000") {
        return `${protocol}//${hostname}:8080`;
    }

    // 그 외 기본값(개발 PC localhost 등)
    return `${protocol}//${hostname}:8080`;
}