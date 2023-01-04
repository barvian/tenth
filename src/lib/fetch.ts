export async function parseJSON<T = any>(r: Response): Promise<T> {
	if (!r.ok) throw await r.text() // TODO: is there a better way to handle this?
	return (await r.json()) as T
}
