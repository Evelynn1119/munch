import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C, CUISINE_TOTAL } from '../../theme';
import { useStore, cuisinesExplored } from '../store';
import { useNav } from '../nav';
import { PrimaryButton } from '../components/ui';

const RATINGS = ['Loved it', 'Pretty good', 'It was fine', 'Not again'];
const SECTIONS = [
  ['Food', ['Order the signature', 'Skip dessert', 'Portions were big', 'A bit overhyped']],
  ['Vibe', ['Date-night approved', 'Too loud', 'Great for groups', 'Bring a camera']],
  ['Price', ['Worth every penny', 'Affordable treat', 'A bit pricey']],
];

export default function RateVisit({ id }) {
  const { state, dispatch } = useStore();
  const { goBack } = useNav();
  const r = state.restaurants.find((x) => x.id === id);
  const [phase, setPhase] = useState('rate');
  const [rating, setRating] = useState(null);
  const [chips, setChips] = useState({});
  if (!r) return null;

  if (phase === 'stamp') {
    const explored = cuisinesExplored(state);
    return (
      <View style={st.stampWrap}>
        <Text style={st.stampH1}>Stamp collected!</Text>
        <Text style={st.stampRest}>{r.name}</Text>
        <View style={st.stampBadge}><Text style={{ fontSize: 64 }}>🍽️</Text></View>
        <View style={st.cuisinePill}><Text style={st.cuisineTxt}>{r.cuisine} cuisine</Text></View>
        <View style={st.progRow}>
          <Text style={st.progL}>Cuisines explored</Text>
          <Text style={st.progR}>{explored.length} of {CUISINE_TOTAL}</Text>
        </View>
        <View style={st.bar}><View style={[st.barFill, { width: `${(explored.length / CUISINE_TOTAL) * 100}%` }]} /></View>
        <Text style={st.visits}>You've now been to {state.restaurants.filter((x) => x.visited).length} places.</Text>
        <PrimaryButton label="Done" style={{ width: 240, backgroundColor: C.brandSoft }} onPress={goBack} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.brand }}>
      <Image source={{ uri: r.image }} style={{ height: 150 }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
        <Text style={st.rest}>{r.name}</Text>
        <Text style={st.h1}>How was it?</Text>
        <Text style={st.sub}>Quick gut check — no stars, just vibes.</Text>
        <View style={st.grid}>
          {RATINGS.map((x) => (
            <TouchableOpacity key={x} style={[st.opt, rating === x && st.optOn]}
              onPress={() => setRating(x)} activeOpacity={0.85}>
              <Text style={[st.optTxt, rating === x && { color: C.brand }]}>{x}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {SECTIONS.map(([label, items]) => (
          <View key={label} style={{ marginBottom: 14 }}>
            <Text style={st.secLbl}>{label}</Text>
            <View style={st.chips}>
              {items.map((c) => {
                const on = chips[c];
                return (
                  <TouchableOpacity key={c} style={[st.chip, on && st.chipOn]}
                    onPress={() => setChips({ ...chips, [c]: !on })}>
                    <Text style={[st.chipTxt, on && { color: C.brand }]}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[st.submit, { opacity: rating ? 1 : 0.45 }]}
        onPress={() => {
          if (!rating) return;
          dispatch({ type: 'MARK_VISITED', restaurantId: r.id, rating });
          setPhase('stamp');
        }}>
        <Text style={st.submitTxt}>Drop my rating →</Text>
      </TouchableOpacity>
    </View>
  );
}

const st = StyleSheet.create({
  rest: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  h1: { fontSize: 26, fontWeight: '800', color: '#fff' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 9, marginBottom: 18 },
  opt: { width: '47%', backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.16)', borderRadius: 15, paddingVertical: 18, alignItems: 'center' },
  optOn: { backgroundColor: '#fff', borderColor: '#fff' },
  optTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
  secLbl: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, marginBottom: 7 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)' },
  chipOn: { backgroundColor: '#fff', borderColor: '#fff' },
  chipTxt: { fontSize: 12, fontWeight: '500', color: '#fff' },
  submit: { margin: 18, padding: 16, backgroundColor: '#fff', borderRadius: 50, alignItems: 'center' },
  submitTxt: { color: C.brand, fontSize: 15, fontWeight: '700' },
  stampWrap: { flex: 1, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 6 },
  stampH1: { fontSize: 26, fontWeight: '800', color: '#fff' },
  stampRest: { fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 22 },
  stampBadge: { width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cuisinePill: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.38)', borderRadius: 30, paddingHorizontal: 22, paddingVertical: 9, marginBottom: 22 },
  cuisineTxt: { fontSize: 14, color: '#fff', fontWeight: '600' },
  progRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 290 },
  progL: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },
  progR: { fontSize: 13, color: '#fff', fontWeight: '700' },
  bar: { width: '100%', maxWidth: 290, height: 6, backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 3, marginTop: 8, marginBottom: 10 },
  barFill: { height: 6, backgroundColor: '#fff', borderRadius: 3 },
  visits: { fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 26 },
});
