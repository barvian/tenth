export async function parseJSON<T = any>(r: Response): Promise<T> {
	if (r.ok) return (await r.json()) as T
	// TODO: is there a better way to handle this?
	throw await r.text()
}
