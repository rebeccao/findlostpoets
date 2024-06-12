// ./app/utils/check-server-status.ts
export function checkServerStatus(url: string, timeout = 5000, callback: (isUp: boolean) => void): void {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  fetch(url, { signal: controller.signal })
    .then(response => {
      clearTimeout(id);
      callback(response.ok);
    })
    .catch(error => {
      console.error("Server status check failed:", error);
      clearTimeout(id);
      callback(false);
    });
}