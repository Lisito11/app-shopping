import { create } from 'zustand'
import { createAuthSlice } from './createAuthSlice'
import { createBrandSlice } from './createBrandSlice'
import { createItemListSlice } from './createItemListSlice'
import { createProductSlice } from './createProductSlice'
import { createSuperMarketSlice } from './createSuperMarketSlice'


export const useStore = create((...a) => ({
   ...createAuthSlice(...a),
   ...createSuperMarketSlice(...a),
   ...createBrandSlice(...a),
   ...createProductSlice(...a),
   ...createItemListSlice(...a),
}))


