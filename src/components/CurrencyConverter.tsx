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
  const { amount, currencies, toCurrency, fromCurrency, error } = useSelector(
    (state: RootState) => state.currency
  );
  const dispatch = useDispatch<AppDispatch>();

  //start fetch currencies
  const currencyQuery = useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
    enabled: false,
  });
  //end fetch currencies

  //start conversion query
  const conversionQuery = useQuery({
    queryKey: ["conversion", fromCurrency, toCurrency, amount],
    queryFn: () => fetchConversionRate(fromCurrency, toCurrency),
    enabled: false,
  });
  //end conversion query

  useEffect(() => {
    currencyQuery.refetch();
    if (currencyQuery.data) {
      dispatch(setCurrencies(currencyQuery.data));
    }
    console.log("refetching currencies");
  }, [currencyQuery.data]);

  return (
    <div className="max-w-[60%] mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="mb-5 text-2xl font-semibold text-gray-700">
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
              className="p-2 rounded-full cursor-pointer hover:bg-gray-300 bg-gray-200"
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

      <div className="flex justify-end mt-6">
        <button
          onClick={async () => conversionQuery.refetch()}
          className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${conversionQuery.isLoading ? "animate-pulse" : ""}
            `}
        >
          Convert
        </button>
        <ToastContainer />
      </div>

      <div className="mt-4 text-lg font-medium text-right text-red-600">
        {error && error}
      </div>

      <div className="mt-4 text-lg font-medium text-right text-green-600">
        {conversionQuery.isLoading && "Loading"}
        {conversionQuery.data &&
          `Converted Amount ${parseFloat(
            ((conversionQuery.data as number) * amount).toFixed(2)
          ).toLocaleString()}`}
      </div>
    </div>
  );
};

export default CurrencyConverter;
