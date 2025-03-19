export const fetchCurrencies = async () => {
  const result = await fetch("https://api.frankfurter.dev/v1/currencies");

  const data = await result.json();
  return data;
};

export const fetchConversionRate = async (
  fromCurrency: string,
  toCurrency: string
) => {
  if (fromCurrency === toCurrency) {
    throw new Error("Please do not select same currency");
  }

  const result = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${fromCurrency}&symbols=${toCurrency}`
  );

  const data = await result.json();

  return data.rates[toCurrency];
};
