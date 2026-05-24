import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../theme';
import { useNav } from '../nav';

const TABS = [
  { key: 'home', icon: '🏠', label: 'Home' },
  { key: 'explore', icon: '🗺️', label: 'Map' },
  { key: 'lists', icon: '✨', label: 'AI Chat' },
  { key: 'profile', icon: '👤', label: 'Profile' },
];

export default function TabBar() {
  const { tab, switchTab, navigate } = useNav();
  return (
    <View style={s.bar}>
      {TABS.slice(0, 2).map((t) => <Item key={t.key} t={t} active={tab === t.key} onPress={() => switchTab(t.key)} />)}
      <TouchableOpacity style={s.add} onPress={() => navigate('add')} activeOpacity={0.85}>
        <Text style={s.addTxt}>+</Text>
      </TouchableOpacity>
      {TABS.slice(2).map((t) => <Item key={t.key} t={t} active={tab === t.key} onPress={() => switchTab(t.key)} />)}
    </View>
  );
}

function Item({ t, active, onPress }) {
  return (
    <TouchableOpacity style={s.item} onPress={onPress} activeOpacity={0.7}>
      <Text style={[s.icon, { opacity: active ? 1 : 0.35 }]}>{t.icon}</Text>
      <Text style={[s.label, { color: active ? C.brand : C.sub }]}>{t.label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: C.border,
    paddingTop: 8, paddingBottom: 24 },
  item: { alignItems: 'center', gap: 3, paddingHorizontal: 8 },
  icon: { fontSize: 22 },
  label: { fontSize: 10, fontWeight: '600' },
  add: { width: 50, height: 50, borderRadius: 25, backgroundColor: C.brand,
    alignItems: 'center', justifyContent: 'center', marginTop: -10,
    shadowColor: C.brand, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  addTxt: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
