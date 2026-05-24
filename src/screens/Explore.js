import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { C } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';

const { height: SH } = Dimensions.get('window');
const PEEK = 152;
const FULL = Math.round(SH * 0.56);

// Generic category bubbles scattered on mock map
const GENERICS = [
  { id: 'g1', icon: '☕', x: '8%',  y: '14%' },
  { id: 'g2', icon: '🍜', x: '64%', y: '26%' },
  { id: 'g3', icon: '🍺', x: '48%', y: '10%' },
  { id: 'g4', icon: '☕', x: '28%', y: '48%' },
  { id: 'g5', icon: '🎭', x: '76%', y: '44%' },
  { id: 'g6', icon: '🍜', x: '14%', y: '54%' },
  { id: 'g7', icon: '🍰', x: '40%', y: '34%' },
  { id: 'g8', icon: '🍺', x: '86%', y: '20%' },
];

// Mock map positions for each restaurant (percentage-based)
const POS = {
  r1: { x: '38%', y: '21%' },
  r2: { x: '56%', y: '42%' },
  r3: { x: '24%', y: '34%' },
  r4: { x: '68%', y: '58%' },
  r5: { x: '44%', y: '56%' },
};

// Friends' saves — shown as amber pins near the restaurant
const FRIEND_SAVES = [
  { friendName: 'Mia', avatar: '🎂', restId: 'r3', x: '32%', y: '26%' },
];

// Contextual social buzz per cuisine (mock)
const BUZZ = {
  'Cocktail Bar': ['"Best old fashioned in 大安 ✨"', '"Dimly lit, perfect for a slow evening"'],
  'Italian':      ['"Hand-made pasta — go for the truffle ravioli"', '"Worth every penny, book ahead"'],
  'Japanese':     ['"Each omakase piece was more surprising than the last"', '"Perfect for a special occasion"'],
  'Ramen':        ['"Rich broth, not too salty — late night must"', '"The chashu just melts 🙏"'],
  'Fusion':       ['"Trendy but the food delivers"', '"Great for groups, fun menu"'],
};

