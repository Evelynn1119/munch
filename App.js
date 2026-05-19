// Munch Munch — prototype shell. Launcher → pick one of the three flows.
// Note: the Instagram post/share-sheet (Flow 2) and the lock screen (Flow 3)
// are illustrative CONTEXT only — they mock how the app gets invoked from
// outside. The real Munch Munch app begins once the share/notification fires.
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { C } from './theme';
import Flow1 from './flows/Flow1';
import Flow2 from './flows/Flow2';
import Flow3 from './flows/Flow3';

const FLOWS = [
  { key: 1, title: 'Onboarding', sub: 'New here — teach the app your taste', tag: 'IN-APP', C: Flow1 },
  { key: 2, title: 'Save from Instagram', sub: 'Share an IG post into Munch Munch', tag: 'CONTEXT: IG', C: Flow2 },
  { key: 3, title: 'Notification', sub: 'Rate a visit + plan a friend\'s birthday', tag: 'CONTEXT: LOCK', C: Flow3 },
];

export default function App() {
  const [flow, setFlow] = useState(null);
  const Active = flow && FLOWS.find((f) => f.key === flow).C;

  if (Active) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <Active onExit={() => setFlow(null)} />
      </>
    );
  }

  return (
    <View style={s.wrap}>
      <StatusBar barStyle="light-content" />
      <View style={s.hero}>
        <Text style={s.logo}>Munch{'\n'}Munch</Text>
        <Text style={s.tagline}>case-study prototype · 3 flows</Text>
      </View>
      <View style={s.list}>
        {FLOWS.map((f) => (
          <TouchableOpacity key={f.key} style={s.card} activeOpacity={0.85} onPress={() => setFlow(f.key)}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{f.title}</Text>
              <Text style={s.cardSub}>{f.sub}</Text>
            </View>
            <View style={s.tag}><Text style={s.tagTxt}>{f.tag}</Text></View>
            <Text style={s.chev}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.foot}>Tap a flow to run it · ✕ flows returns here</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.brand },
  hero: { paddingTop: 90, paddingBottom: 40, alignItems: 'center' },
  logo: { fontSize: 48, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 52 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 16, letterSpacing: 1 },
  list: { paddingHorizontal: 20, gap: 14 },
  card: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  cardSub: { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  tag: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  tagTxt: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 },
  chev: { fontSize: 24, color: 'rgba(255,255,255,0.4)' },
  foot: { position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)' },
});
