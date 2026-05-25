import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Animated,
} from 'react-native';
import { C, IMG } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';

const ROTATING = [
  'What should I eat tonight? 🍜',
  'Find me a date night spot 🕯️',
  "Plan something for Mia's birthday",
  'Good and cheap near 大安?',
  "Something I've been meaning to try",
  'Best ramen in 信義區?',
];

const TRENDING = [
  { id: 't1', name: "An's Kitchen",  rating: 4.7, tags: ['#Fusion', '#Asia', '#Special'], image: IMG.fusion },
  { id: 't2', name: '麵屋武藏',       rating: 4.6, tags: ['#Ramen', '#LateNight'],         image: IMG.ramen  },
  { id: 't3', name: 'Sushi Counter', rating: 4.8, tags: ['#Omakase', '#DateNight'],       image: IMG.sushi  },
  { id: 't4', name: 'Café Bloom',    rating: 4.5, tags: ['#Coffee', '#Brunch'],            image: IMG.coffee },
];

const AI_SIGNALS = [
  'what','where','which','how','find','suggest','recommend',
  'i want','i need','tonight','should','can you','help',
  'looking for','give me','date night','birthday','hungry','craving','mood',
];

function isAIQuery(t) {
  if (!t.trim()) return false;
  if (t.includes('?')) return true;
  return AI_SIGNALS.some((s) => t.toLowerCase().includes(s));
}