export default function Explore() {
  const { state } = useStore();
  const { navigate } = useNav();
  const [activeList, setActiveList] = useState(null);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const sheetH = useRef(new Animated.Value(PEEK)).current;

  const animateTo = (h) =>
    Animated.spring(sheetH, { toValue: h, useNativeDriver: false, bounciness: 3 }).start();

  const toggleSheet = () => {
    if (selected) { dismissSelected(); return; }
    const next = !expanded;
    animateTo(next ? FULL : PEEK);
    setExpanded(next);
  };

  const openPin = (r) => {
    setSelected(r);
    animateTo(FULL);
    setExpanded(true);
  };

  const dismissSelected = () => {
    setSelected(null);
    animateTo(PEEK);
    setExpanded(false);
  };

  const visibleRests = (activeList
    ? state.restaurants.filter((r) => r.listIds.includes(activeList))
    : state.restaurants.filter((r) => r.savedAgo !== 'Suggested')
  );
  const visibleIds = new Set(visibleRests.map((r) => r.id));

  const buzz = selected ? (BUZZ[selected.cuisine] || ['"A hidden gem worth visiting"', '"Great spot, highly recommend"']) : [];

  return (
    <View style={{ flex: 1 }}>

      {/* ── MAP BACKGROUND ─────────────────────────── */}
      <View style={s.map}>
        {/* Street grid */}
        <View style={[s.road, { top: '26%', left: 0, right: 0, height: 5 }]} />
        <View style={[s.road, { top: '48%', left: 0, right: 0, height: 3 }]} />
        <View style={[s.road, { top: '68%', left: 0, right: 0, height: 5 }]} />
        <View style={[s.road, { left: '20%', top: 0, bottom: 0, width: 4 }]} />
        <View style={[s.road, { left: '52%', top: 0, bottom: 0, width: 6 }]} />
        <View style={[s.road, { left: '76%', top: 0, bottom: 0, width: 3 }]} />

        {/* City blocks */}
        <View style={[s.block, { top: '4%',  left: '4%',  width: '14%', height: '20%' }]} />
        <View style={[s.block, { top: '4%',  left: '23%', width: '27%', height: '20%' }]} />
        <View style={[s.block, { top: '4%',  left: '55%', width: '19%', height: '20%' }]} />
        <View style={[s.block, { top: '30%', left: '4%',  width: '14%', height: '16%' }]} />
        <View style={[s.block, { top: '30%', left: '23%', width: '27%', height: '16%' }]} />
        <View style={[s.block, { top: '30%', left: '55%', width: '19%', height: '16%' }]} />
        <View style={[s.block, { top: '50%', left: '4%',  width: '14%', height: '16%' }]} />
        <View style={[s.block, { top: '50%', left: '23%', width: '27%', height: '16%' }]} />

        {/* Area label */}
        <View style={s.areaLabel}>
          <Text style={s.areaLabelTxt}>大安區  Da'an</Text>
        </View>

        {/* Generic category bubbles */}
        {GENERICS.map((g) => (
          <View key={g.id} style={[s.genericPin, { left: g.x, top: g.y }]}>
            <Text style={s.genericIcon}>{g.icon}</Text>
          </View>
        ))}

        {/* Friend pins (amber) */}
        {FRIEND_SAVES.map((fp) => {
          if (!visibleIds.has(fp.restId)) return null;
          const rest = state.restaurants.find((r) => r.id === fp.restId);
          return (
            <TouchableOpacity key={fp.friendName}
              style={[s.friendPin, { left: fp.x, top: fp.y }]}
              onPress={() => openPin(rest)} activeOpacity={0.8}>
              <Text style={s.friendAvatar}>{fp.avatar}</Text>
              <Text style={s.friendPinName}>{fp.friendName}</Text>
            </TouchableOpacity>
          );
        })}

        {/* User's restaurant pins (blue map-pin shape) */}
        {visibleRests.map((r) => {
          const pos = POS[r.id];
          if (!pos) return null;
          const isSelected = selected?.id === r.id;
          const hasFriend = FRIEND_SAVES.some((fp) => fp.restId === r.id);
          const color = isSelected ? C.amber : C.brand;
          return (
            <TouchableOpacity key={r.id}
              style={[s.pinWrap, { left: pos.x, top: pos.y }]}
              onPress={() => openPin(r)} activeOpacity={0.8}>
              {/* Pin head circle */}
              <View style={[s.pinHead, { backgroundColor: color, borderColor: isSelected ? '#fff' : 'rgba(255,255,255,0.7)' }]}>
                <Text style={s.pinInitial}>{r.name[0]}</Text>
              </View>
              {/* Pin tail triangle */}
              <View style={[s.pinTail, { borderTopColor: color }]} />
              {/* Name label below */}
              <Text style={[s.pinName, isSelected && { color: C.amber, fontWeight: '800' }]} numberOfLines={1}>
                {r.name.split(' ').slice(0, 2).join(' ')}
              </Text>
              {hasFriend && <View style={s.friendDot}><Text style={{ fontSize: 8 }}>👯</Text></View>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── BOTTOM SHEET ───────────────────────────── */}
      <Animated.View style={[s.sheet, { height: sheetH }]}>
        {/* Drag handle */}
        <TouchableOpacity onPress={toggleSheet} style={s.handleArea} activeOpacity={0.6}>
          <View style={s.handleBar} />
          {!selected && (
            <Text style={s.handleHint}>{expanded ? 'Tap to collapse' : 'Drag up to see your saves'}</Text>
          )}
        </TouchableOpacity>

        {selected ? (
          /* ── RESTAURANT PREVIEW ── */
          <View style={{ flex: 1 }}>
            <View style={s.previewHead}>
              <TouchableOpacity onPress={dismissSelected} style={s.previewBack}>
                <Text style={s.previewBackTxt}>‹ Map</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
              <Image source={{ uri: selected.image }} style={s.previewImg} />
              <Text style={s.previewName}>{selected.name}</Text>
              <Text style={s.previewMeta}>{selected.cuisine} · {selected.area} · {selected.price}</Text>
              {selected.source && (
                <View style={s.sourceBadge}>
                  <Text style={s.sourceTxt}>Saved from {selected.source}</Text>
                </View>
              )}
              <View style={s.whyBox}>
                <Text style={s.boxLabel}>✦  WHY YOU SAVED THIS</Text>
                <Text style={s.boxTxt}>{selected.why}</Text>
              </View>
              <View style={s.buzzBox}>
                <Text style={s.boxLabel}>💬  WHAT PEOPLE ARE SAYING</Text>
                {buzz.map((b, i) => <Text key={i} style={[s.boxTxt, i > 0 && { marginTop: 6 }]}>{b}</Text>)}
              </View>
              <TouchableOpacity style={s.viewBtn} activeOpacity={0.85}
                onPress={() => navigate('detail', { id: selected.id })}>
                <Text style={s.viewBtnTxt}>View full details →</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : (
          /* ── LIST FILTERS + CARDS ── */
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}>
              <TouchableOpacity style={[s.pill, !activeList && s.pillOn]}
                onPress={() => setActiveList(null)}>
                <Text style={[s.pillTxt, !activeList && s.pillTxtOn]}>🗂  All places</Text>
              </TouchableOpacity>
              {state.lists.map((l) => (
                <TouchableOpacity key={l.id}
                  style={[s.pill, activeList === l.id && s.pillOn]}
                  onPress={() => setActiveList(activeList === l.id ? null : l.id)}>
                  <Text style={[s.pillTxt, activeList === l.id && s.pillTxtOn]}>{l.emoji}  {l.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {expanded && (
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 16 }}>
                {visibleRests.length === 0 && (
                  <Text style={s.empty}>No places in this list yet.</Text>
                )}
                {visibleRests.map((r) => (
                  <TouchableOpacity key={r.id} style={s.row} onPress={() => openPin(r)} activeOpacity={0.85}>
                    <Image source={{ uri: r.image }} style={s.rowThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.rowName}>{r.name}</Text>
                      <Text style={s.rowMeta}>{r.cuisine} · {r.area}</Text>
                    </View>
                    <Text style={{ fontSize: 18, color: C.sub }}>›</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  // Map
  map: { flex: 1, backgroundColor: '#eae6e0', overflow: 'hidden' },
  road: { position: 'absolute', backgroundColor: '#fff' },
  block: { position: 'absolute', backgroundColor: '#ddd9d2', borderRadius: 3 },
  areaLabel: { position: 'absolute', bottom: 12, right: 14, backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  areaLabelTxt: { fontSize: 11, fontWeight: '600', color: C.body },

  // Generic pins — small & subtle so they don't compete with saved pins
  genericPin: { position: 'absolute', width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.72)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  genericIcon: { fontSize: 12 },

  // User pins — classic teardrop map-pin shape
  pinWrap: { position: 'absolute', alignItems: 'center' },
  pinHead: { width: 34, height: 34, borderRadius: 17, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 6 },
  pinInitial: { fontSize: 14, fontWeight: '800', color: '#fff' },
  pinTail: { width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 9, borderStyle: 'solid', borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1 },
  pinName: { fontSize: 10, fontWeight: '700', color: C.ink, marginTop: 3, textAlign: 'center', maxWidth: 72, backgroundColor: 'rgba(255,255,255,0.82)', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2, overflow: 'hidden' },
  friendDot: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: C.amber, borderWidth: 1.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },

  // Friend pins
  friendPin: { position: 'absolute', backgroundColor: C.amber, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5, borderWidth: 2, borderColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 4, shadowColor: C.amber, shadowOpacity: 0.35, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  friendAvatar: { fontSize: 11 },
  friendPinName: { fontSize: 10, fontWeight: '700', color: '#fff' },

  // Bottom sheet
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 10 },
  handleArea: { alignItems: 'center', paddingTop: 10, paddingBottom: 8 },
  handleBar: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB' },
  handleHint: { fontSize: 11, color: C.sub, marginTop: 4 },

  // List filter pills
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: C.border, backgroundColor: '#fff' },
  pillOn: { backgroundColor: C.brand, borderColor: C.brand },
  pillTxt: { fontSize: 12, fontWeight: '600', color: C.body },
  pillTxtOn: { color: '#fff' },

  // Restaurant row in expanded list
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.bg, borderRadius: 14, padding: 10 },
  rowThumb: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#dde6f5' },
  rowName: { fontSize: 14, fontWeight: '700', color: C.ink },
  rowMeta: { fontSize: 12, color: C.sub, marginTop: 2 },
  empty: { fontSize: 13, color: C.sub, textAlign: 'center', marginTop: 20 },

  // Restaurant preview
  previewHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
  previewBack: { paddingRight: 12, paddingVertical: 4 },
  previewBackTxt: { fontSize: 14, fontWeight: '600', color: C.brand },
  previewImg: { width: '100%', height: 140, borderRadius: 14, backgroundColor: '#dde6f5', marginBottom: 12 },
  previewName: { fontSize: 18, fontWeight: '800', color: C.ink },
  previewMeta: { fontSize: 13, color: C.sub, marginTop: 3, marginBottom: 8 },
  sourceBadge: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
  sourceTxt: { fontSize: 11, fontWeight: '700', color: C.brand },
  whyBox: { backgroundColor: '#EEF2FF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#D9E5FF', marginBottom: 10 },
  buzzBox: { backgroundColor: C.bg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border, marginBottom: 14 },
  boxLabel: { fontSize: 10, fontWeight: '700', color: C.brandPress, letterSpacing: 0.8, marginBottom: 6 },
  boxTxt: { fontSize: 13, color: C.body, lineHeight: 19, fontStyle: 'italic' },
  viewBtn: { backgroundColor: C.brand, borderRadius: 50, padding: 15, alignItems: 'center' },
  viewBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
