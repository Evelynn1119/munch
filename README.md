# Munch Munch

Mobile prototype of a restaurant-saving app, built in React Native (Expo) from
three HTML case-study flows. One launcher → three runnable flows.

| Flow | What it shows |
|------|---------------|
| **1 · Onboarding** | First run: value props → sign up → personalization quiz → taste-profile result. Fully in-app. |
| **2 · Save from Instagram** | The IG post + share sheet are **context only** — they mock how the app is invoked from outside. The real app begins at the "Saved" banner → restaurant detail with AI auto-tagging. |
| **3 · Notification** | The lock screen is **context only** — a mock of the incoming notification. The real app begins after the tap: rate the visit → stamp → home → AI chat to plan a friend's birthday. |

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android). Tap a flow to run it;
the **✕ flows** chip (top-right) returns to the launcher.

## Notes

- Imagery uses Unsplash URLs (the original prototypes baked images in as base64).
- Bug fix vs. the original Flow 1: "No, I'll pass" now skips the whole quiz to
  the result, instead of dropping the user into quiz question 2.
- This is a clickable prototype, not a production app — flows are scripted
  (e.g. the Mia AI chat is a fixed conversation).

Built with Expo SDK 54 · React Native.
