const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async getAll<T>(source: T[]): Promise<T[]> {
    await delay();
    return structuredClone(source);
  },
  async create<T extends { id: number }>(source: T[], payload: Omit<T, 'id'>): Promise<T> {
    await delay();
    const next = { ...payload, id: source.length ? Math.max(...source.map((i) => i.id)) + 1 : 1 } as T;
    source.push(next);
    return structuredClone(next);
  },
  async update<T extends { id: number }>(source: T[], id: number, payload: Partial<T>): Promise<T> {
    await delay();
    const index = source.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Item not found');
    source[index] = { ...source[index], ...payload };
    return structuredClone(source[index]);
  },
  async delete<T extends { id: number }>(source: T[], id: number): Promise<void> {
    await delay();
    const index = source.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Item not found');
    source.splice(index, 1);
  }
};
