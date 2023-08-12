import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { API_DOMAIN, CURRENCIES } from '@constants';

const getRate = async (currency: CurrencyCode) => {
  try {
    const response = await axios(
      `${API_DOMAIN}/currency-api@1/latest/currencies/${currency}?${Date.now()}`,
    );

    return response.data;
  } catch (e) {
    return {};
  }
};

const getRates = (currenciesData: CurrenciesStore['currencies']) => {
  const ratesLoading = currenciesData.map(item => getRate(item.code));

  return Promise.all(ratesLoading);
};

export const useStore = create(
  persist(
    (set, get: () => CurrenciesStore) => {
      const store: CurrenciesStore = {
        activeCurrency: '',
        setActiveCurrency: (
          activeCurrency: CurrenciesStore['activeCurrency'],
        ) => {
          set({ activeCurrency });
        },

        currencies: [],
        getCurrencies: async () => {
          const { lastSync } = get();
          const lastSyncDate = lastSync && new Date(lastSync);

          if (
            lastSyncDate &&
            lastSyncDate.setHours(0, 0, 0, 0) ===
              new Date().setHours(0, 0, 0, 0)
          ) {
            throw new Error('Rates are up to date');
          }

          try {
            const response = await axios(
              `${API_DOMAIN}/currency-api@1/latest/currencies?${Date.now()}`,
            );
            const keys = Object.keys(response.data);
            const currenciesKeys = Object.keys(CURRENCIES);
            const currencies: CurrenciesStore['currencies'] = keys
              .map(key => ({
                code: key,
                label: response.data[key],
              }))
              .filter(
                currency =>
                  currenciesKeys.indexOf(currency.code.toUpperCase()) > -1,
              );

            set({ currencies, lastSync: Date.now() });

            const responses = await getRates(currencies);
            let syncDate = 0;

            set({
              rates: currencies.reduce(
                (result: CurrenciesStore['rates'], item, index) => {
                  const ratesDate = new Date(responses[index].date).getTime();

                  if (syncDate < ratesDate) {
                    syncDate = ratesDate;
                  }

                  result[item.code] = responses[index][item.code];

                  return result;
                },
                {},
              ),
            });

            if (syncDate) {
              set({
                lastSync: new Date(syncDate).getTime(),
              });
            }

            return currencies;
          } catch (e) {
            throw new Error('Oops, try later please');
          }
        },

        lastSync: 0,
        rates: {},

        selectedCurrencies: ['usd', 'eur'],
        setSelectedCurrencies: (
          selectedCurrencies: CurrenciesStore['selectedCurrencies'],
        ) => {
          set({ selectedCurrencies });
        },
        deleteSelectedCurrency: (deletedCode: CurrencyCode) => {
          set({
            selectedCurrencies: get().selectedCurrencies.filter(
              code => code !== deletedCode,
            ),
          });
        },

        values: {},
        setValues: values => set({ values }),
      };

      return store;
    },
    {
      name: 'currencies-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage), // Add this here!
    },
  ),
);
