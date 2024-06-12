// ./app/utils/check-server-status.ts
export async function checkServerStatus(url: string, timeout = 5000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response.ok;
  } catch (error) {
    console.error("Server status check failed:", error);
    return false;
  }
}