# iOS 26 Polish & Fabric Cleanup — Design

**Date:** 2026-05-06
**Branch:** `chore/upgrade-dependencies-latest`
**Landing:** Single squashed commit on this branch.

## Goal

Polish and finalize the in-flight iOS 26 (Liquid Glass) UI adaptation and the Fabric/new-architecture compatibility cleanup that started during the Expo SDK 55 / React Native 0.83.2 / React 19 upgrade. Land everything as one squashed commit.

## Context

The branch already committed the dependency upgrade (Expo SDK 55, RN 0.83.2, React 19.2.0, Reanimated 4, Worklets 0.7.2). `newArchEnabled: true` was already set, so the new architecture is on. The uncommitted working copy mixes three concerns:

1. iOS 26 visual adaptation (circular icon buttons replacing text "Done"/"Close" on iOS 26+, header config changes).
2. A Fabric-correctness fix in `ListItem.tsx` (replacing imperative `setNativeProps({ style: { opacity, zIndex } })` with React state).
3. Tooling: `@types/react` resolution, `.gitignore` `.claude` entry.

In review, additional issues surfaced:
- `tw.color('bg-violet-600')` in `AddCurrencyScreen` is wrong syntax (returns `undefined`, icon renders default color).
- Unused `Button`, `Pressable` imports in `AddCurrencyScreen`.
- `obscureBackground` is misplaced — it's a `react-native-screens` search-bar prop, not a screen-header prop, so it's no-op on `MainScreen` (which has no search bar).
- `colors: { primary: 'red' }` in `NavigationContainer` theme looks like a debugging leftover.
- `hasStaticHeight` added to `AboutScreen` is the wrong value (`true`) — long-form About text needs `false` to expand.
- The `hasStaticHeight` regression has a deeper root cause: React 19 stopped honoring `defaultProps` on function components, so `FormText.defaultProps = { hasStaticHeight: true }` is silently ignored.
- Two more redundant/dead imperative style updates remain in `ListItem.tsx` (line 51 useEffect, line 115 onChangeText backgroundColor).
- `MainScreen`'s `headerRight` "+" Add button is styled `p-2 -m-2`; for iOS 26 visual consistency with the other circular icon buttons, it should adopt the `w-8 h-8 rounded-full` treatment when on IS_IOS26.

## Scope

In this pass:

- Finish iOS 26 polish (fix bugs in WIP, extend "+" Add button consistency, drop debug theme, relocate `obscureBackground`).
- Full Fabric-compat cleanup of redundant imperative style updates in `ListItem.tsx`.
- Fix the React 19 `defaultProps` regression at the root by migrating `Form/*` components to JS default parameter values.

Out of scope:

- New iOS 26 features beyond the existing visual adaptation (no glass effects on non-header surfaces, no haptic redesigns).
- Refactors to MainFooter or KeyboardCalculator beyond what's needed.
- Updating navigation, gesture-handler, or other libs beyond what's already on the branch.
- Localization or copy changes.

## Detailed changes

### 1. iOS 26 polish

**`ui/screens/AddCurrencyScreen.tsx`**
- Fix `tw.color('bg-violet-600')` → `tw.color('violet-600')`.
- Remove unused imports: `Button`, `Pressable`.
- Reformat imports (`Platform, Pressable,` line) to match prettier.
- Add `obscureBackground: !IS_IOS26` to the `headerSearchBarOptions` object in the existing `useLayoutEffect`.

**`ui/screens/AboutScreen.tsx`**
- Change `hasStaticHeight` (which evaluates to `true`) → `hasStaticHeight={false}` so the multi-paragraph About text isn't clipped to `h-11`/`h-14`.

**`navigation/index.tsx`**
- Remove `obscureBackground: !IS_IOS26` from MainScreen options (no-op there; relocated to AddCurrencyScreen).
- Drop the custom `NavigationContainer` theme entirely (revert to default — `colors: { primary: 'red' }` was a debugging probe; system default tints are correct).
- Remove the `DefaultTheme` import that becomes unused.
- Keep the `headerLargeTitle` → `headerLargeTitleEnabled` rename and the `headerLargeTitleStyle`/`headerTitleStyle` color additions (these are correct and needed under iOS 26).

**`ui/screens/Main.tsx`**
- Change the `headerRight` "+" Add button's `style` from `tw\`p-2 -m-2\`` to a conditional that picks `tw\`w-8 h-8 rounded-full items-center justify-center\`` on `IS_IOS26` and `tw\`p-2 -m-2\`` otherwise. Import `IS_IOS26` from `@constants`.

