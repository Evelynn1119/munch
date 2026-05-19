import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';
import { Tag, PrimaryButton, OutlineButton } from '../components/ui';

export default function RestaurantDetail({ id }) {
  const { state, dispatch } = useStore();
  const { goBack, navigate } = useNav();
  const r = state.restaurants.find((x) => x.id === id);
  const [pickList, setPickList] = useState(false);
  if (!r) return null;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={s.hero}>
        <Image source={{ uri: r.image }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['transparent', 'rgba(8,58,130,0.85)']} style={StyleSheet.absoluteFill} />
        <View style={{ height: 28 }} />
        <TouchableOpacity onPress={goBack} hitSlop={12} style={s.backBtn}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <View style={s.heroInfo}>
          <Text style={s.name}>{r.name}</Text>
          <Text style={s.meta}>{r.cuisine} · {r.area} · {r.km}km · {r.price}</Text>
          <View style={s.srcBadge}><Text style={s.srcTxt}>Saved from {r.source}</Text></View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <View style={s.tags}>
          {r.tags.map((t) => <Tag key={t} label={t} />)}
          {r.visited
            ? <Tag label={`Rated: ${r.rating}`} tone="green" />
            : <Tag label="Not visited" tone="amber" />}
        </View>

        <View style={s.aiNote}>
          <Text style={s.aiLbl}>◷  WHY YOU SAVED THIS</Text>
          <Text style={s.aiTxt}>{r.why}</Text>
        </View>

        <Text style={s.sec}>IN YOUR LISTS</Text>
        <View style={s.listChips}>
          {state.lists.map((l) => {
            const on = r.listIds.includes(l.id);
            return (
              <TouchableOpacity key={l.id} style={[s.listChip, on && s.listChipOn]}
                onPress={() => dispatch({ type: 'TOGGLE_LIST', restaurantId: r.id, listId: l.id })}>
                <Text style={[s.listChipTxt, on && { color: '#fff' }]}>{l.emoji} {l.name} {on ? '✓' : '+'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={s.ctas}>
        {!r.visited && (
          <OutlineButton label="Mark visited" style={{ flex: 1 }}
            onPress={() => navigate('rate', { id: r.id })} />
        )}
        <PrimaryButton label="Navigate →" style={{ flex: 1 }}
          onPress={() => navigate('rate', { id: r.id })} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { height: 250 },
  backBtn: { position: 'absolute', top: 30, left: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 26, color: '#fff', lineHeight: 28 },
  heroInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  name: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  srcBadge: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  srcTxt: { fontSize: 11, color: '#fff', fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  aiNote: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#D9E5FF', marginBottom: 16 },
  aiLbl: { fontSize: 10, fontWeight: '700', color: '#5B7BA6', letterSpacing: 1, marginBottom: 6 },
  aiTxt: { fontSize: 14, color: C.body, lineHeight: 22 },
  sec: { fontSize: 11, fontWeight: '700', color: C.sub, letterSpacing: 0.5, marginBottom: 10 },
  listChips: { gap: 8 },
  listChip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 14, backgroundColor: '#fff' },
  listChipOn: { backgroundColor: C.brand, borderColor: C.brand },
  listChipTxt: { fontSize: 14, fontWeight: '600', color: C.body },
  ctas: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 28, backgroundColor: C.bg },
});
