export const json = (r: Response) => r.ok ? r.json() : Promise.reject(r.text())