# How Much In
Open Source currency converter app without ads

![49fe1813-d4be-46bb-b8c1-b904eee60b3b](https://github.com/egorshar/howmuchin/assets/286997/d404ee8a-b185-4034-8389-f0198a95f449)
![65709ff2-b903-42ed-bc40-20de71fb798e](https://github.com/egorshar/howmuchin/assets/286997/9b2bbf78-8973-4313-80ce-d46dce584526)
![44da62eb-d91e-4265-937c-14f9d208601c](https://github.com/egorshar/howmuchin/assets/286997/13caf13c-7054-4583-9013-2be152fb1db0)

[![App Store](https://github.com/egorshar/howmuchin/assets/286997/a07fa168-e7ae-4d73-8db5-f762e34120f1)](https://apps.apple.com/app/how-much-in/id6459408194)
[![Google Play](https://github.com/egorshar/howmuchin/assets/286997/a19254b8-8da2-4523-ac2c-f8d3c57f5737)](https://play.google.com/store/apps/details?id=com.egorshar.howmuchin)

## Uses
- React
- React Native
- Expo
- React Intl
- Tailwind (twrnc)
- Zustand

## Env

- node v16.15.1
- yarn v1.22.15
- `sudo npm i -g eas-cli expo-cli`

## Dev Setup
```sh
# run once
yarn install
eas device:create
yarn dev:ios
yarn dev:android

# next time run only
yarn start
```

## Production build
```sh
yarn build:ios
yarn build:anroid
```

## Data Source

[Free Currency Exchange Rates API](https://github.com/fawazahmed0/exchange-api)

## License

See the [LICENSE file](LICENSE.txt) for license rights and limitations.

## Author

[Egor Sharapov](https://egor.sh)
