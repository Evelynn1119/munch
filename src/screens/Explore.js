import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { C } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';
import { RestaurantRow } from '../components/ui';

export default function Explore() {
  const { state } = useStore();
  const { navigate } = useNav();
  const [q, setQ] = useState('');

  const term = q.trim().toLowerCase();
  const match = (r) => !term || [r.name, r.cuisine, r.area, ...r.tags].join(' ').toLowerCase().includes(term);
  const saved = state.restaurants.filter((r) => !r.visited && match(r));
  const visited = state.restaurants.filter((r) => r.visited && match(r));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 28, backgroundColor: C.brand }} />
      <View style={s.top}>
        <View style={s.bar}>
          <Text style={{ fontSize: 15 }}>🔍</Text>
          <TextInput
            style={s.input} value={q} onChangeText={setQ}
            placeholder="Search your places or a craving…" placeholderTextColor={C.sub}
            autoCapitalize="none"
          />
        </View>
        <Text style={s.found}>
          {saved.length + visited.length} match{saved.length + visited.length === 1 ? '' : 'es'}{term ? ` for "${q}"` : ' in your saves'}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {saved.length > 0 && <Text style={s.sec}>SAVED</Text>}
        {saved.map((r) => <RestaurantRow key={r.id} r={r} onPress={() => navigate('detail', { id: r.id })} />)}
        {visited.length > 0 && <Text style={s.sec}>VISITED</Text>}
        {visited.map((r) => <RestaurantRow key={r.id} r={r} onPress={() => navigate('detail', { id: r.id })} />)}
        {saved.length + visited.length === 0 && (
          <Text style={s.empty}>No matches. Try a cuisine, area, or vibe — or tap ＋ to add a place.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  top: { backgroundColor: C.brand, paddingHorizontal: 16, paddingBottom: 14 },
  bar: { backgroundColor: '#fff', borderRadius: 50, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: C.body },
  found: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 10 },
  sec: { fontSize: 11, fontWeight: '700', color: C.sub, letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
  empty: { fontSize: 14, color: C.sub, textAlign: 'center', marginTop: 50, lineHeight: 21, paddingHorizontal: 30 },
});
