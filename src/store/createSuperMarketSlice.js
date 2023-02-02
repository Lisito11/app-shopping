
export const createSuperMarketSlice = (set) => ({
    supermarkets: [],
    addSupermarket: (newSupermarket) => set((state) => ({supermarkets : [...state.supermarkets, newSupermarket]})),
    updateSupermarket: (updateSuperMarket) => set((state) => ({supermarkets : state.supermarkets.map((supermarket) => (supermarket.id === updateSuperMarket.id ? updateSuperMarket : supermarket)) })),
    removeSupermarket: (id) => set((state) => ({supermarkets : state.supermarkets.filter((supermarket) => supermarket.id !== id)})),
    removeAllSupermarket: () => set(({supermarkets : []})),
});
