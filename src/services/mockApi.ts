const delay = async () => new Promise((resolve) => setTimeout(resolve, 400));

export const createMockService = <T extends { id: number }>(source: T[]) => ({
  getAll: async () => {
    await delay();
    return [...source];
  },
  create: async (item: Omit<T, 'id'>) => {
    await delay();
    const next = { ...item, id: Math.max(0, ...source.map((s) => s.id)) + 1 } as T;
    source.push(next);
    return next;
  },
  update: async (id: number, item: Partial<T>) => {
    await delay();
    const index = source.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Item not found');
    source[index] = { ...source[index], ...item };
    return source[index];
  },
  delete: async (id: number) => {
    await delay();
    const index = source.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Item not found');
    const [removed] = source.splice(index, 1);
    return removed;
  }
});
