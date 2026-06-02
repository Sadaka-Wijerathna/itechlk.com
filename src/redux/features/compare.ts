import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { notifyError, notifySuccess } from "@/utils/toast";
import { IProduct } from "@/types/product-d-t";

let initialCompareState:{compare_products: IProduct[];isCompareAdd:boolean} = {
  compare_products: [],
  isCompareAdd:false,
};

export const compareSlice = createSlice({
  name: "compare",
  initialState: initialCompareState,
  reducers: {
    add_to_compare: (state, { payload }:{ payload:IProduct }) => {
      const isExist = state.compare_products.some(
        (item: IProduct) => item.id === payload.id
      );
      if (!isExist) {
        state.compare_products.push(payload);
        notifySuccess(`${payload.title} added to compare`);
      } else {
        state.compare_products = state.compare_products.filter(
          (item: IProduct) => item.id !== payload.id
        );
        notifyError(`${payload.title} removed from compare`);
      }
      setLocalStorage("compare_items", state.compare_products);
    },
    remove_compare_product: (state, { payload }:{ payload:IProduct }) => {
      state.compare_products = state.compare_products.filter(
        (item: IProduct) => item.id !== payload.id
      );
      setLocalStorage("compare_items", state.compare_products);
      notifyError(`${payload.title} removed from compare`);
    },
    getCompareProducts:(state) => {
      state.compare_products = getLocalStorage('compare_items')
    }
  },
});

export const {
  add_to_compare,
  remove_compare_product,
  getCompareProducts
} = compareSlice.actions;
export default compareSlice.reducer;
