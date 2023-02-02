
export const createBrandSlice = (set) => ({
    brands: [],
    addBrand: (newBrand) => set((state) => ({brands : [...state.brands, newBrand]})),
    updateBrand: (updateBrand) => set((state) => ({brands : state.brands.map((brand) => (brand.id === updateBrand.id ? updateBrand : brand)) })),
    removeBrand: (id) => set((state) => ({brands : state.brands.filter((brand) => brand.id !== id)})),
    removeAllBrand: () => set(({brands : []})),
});