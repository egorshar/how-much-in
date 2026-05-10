import axios from 'axios';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { API_DOMAIN, CURRENCIES } from '@constants';
import tw from '@ui/tailwind';

// Sync twrnc's active scheme synchronously inside the store action so any
// Zustand subscribers that re-render in response to the colorScheme change
// see the new scheme — Effects run after render, which would be too late.
// twrnc exposes setColorScheme at runtime (used internally by
// useAppColorScheme) but doesn't surface it on the TailwindFn type.
const setTwScheme = (tw as unknown as { setColorScheme: (s: 'light' | 'dark') => void }).setColorScheme;
const syncTwScheme = (scheme: ColorScheme) => {
  if (scheme === 'system') {
    const sys = Appearance.getColorScheme();
    setTwScheme(sys === 'dark' ? 'dark' : 'light');
  } else {
    setTwScheme(scheme);
  }
};

const getTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
};

const getRate = async (currency: CurrencyCode) => {
  const response = await axios(
    `${API_DOMAIN}/currency-api@latest/v1/currencies/${currency}?${getTodayDate()}`,
  );

  return response.data;
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
              `${API_DOMAIN}/currency-api@latest/v1/currencies?${Date.now()}`,
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

            const settled = await Promise.allSettled(
              currencies.map(c => getRate(c.code)),
            );

            const newRates: CurrenciesStore['rates'] = {};

            settled.forEach((res, i) => {
              if (
                res.status === 'fulfilled' &&
                res.value &&
                res.value[currencies[i].code]
              ) {
                newRates[currencies[i].code] = res.value[currencies[i].code];
              }
            });

            if (Object.keys(newRates).length === 0) {
              throw new Error('No rates available');
            }

            const { selectedCurrencies } = get();
            const missing = selectedCurrencies.filter(c => !newRates[c]);
            if (missing.length > 0) {
              throw new Error('Missing rates for active currencies');
            }

            set({
              currencies,
              rates: newRates,
              lastSync: Date.now(),
            });

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

        colorScheme: 'system',
        setColorScheme: scheme => {
          syncTwScheme(scheme);
          set({ colorScheme: scheme });
        },
      };

      return store;
    },
    {
      name: 'currencies-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
