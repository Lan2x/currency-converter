import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrencyState {
  currencies: Record<string, string>;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

const initialState: CurrencyState = {
  currencies: {},
  fromCurrency: "USD",
  toCurrency: "PHP",
  amount: 0,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrencies: (state, payload: PayloadAction<Record<string, string>>) => {
      state.currencies = payload.payload;
    },
    setFromCurrency: (state, payload: PayloadAction<string>) => {
      state.fromCurrency = payload.payload;
    },
    setToCurrency: (state, payload: PayloadAction<string>) => {
      state.toCurrency = payload.payload;
    },
    setAmount: (state, payload: PayloadAction<number>) => {
      state.amount = payload.payload;
    },
    swapCurrencies: (state) => {
      const _fromCurrency = state.fromCurrency;
      const _toCurrency = state.toCurrency;

      state.fromCurrency = _toCurrency;
      state.toCurrency = _fromCurrency;
    },
  },
});

export const {
  setCurrencies,
  setFromCurrency,
  setToCurrency,
  setAmount,
  swapCurrencies,
} = currencySlice.actions;

export default currencySlice.reducer;
