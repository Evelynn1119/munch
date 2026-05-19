import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../theme';
import { useStore, restaurantsInList } from '../store';
import { useNav } from '../nav';
import { RestaurantRow } from '../components/ui';

export default function Lists() {
  const { state } = useStore();
  const { navigate } = useNav();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 28 }} />
      <Text style={s.h1}>Your lists</Text>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {state.lists.map((l) => {
          const items = restaurantsInList(state, l.id);
          return (
            <TouchableOpacity key={l.id} style={s.list} activeOpacity={0.85}
              onPress={() => navigate('listDetail', { listId: l.id })}>
              <Text style={{ fontSize: 26 }}>{l.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.listName}>{l.name}</Text>
                <Text style={s.listMeta}>{items.length} place{items.length === 1 ? '' : 's'}</Text>
              </View>
              <Text style={s.chev}>›</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function ListDetail({ listId }) {
  const { state } = useStore();
  const { navigate, goBack } = useNav();
  const list = state.lists.find((l) => l.id === listId);
  const items = restaurantsInList(state, listId);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 28 }} />
      <View style={s.detailHead}>
        <TouchableOpacity onPress={goBack} hitSlop={12}><Text style={s.back}>‹</Text></TouchableOpacity>
        <Text style={s.h2}>{list?.emoji} {list?.name}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {items.length === 0
          ? <Text style={s.empty}>Nothing here yet. Add a place and tag it into this list.</Text>
          : items.map((r) => <RestaurantRow key={r.id} r={r} onPress={() => navigate('detail', { id: r.id })} />)}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 26, fontWeight: '800', color: C.ink, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  h2: { fontSize: 20, fontWeight: '800', color: C.ink },
  list: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
  listName: { fontSize: 16, fontWeight: '700', color: C.ink },
  listMeta: { fontSize: 12, color: C.sub, marginTop: 3 },
  chev: { fontSize: 24, color: C.sub },
  detailHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingBottom: 8 },
  back: { fontSize: 28, color: C.brand, lineHeight: 30 },
  empty: { fontSize: 14, color: C.sub, textAlign: 'center', marginTop: 50, lineHeight: 21, paddingHorizontal: 30 },
});