### 2. Fabric / new-arch cleanup

**`ui/components/ListItem/ListItem.tsx`**
- Delete the `useEffect` at line 49–57 entirely. The condition `isNotAFirstRender` can never be true given the initial state and the only `setIsNotAFirstRender` call is inside the effect itself — dead code.
- Remove the `setNativeProps({ style: { backgroundColor: tw.color('violet-50') } })` block at line 115 (inside `onChangeText`). The same active-row highlight is already applied declaratively via the `activeCurrency === item.code` check at lines 68–70; the imperative call is redundant and ran one render early.
- Drop the `isNotAFirstRender` state declaration since the effect that used it is gone.
- Keep `setNativeProps` calls at lines 131, 137, 156 — they update `text`/`selection`, not styles, and are safe under Fabric.
- Keep the WIP change converting input opacity to React state (`inputVisible`).

**`ui/screens/Main.tsx`**
- Leave the `setNativeProps({ text, placeholder })` calls at lines 217, 229 — non-style updates, safe under Fabric.

### 3. React 19 defaultProps migration

**`ui/components/Form/Text.tsx`**
- Replace destructure with default parameter values: `{ text, description, textStyle = {}, hasStaticHeight = true, isFirst, isLast }`.
- Delete the `FormText.defaultProps = { hasStaticHeight: true, textStyle: {} }` assignment.

**`ui/components/Form/Element.tsx`** and **`ui/components/Form/Button.tsx`**
- Audit for any `*.defaultProps` usage and migrate the same way (default parameter values inline). Delete the `defaultProps` assignments.

**Other components**
- Run `grep -rn "\.defaultProps" ui/ services/ navigation/ constants/` and migrate any remaining usages found. These are likely confined to `Form/`.

### 4. Tooling (already in WIP, kept as-is)

- `package.json` adds `resolutions: { "@types/react": "~19.2.14" }` — keep.
- `.gitignore` adds `.claude` — keep.
- `yarn.lock` dedupe of `@types/react` — keep.

## Verification plan

Static checks:
- `npx eslint .`
- `npx tsc --noEmit`

Runtime checks (manual, on simulators):
- iOS 26 simulator:
  - Main screen: header large title renders, "+" Add button is circular, footer "Done" (in edit mode) is checkmark icon.
  - Open AddCurrency modal: search bar appears, `obscureBackground` disabled (so search expands cleanly under Liquid Glass), close button is circular X icon.
  - Open About: long text renders fully (not clipped), close button is circular X icon.
- iOS 18 or earlier simulator:
  - All buttons render as text "Done"/"Close" labels.
  - Header has translucent blur (headerBlurEffect 'regular').
  - Search bar uses default obscure-background behavior.
- Android: regression check — buttons render correctly, no layout breaks.

Functional checks:
- Tap a currency row to focus its input — input opacity ramps in via React state (Fabric path), no flicker.
- Drag a row in edit mode — active row highlight works (relies on declarative styling now, not imperative).
- Enter calculator mode (operator buttons) — `setNativeProps({ text, placeholder })` still works.

## Landing strategy

Single squashed commit on `chore/upgrade-dependencies-latest`. Suggested commit message:

```
Polish iOS 26 UI adaptation and clean up Fabric-incompatible imperative style updates

- Fix tw.color() typo and unused imports in AddCurrencyScreen
- Set hasStaticHeight={false} on AboutScreen long-form text
- Migrate Form/* defaultProps to default parameters for React 19
- Relocate obscureBackground to AddCurrencyScreen's search bar options
- Drop debugging NavigationContainer theme override
- Apply iOS 26 circular icon styling to MainScreen "+" Add button
- Remove redundant/dead setNativeProps style calls in ListItem
```

No push to origin until the user confirms.

## Risks

- iOS 26 visual paths are only verifiable on an iOS 26 simulator/device. Without one, we ship the conditional safely (it's gated by `IS_IOS26` runtime detection) but visual polish on iOS 26 itself is unverified.
- Removing the imperative active-row highlight in `ListItem` means the highlight repaints one render later than before. In practice this is one frame; if there's a perceptible flash, we can revert that specific change.
- Migrating `defaultProps` could surface other components that quietly relied on it; the audit step (grep) is meant to catch them, but anything outside `ui/` should also be checked.
