type CurrencyCode = string;

type CurrencyItem = {
  code: CurrencyCode;
  label: string;
};

type CurrenciesValues = {
  [key: CurrencyCode]: number;
};

interface CurrenciesStore {
  activeCurrency: CurrencyCode;
  setActiveCurrency: (activeCurrency: CurrencyCode) => void;

  currencies: CurrencyItem[];
  getCurrencies: () => Promise<CurrencyItem[]>;

  lastSync: number;

  rates: {
    [key: CurrencyCode]: {
      [key: CurrencyCode]: number;
    };
  };

  selectedCurrencies: CurrencyCode[];
  setSelectedCurrencies: (
    selectedCurrencies: CurrenciesStore['selectedCurrencies'],
  ) => void;
  deleteSelectedCurrency: (deletedCode: CurrencyCode) => void;

  values: CurrenciesValues;
  setValues: (values: CurrenciesValues) => void;
}

interface CurrenciesInterface {
  [key: string]: string;
}

interface FlagsIconsInterface {
  [key: string]: number;
}

declare module '@assets/flags/flagsIndex' {
  const FLAGS: FlagsIconsInterface;
  export = FLAGS;
}
