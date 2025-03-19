// conversion = https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}
// currencies = https://api.frankfurter.dev/v1/currencies

import Dropdown from "./ui/Dropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import {
  setAmount,
  setCurrencies,
  setFromCurrency,
  setToCurrency,
  swapCurrencies,
} from "../state/currency/currencySlice";
import { useQuery } from "@tanstack/react-query";
import {
  fetchConversionRate,
  fetchCurrencies,
} from "./queries/currencyQueries";
import { useEffect } from "react";

const CurrencyConverter = () => {
  const { amount, currencies, toCurrency, fromCurrency } = useSelector(
    (state: RootState) => state.currency
  );
  const dispatch = useDispatch<AppDispatch>();

  const currencyQuery = useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
  });

  const conversionQuery = useQuery({
    queryKey: ["conversion", fromCurrency, toCurrency, amount],
    queryFn: () => fetchConversionRate(fromCurrency, toCurrency),
    enabled: false,
  });

  useEffect(() => {
    if (currencyQuery.data) {
      dispatch(setCurrencies(currencyQuery.data));
    }
    console.log("refetching currencies");
  }, [currencyQuery.data]);

  return (
    <div className="max-w-full mx-10 my-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="mb-9 text-2xl text-center font-semibold text-gray-700">
        Currency Converter
      </h2>

      {currencies && (
        <div className="grid grid-cols-1 sm:grid-cols-5  gap-4 items-end">
          <Dropdown
            title="From"
            currencies={currencies}
            currency={fromCurrency}
            setCurrency={(cur) => dispatch(setFromCurrency(cur))}
          />
          <div className="flex justify-center sm:mb-2 col-span-1 ">
            <button
              onClick={() => dispatch(swapCurrencies())}
              className="p-2 rounded-md cursor-pointer hover:bg-gray-300 bg-gray-200"
            >
              <HiArrowsRightLeft className="text-xl text-gray-700" />
            </button>
          </div>
          <Dropdown
            title="To"
            currencies={currencies}
            currency={toCurrency}
            setCurrency={(cur) => dispatch(setToCurrency(cur))}
          />
        </div>
      )}

      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          value={amount}
          onChange={(e) => dispatch(setAmount(parseInt(e.target.value)))}
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
        />
      </div>

      <div className="flex justify-center w-full mt-6">
        <button
          onClick={async () => conversionQuery.refetch()}
          disabled={conversionQuery.isLoading}
          className={`px-5 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${conversionQuery.isLoading ? "animate-pulse" : ""}
            `}
        >
          Convert
        </button>
        <ToastContainer />
      </div>

      <div className="mt-4 text-lg font-medium text-center text-red-600 bg-red-500/20 rounded-md">
        {conversionQuery.error?.message && conversionQuery.error.message}
      </div>

      <div className="mt-4 text-lg font-medium text-center text-green-900 bg-green-500/20 rounded-md">
        {conversionQuery.isLoading && "Loading"}
        {conversionQuery.data &&
          `${amount} ${fromCurrency} =  ${toCurrency} ${parseFloat(
            ((conversionQuery.data as number) * amount).toFixed(2)
          ).toLocaleString()}`}
      </div>
    </div>
  );
};

export default CurrencyConverter;
