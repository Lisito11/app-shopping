
export const createItemListSlice = (set) => ({
    items: [],
    addItem: (newItem) => set((state) => ({items : [...state.items, newItem]})),
    updateItem: (updateItem) => set((state) => ({items : state.items.map((item) => (item.id === updateItem.id ? updateItem : item)) })),
    removeItem: (id) => set((state) => ({items : state.items.filter((item) => item.id !== id)})),
    removeAllItem: () => set(({items : []})),
});