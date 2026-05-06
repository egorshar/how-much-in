# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

How Much In is an open-source, ad-free currency converter mobile app built with React Native and Expo (SDK 55).
It provides real-time currency exchange rates with offline support.

## Commands

```bash
# Development
yarn start              # Start Expo dev server (with APP_VARIANT=development)
yarn ios                # Launch on iOS simulator
yarn android            # Launch on Android emulator

# EAS Development Builds (first-time setup or native changes)
yarn dev:ios            # Build development iOS app via EAS
yarn dev:android        # Build development Android app via EAS

# Production Builds
yarn build:ios          # Production iOS build via EAS
yarn build:android      # Production Android build via EAS

# Code Quality
npx eslint .            # Lint codebase
npx prettier --write .  # Format code
```

## Architecture

### Directory Structure
- `ui/components/` - Reusable UI components (CountryFlag, Form elements, KeyboardCalculator, ListItem variants)
- `ui/screens/` - Screen components (Main, AddCurrencyScreen, AboutScreen)
- `services/store.tsx` - Zustand state management with AsyncStorage persistence
- `constants/` - API domain and currencies map
- `navigation/` - React Navigation stack setup
- `locales/` - i18n translations (en.json, ru.json)
- `assets/flags/` - Country flag images (260+ SVG/PNG files)

### Key Patterns
- **State Management**: Zustand with persistence middleware - all state auto-persists to device storage
- **Styling**: Tailwind CSS via `twrnc` package
- **Path Aliases**: Use `@` prefixed imports (`@ui/`, `@services/`, `@constants`, `@locales/`, `@assets/`)
- **i18n**: react-intl with auto locale detection via expo-localization
- **API**: Single endpoint at `https://api.how-much.in/` - rates cached and refreshed daily

### TypeScript Types
Core types defined in `shared-kernel.d.ts`:
- `CurrencyCode`, `CurrencyItem`, `CurrenciesStore`
- `AllowedMathOperation`: 'plus' | 'minus' | 'multiply' | 'divide' | 'equal'

### Build Configuration
- `app.config.js` - Expo config with APP_VARIANT support for dev/prod bundle IDs
- `eas.json` - EAS Build profiles (development, preview, production)
- New Architecture enabled with Hermes JS engine
