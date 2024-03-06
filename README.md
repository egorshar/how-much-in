# How Much In
Open Source currency converter app without ads

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

# scan qr-code and open dev-client
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
