export async function fetchAPI<T>(
  endpoint: string,
  body: any,
  options?: {
    errorMessage?: string;
  }
): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error((data as any).error || options?.errorMessage || 'API request failed');
  }

  return response.json() as Promise<T>;
}
