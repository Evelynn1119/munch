# Munch Munch

A restaurant-saving app built in React Native (Expo). Save places, let the app
auto-tag them into lists, search by craving, rate visits to collect cuisine
stamps, and plan outings with friends.

**No backend.** All state lives locally (AsyncStorage) so the prototype is
fully self-contained and testable without any API keys.

## What's in it

- **Onboarding** — value props → sign up (your name is captured and used
  everywhere) → a short personalization quiz → your taste profile.
- **Home** — greeting by name, AI search entry, reminders, a data-driven
  friend-birthday card, curated picks, "saved long ago" nudges.
- **Explore** — search your saves (and cravings) by name, cuisine, area, vibe.
- **➕ Add a place** — paste a link or name (or pick a sample); the app
  "reads" it and auto-tags it into a list. This is the in-app equivalent of
  saving from Instagram — the external share is just an entry point.
- **Restaurant detail** — why you saved it, list membership (toggle), and
  Mark visited → rate.
- **Rate a visit → Stamp** — quick qualitative rating; earns a cuisine stamp
  and updates your profile progress.
- **Lists** — your saved lists and their contents.
- **Plan with a friend** — a scripted assistant that picks from places you
  and the friend both saved and drafts an invite. Data-driven, not hardcoded.
- **Profile** — name, taste, visit/cuisine stats, stamps, sign out.

## Run it

```bash
npm install
npx expo start
```

Scan the QR with **Expo Go** (iOS/Android). Or `npx expo start --web` for a
browser preview.

## Notes

- The lock-screen notification and Instagram screens from the original
  prototypes were entry-point illustrations only — they're not part of the
  app. Their jobs are now in-app: "Add a place" (save) and "Mark visited →
  rate" (the notification's purpose).
- Conversational/AI surfaces (Plan assistant, auto-tagging) are scripted
  locally — wiring real providers is a later step.
- Sign out (Profile) clears local data and restarts onboarding.

Built with Expo SDK 54 · React Native.
