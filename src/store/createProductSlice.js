
export const createProductSlice = (set) => ({
    products: [],
    addProduct: (newProduct) => set((state) => ({products : [...state.products, newProduct]})),
    updateProduct: (updateProduct) => set((state) => ({products : state.products.map((product) => (product.id === updateProduct.id ? updateProduct : product)) })),
    removeProduct: (id) => set((state) => ({products : state.products.filter((product) => product.id !== id)})),
    removeAllProduct: () => set(({products : []})),
});