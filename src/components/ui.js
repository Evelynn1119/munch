// Shared UI primitives.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { C } from '../../theme';

// Reserves a top band so floating headers never overlap content on web
// (where SafeAreaView inset is 0).
export function Screen({ children, bg = C.bg, pad = 0 }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ height: 28 }} />
      <View style={{ flex: 1, paddingHorizontal: pad }}>{children}</View>
    </SafeAreaView>
  );
}

export function Header({ title, onBack, dark, right }) {
  return (
    <View style={[s.header, dark && { backgroundColor: C.brand }]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={12} style={s.backBtn}>
          <Text style={[s.back, dark && { color: '#fff' }]}>‹</Text>
        </TouchableOpacity>
      ) : <View style={{ width: 30 }} />}
      <Text style={[s.title, dark && { color: '#fff' }]} numberOfLines={1}>{title}</Text>
      <View style={{ width: 30, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function PrimaryButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[s.primary, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={s.primaryTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

export function OutlineButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[s.outline, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={s.outlineTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Tag({ label, tone }) {
  const map = { green: [C.greenBg, C.green], amber: ['#FFF8E1', '#92600A'] };
  const [bg, fg] = map[tone] || ['#EEF2FF', C.brand];
  return (
    <View style={[s.tag, { backgroundColor: bg }]}>
      <Text style={[s.tagTxt, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function RestaurantRow({ r, onPress }) {
  return (
    <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={onPress}>
      <Image source={{ uri: r.image }} style={s.rowThumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowName}>{r.name}</Text>
        <Text style={s.rowMeta}>{r.cuisine} · {r.area} · {r.price}</Text>
        <Text style={s.rowSaved}>{r.visited ? '✓ Visited' : `Saved ${r.savedAgo}`}</Text>
      </View>
      <View style={s.rowSrc}><Text style={s.rowSrcTxt}>{r.source}</Text></View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  backBtn: { width: 30 },
  back: { fontSize: 28, color: C.brand, lineHeight: 30 },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: C.ink },
  primary: { backgroundColor: C.brand, borderRadius: 50, padding: 16, alignItems: 'center' },
  primaryTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  outline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.brand, borderRadius: 50, padding: 15, alignItems: 'center' },
  outlineTxt: { color: C.brand, fontSize: 15, fontWeight: '600' },
  tag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  tagTxt: { fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 10, marginBottom: 10, borderWidth: 0.5, borderColor: C.border },
  rowThumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#dde6f5' },
  rowName: { fontSize: 15, fontWeight: '700', color: C.ink },
  rowMeta: { fontSize: 12, color: C.sub, marginTop: 2 },
  rowSaved: { fontSize: 11, color: C.brandPress, marginTop: 2 },
  rowSrc: { backgroundColor: '#EEF2FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  rowSrcTxt: { fontSize: 10, fontWeight: '700', color: C.brand },
});
