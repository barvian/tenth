export async function parseJSON<T = any>(r: Response): Promise<T> {
	if (!r.ok) throw r
	return (await r.json()) as T
}
