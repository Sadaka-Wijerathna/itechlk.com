import { PayloadAction, createSlice } from "@reduxjs/toolkit";


// Define a type for the slice state
interface IFilterState {
  category: string;
  subCategory: string;
  sizes: string[];
  colors: string[];
  brand: string;
  itemOffset: number;
  priceValue: number[];
  availability: string[];
}

// Define the initial state using that type
const initialState: IFilterState = {
  category: "",
  subCategory: "",
  sizes: [],
  colors: [],
  brand: "",
  itemOffset: 0,
  priceValue: [0, 500],
  availability: [],
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    add_category: (state, action: PayloadAction<string>) => {
      if (state.category === action.payload) {
        state.category = "";
      } else {
        state.category = action.payload;
      }
      state.subCategory = '';
      state.itemOffset = 0;
    },
    add_sub_category: (state, action: PayloadAction<string>) => {
      if (state.subCategory === action.payload) {
        state.subCategory = "";
      } else {
        state.subCategory = action.payload;
      }
      state.category = '';
      state.itemOffset = 0;
    },
    add_sizes: (state, action: PayloadAction<string>) => {
      if (state.sizes.includes(action.payload)) {
        state.sizes = state.sizes.filter((s) => s !== action.payload);
      } else {
        state.sizes.push(action.payload);
      }
      state.itemOffset = 0;
    },
    add_colors: (state, action: PayloadAction<string>) => {
      if (state.colors.includes(action.payload)) {
        state.colors = state.colors.filter((s) => s !== action.payload);
      } else {
        state.colors.push(action.payload);
      }
      state.itemOffset = 0;
    },
    add_brand: (state, action: PayloadAction<string>) => {
      if (state.brand === action.payload) {
        state.brand = "";
      } else {
        state.brand = action.payload;
      }
      state.itemOffset = 0;
    },
    add_availability: (state, action: PayloadAction<string>) => {
      if (state.availability.includes(action.payload)) {
        state.availability = state.availability.filter((s) => s !== action.payload);
      } else {
        state.availability.push(action.payload);
      }
      state.itemOffset = 0;
    },
    set_item_offset: (state, action: PayloadAction<number>) => {
      state.itemOffset = action.payload;
    },
    set_price_value: (state, action: PayloadAction<number[]>) => {
      state.priceValue = action.payload;
    },
    reset: (state) => {
      state.category = "";
      state.subCategory = "";
      state.sizes = [];
      state.colors = [];
      state.brand = "";
      state.availability = [];
      state.priceValue = [0, 500];
    },
  },
});

export const {
  add_category,
  add_sub_category,
  add_sizes,
  add_colors,
  add_brand,
  add_availability,
  reset,
  set_item_offset,
  set_price_value,
} = filterSlice.actions;
export default filterSlice.reducer;
