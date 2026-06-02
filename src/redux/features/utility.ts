import { createSlice } from "@reduxjs/toolkit";
import { IProduct } from "@/types/product-d-t";

interface CartState {
  isShow: boolean;
  product: IProduct | null;
}

let initialState: CartState = {
  isShow: false,
  product: null,
};

export const utility = createSlice({
  name: "utility",
  initialState,
  reducers: {
    handleModalProduct: (state,{payload}:{payload:{product:IProduct}}) => {
      state.product = payload.product;
    },
    handleOpenModal: (state) => {
      state.isShow = !state.isShow;
    }
  },
});

export const { handleOpenModal,handleModalProduct } = utility.actions;
export default utility.reducer;