// ─── Rotating placeholder ──────────────────────────────────────────────────
function RotatingHint({ visible }) {
  const [idx, setIdx] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycle = () => {
      Animated.sequence([
        Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.delay(80),
      ]).start(() => {
        setIdx((i) => (i + 1) % ROTATING.length);
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    };
    const timer = setInterval(cycle, 2800);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;
  return (
    <Animated.Text style={[s.rotatingHint, { opacity: fade }]} numberOfLines={1}>
      {ROTATING[idx]}
    </Animated.Text>
  );
}

// ─── Result row ───────────────────────────────────────────────────────────────
function ResultRow({ r, onPress }) {
  const sourceLabel = r.source === 'Instagram' ? 'From IG'
    : r.source === 'Trending' ? 'New !'
    : r.source ? `From ${r.source.slice(0, 4)}…` : null;

  return (
    <TouchableOpacity style={s.resultRow} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: r.image }} style={s.resultThumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.resultName} numberOfLines={1}>{r.name}</Text>
        <Text style={s.resultMeta}>{r.area}  ·  saved {r.savedAgo}</Text>
      </View>
      {sourceLabel && (
        <View style={[s.srcBadge, r.source === 'Trending' && s.srcBadgeNew]}>
          <Text style={[s.srcTxt, r.source === 'Trending' && { color: C.brand }]}>{sourceLabel}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Trending card ────────────────────────────────────────────────────────────
function TrendCard({ item, onPress }) {
  return (
    <TouchableOpacity style={s.trendCard} onPress={onPress} activeOpacity={0.88}>
      <Image source={{ uri: item.image }} style={s.trendImg} />
      <View style={s.trendBody}>
        <View style={s.trendTop}>
          <Text style={s.trendName} numberOfLines={1}>{item.name}</Text>
          <Text style={s.trendRating}>⭐ {item.rating}</Text>
        </View>
        <Text style={s.trendTags} numberOfLines={1}>{item.tags.join(' ')}</Text>
        <View style={s.trendActions}>
          <TouchableOpacity style={s.trendBtn}><Text style={s.trendBtnTxt}>+</Text></TouchableOpacity>
          <TouchableOpacity style={[s.trendBtn, s.trendBtnHeart]}><Text style={{ fontSize: 14 }}>♥</Text></TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function Search() {
  const { state } = useStore();
  const { goBack, navigate } = useNav();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const aiMode = isAIQuery(query);

  useEffect(() => {
    // Auto-focus when screen opens
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const results = query.trim()
    ? state.restaurants.filter((r) => {
        const t = query.toLowerCase();
        return [r.name, r.cuisine, r.area, ...r.tags].join(' ').toLowerCase().includes(t);
      })
    : [];

  const handleSubmit = () => {
    if (!query.trim()) return;
    if (aiMode) {
      navigate('aiChat', { query: query.trim() });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.brand }}>
      {/* Safe area */}
      <View style={{ height: 52 }} />

      {/* Search bar */}
      <View style={s.barWrap}>
        <TouchableOpacity onPress={goBack} style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.backTxt}>‹</Text>
        </TouchableOpacity>

        <View style={[s.bar, aiMode && s.barAI]}>
          <Text style={{ fontSize: 15, marginRight: 6 }}>{aiMode ? '✨' : '🔍'}</Text>

          {/* Rotating hint shown when empty */}
          <View style={{ flex: 1 }}>
            {!query && <RotatingHint visible />}
            <TextInput
              ref={inputRef}
              style={[s.barInput, !query && { position: 'absolute', width: '100%', opacity: 0 }]}
              value={query}
              onChangeText={setQuery}
              placeholder=""
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
              autoCapitalize="none"
            />
          </View>

          {query.trim() ? (
            <TouchableOpacity style={[s.sendBtn, aiMode && s.sendBtnAI]} onPress={handleSubmit}>
              <Text style={[s.sendTxt, aiMode && { color: C.brand }]}>→</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Results */}
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {results.length > 0 && (
          <View style={s.resultsBox}>
            {results.map((r) => (
              <ResultRow key={r.id} r={r} onPress={() => navigate('detail', { id: r.id })} />
            ))}
            <TouchableOpacity style={s.searchAllBtn}
              onPress={() => navigate('aiChat', { query: query.trim() })}>
              <Text style={s.searchAllIcon}>🔍</Text>
              <Text style={s.searchAllTxt}>Search All "{query}"</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Suggestion chips (shown when empty) */}
        {!query && (
          <View style={s.suggestWrap}>
            <Text style={s.suggestLbl}>Try asking…</Text>
            <View style={s.suggestRow}>
              {ROTATING.slice(0, 3).map((q) => (
                <TouchableOpacity key={q} style={s.suggestChip}
                  onPress={() => { setQuery(q.replace(/\s*[🍜🕯️]$/,'').trim()); }}>
                  <Text style={s.suggestChipTxt} numberOfLines={1}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Trending section */}
        <View style={s.trendSection}>
          <Text style={s.trendTitle}>Trending in 大安</Text>
          <Text style={s.trendSub}>What everyone is munching now</Text>
          <View style={s.trendGrid}>
            {TRENDING.map((item) => (
              <TrendCard key={item.id} item={item}
                onPress={() => {
                  const match = state.restaurants.find((r) => r.name === item.name);
                  if (match) navigate('detail', { id: match.id });
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  // Bar
  barWrap:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, gap: 10 },
  backBtn:  { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backTxt:  { color: '#fff', fontSize: 26, fontWeight: '600' },
  bar:      { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1.5, borderColor: 'transparent' },
  barAI:    { borderColor: C.amber, backgroundColor: '#FFFDF0' },
  barInput: { flex: 1, fontSize: 14, color: C.ink },
  rotatingHint: { fontSize: 14, color: C.sub, flex: 1 },
  sendBtn:  { width: 28, height: 28, borderRadius: 14, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center' },
  sendBtnAI:{ backgroundColor: C.amber },
  sendTxt:  { color: '#fff', fontSize: 14, fontWeight: '800' },

  // Results
  resultsBox:   { backgroundColor: C.brand, paddingBottom: 8 },
  resultRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 12, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.1)' },
  resultThumb:  { width: 48, height: 48, borderRadius: 10, backgroundColor: '#1a3a6b' },
  resultName:   { fontSize: 14, fontWeight: '700', color: '#fff' },
  resultMeta:   { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  srcBadge:     { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  srcBadgeNew:  { backgroundColor: '#fff' },
  srcTxt:       { fontSize: 10, fontWeight: '700', color: '#fff' },
  searchAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 50, paddingHorizontal: 18, paddingVertical: 13 },
  searchAllIcon:{ fontSize: 14 },
  searchAllTxt: { fontSize: 14, fontWeight: '600', color: '#fff' },

  // Suggestions
  suggestWrap: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 6 },
  suggestLbl:  { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5, marginBottom: 10 },
  suggestRow:  { gap: 8 },
  suggestChip: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 50, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  suggestChipTxt: { fontSize: 13, color: '#fff', fontWeight: '500' },

  // Trending
  trendSection: { backgroundColor: '#fff', marginTop: 14, paddingTop: 20, paddingHorizontal: 16, paddingBottom: 32 },
  trendTitle:   { fontSize: 18, fontWeight: '800', color: C.ink },
  trendSub:     { fontSize: 12, color: C.sub, marginTop: 2, marginBottom: 16 },
  trendGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  trendCard:    { width: '47%', backgroundColor: C.bg, borderRadius: 16, overflow: 'hidden', borderWidth: 0.5, borderColor: C.border },
  trendImg:     { width: '100%', height: 110, backgroundColor: '#dde6f5' },
  trendBody:    { padding: 10, gap: 4 },
  trendTop:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trendName:    { fontSize: 13, fontWeight: '700', color: C.ink, flex: 1 },
  trendRating:  { fontSize: 11, fontWeight: '600', color: C.amber },
  trendTags:    { fontSize: 10, color: C.sub },
  trendActions: { flexDirection: 'row', gap: 6, marginTop: 6 },
  trendBtn:     { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  trendBtnTxt:  { fontSize: 16, color: C.brand, fontWeight: '700', lineHeight: 20 },
  trendBtnHeart:{ borderColor: '#FFD0D0', backgroundColor: '#FFF5F5' },
});
