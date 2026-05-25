import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { C, IMG } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';
import { Tag, PrimaryButton } from '../components/ui';

const { height: SH } = Dimensions.get('window');

const SAMPLES = [
  { name: 'Le Petit Jardin', cuisine: 'French',  area: '中山區', price: '$$$', tags: ['Date night', 'Wine'],    image: IMG.hero   },
  { name: 'Smokehouse 88',   cuisine: 'BBQ',     area: '信義區', price: '$$',  tags: ['Groups', 'Comfort'],     image: IMG.fusion },
  { name: 'Green Bowl',      cuisine: 'Vegan',   area: '大安區', price: '$',   tags: ['Healthy', 'Solo'],       image: IMG.coffee },
];

const LINK_SOURCES = [
  { match: ['instagram', 'instagr.am'], label: 'Instagram', color: '#E1306C', icon: '📸' },
  { match: ['tiktok', 'vm.tiktok'],     label: 'TikTok',    color: '#111',    icon: '🎵' },
  { match: ['youtube', 'youtu.be'],     label: 'YouTube',   color: '#FF0000', icon: '▶️' },
  { match: ['google.com/maps', 'maps.app', 'maps.apple'], label: 'Google Maps', color: '#4285F4', icon: '🗺️' },
];

function detectSource(text) {
  const t = (text || '').toLowerCase();
  return LINK_SOURCES.find((s) => s.match.some((m) => t.includes(m)))
    || (t.includes('http') ? { label: 'Web link', color: C.brand, icon: '🔗' } : null);
}

// ─── Loading phase ────────────────────────────────────────────────────────────
function ReadingScreen({ mode }) {
  const msgs = {
    paste:  ['Reading the link…',   'Pulling name, area & vibe'],
    camera: ['Reading the photo…',  'Scanning sign & details'],
    voice:  ['Processing voice…',   'Transcribing what you said'],
    type:   ['Saving the place…',   'Auto-tagging from your input'],
  };
  const [title, sub] = msgs[mode] || msgs.paste;
  return (
    <View style={{ flex: 1, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
      <ActivityIndicator color="#fff" size="large" />
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{sub}</Text>
    </View>
  );
}

// ─── Camera mock ──────────────────────────────────────────────────────────────
function CameraView({ onCapture, onBack }) {
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanY, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const translateY = scanY.interpolate({ inputRange: [0, 1], outputRange: [0, 220] });

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ height: 52, backgroundColor: '#0a0a0a', justifyContent: 'flex-end', paddingHorizontal: 18, paddingBottom: 10 }}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>✕ Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Viewfinder */}
      <View style={cam.frame}>
        <Animated.View style={[cam.scanLine, { transform: [{ translateY }] }]} />
        {/* Corner brackets */}
        <View style={[cam.corner, { top: 0,  left: 0,  borderRightWidth: 0, borderBottomWidth: 0 }]} />
        <View style={[cam.corner, { top: 0,  right: 0, borderLeftWidth: 0,  borderBottomWidth: 0 }]} />
        <View style={[cam.corner, { bottom: 0, left: 0,  borderRightWidth: 0, borderTopWidth: 0 }]} />
        <View style={[cam.corner, { bottom: 0, right: 0, borderLeftWidth: 0,  borderTopWidth: 0 }]} />
        <Text style={cam.hint}>Point at the restaurant name or sign</Text>
      </View>

      {/* Shutter */}
      <View style={{ alignItems: 'center', paddingVertical: 36 }}>
        <TouchableOpacity style={cam.shutter} onPress={onCapture} activeOpacity={0.8}>
          <View style={cam.shutterInner} />
        </TouchableOpacity>
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 14 }}>Tap to capture</Text>
      </View>
    </View>
  );
}

// ─── Voice mock ───────────────────────────────────────────────────────────────
function VoiceView({ onDone, onBack }) {
  const p1 = useRef(new Animated.Value(1)).current;
  const p2 = useRef(new Animated.Value(1)).current;
  const p3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = (val, delay) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(val, { toValue: 1.4, duration: 550, useNativeDriver: true }),
        Animated.timing(val, { toValue: 1.0, duration: 550, useNativeDriver: true }),
      ]));
    Animated.parallel([pulse(p1, 0), pulse(p2, 180), pulse(p3, 360)]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.brand }}>
      <View style={{ height: 52, justifyContent: 'flex-end', paddingHorizontal: 18, paddingBottom: 10 }}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '600' }}>✕ Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        {/* Pulsing rings */}
        <View style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={[vox.ring, { width: 180, height: 180, borderRadius: 90, opacity: 0.12, transform: [{ scale: p3 }] }]} />
          <Animated.View style={[vox.ring, { width: 130, height: 130, borderRadius: 65, opacity: 0.18, transform: [{ scale: p2 }] }]} />
          <Animated.View style={[vox.ring, { width: 88,  height: 88,  borderRadius: 44, opacity: 0.28, transform: [{ scale: p1 }] }]} />
          <Text style={{ fontSize: 30, position: 'absolute' }}>🎤</Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 32 }}>Listening…</Text>
        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
          Say the restaurant name or describe it — "that ramen spot in 信義 on TikTok"
        </Text>
        <TouchableOpacity style={vox.doneBtn} onPress={onDone} activeOpacity={0.85}>
          <Text style={{ color: C.brand, fontWeight: '800', fontSize: 16 }}>Done →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AddRestaurant() {
  const { state, dispatch } = useStore();
  const { goBack, navigate } = useNav();
  const [phase, setPhase] = useState('pick');   // pick | paste | camera | voice | type | reading | done
  const [mode, setMode]   = useState('paste');  // which modality triggered reading
  const [text, setText]   = useState('');
  const [typeName, setTypeName] = useState('');
  const [draft, setDraft] = useState(null);

  const source = detectSource(text);

  const ingest = (seed, srcMode) => {
    setMode(srcMode || 'paste');
    setPhase('reading');
    const base = seed || SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
    const guessedName =
      typeName.trim()
      || (/^[a-zA-Z一-龥 '&]+$/.test(text.trim()) && text.trim().length < 40 ? text.trim() : base.name);
    setTimeout(() => {
      setDraft({
        id: 'r' + Date.now(),
        name: guessedName,
        area: base.area,
        km: parseFloat((Math.random() * 4 + 0.5).toFixed(1)),
        cuisine: base.cuisine, price: base.price, tags: base.tags,
        source: source?.label || (srcMode === 'camera' ? 'Camera' : srcMode === 'voice' ? 'Voice' : 'Added by you'),
        why: `Saved via ${srcMode === 'camera' ? 'photo' : srcMode === 'voice' ? 'voice' : 'link'} — matched to ${base.tags.join(' & ')}.`,
        image: base.image, visited: false, rating: null,
        listIds: [state.lists[0]?.id].filter(Boolean), savedAgo: 'just now',
      });
      setPhase('done');
    }, 1600);
  };

  // ── Reading ──
  if (phase === 'reading') return <ReadingScreen mode={mode} />;

  // ── Camera ──
  if (phase === 'camera') return (
    <CameraView
      onBack={() => setPhase('pick')}
      onCapture={() => ingest(null, 'camera')}
    />
  );

  // ── Voice ──
  if (phase === 'voice') return (
    <VoiceView
      onBack={() => setPhase('pick')}
      onDone={() => ingest(null, 'voice')}
    />
  );

  // ── Done ──
  if (phase === 'done' && draft) return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 52 }} />
      <View style={s.doneHeader}>
        <View style={s.doneCheck}><Text style={{ fontSize: 24 }}>✓</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.doneName}>{draft.name}</Text>
          <Text style={s.doneMeta}>{draft.cuisine} · {draft.area} · {draft.price}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={s.tags}>{draft.tags.map((t) => <Tag key={t} label={t} />)}</View>
        <View style={s.aiNote}>
          <Text style={s.aiLbl}>✦  AUTO-TAGGED</Text>
          <Text style={s.aiTxt}>{draft.why}</Text>
          <Text style={[s.aiTxt, { marginTop: 6, color: C.brand, fontWeight: '600' }]}>
            Filed into "{state.lists[0]?.name}"
          </Text>
        </View>
        <PrimaryButton label="Open it →" style={{ marginTop: 16 }}
          onPress={() => { dispatch({ type: 'ADD_RESTAURANT', restaurant: draft }); goBack(); navigate('detail', { id: draft.id }); }} />
        <TouchableOpacity style={{ padding: 16, alignItems: 'center' }}
          onPress={() => { dispatch({ type: 'ADD_RESTAURANT', restaurant: draft }); goBack(); }}>
          <Text style={{ color: C.sub, fontWeight: '600' }}>Save & go back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // ── Pick mode ──
  if (phase === 'pick') return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 52, backgroundColor: C.brand }} />
      <View style={s.pickHeader}>
        <TouchableOpacity onPress={goBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.pickBack}>✕</Text>
        </TouchableOpacity>
        <Text style={s.pickTitle}>Save a place</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={s.pickSub}>How do you want to save it?</Text>

        <View style={s.modeGrid}>
          {[
            { key: 'paste',  icon: '🔗', title: 'Paste a link',  sub: 'TikTok · IG · Maps · YouTube', bg: '#EEF2FF', border: '#D9E5FF' },
            { key: 'camera', icon: '📷', title: 'Take a photo',  sub: 'Point at the sign',             bg: '#FFF8E6', border: '#FFE9A0' },
            { key: 'voice',  icon: '🎤', title: 'Say it',        sub: 'Speak the name or vibe',        bg: '#E6F9F2', border: '#A7E9CC' },
            { key: 'type',   icon: '✏️', title: 'Type it',       sub: 'Name, cuisine, area',           bg: '#F3F4F6', border: C.border },
          ].map((m) => (
            <TouchableOpacity key={m.key}
              style={[s.modeCard, { backgroundColor: m.bg, borderColor: m.border }]}
              onPress={() => setPhase(m.key)} activeOpacity={0.82}>
              <Text style={s.modeIcon}>{m.icon}</Text>
              <Text style={s.modeTitle}>{m.title}</Text>
              <Text style={s.modeSub}>{m.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick samples */}
        <Text style={s.sampleLbl}>Or try a sample save</Text>
        {SAMPLES.map((sm) => (
          <TouchableOpacity key={sm.name} style={s.sampleRow} onPress={() => ingest(sm, 'paste')} activeOpacity={0.85}>
            <View style={{ flex: 1 }}>
              <Text style={s.sampleName}>{sm.name}</Text>
              <Text style={s.sampleMeta}>{sm.cuisine} · {sm.area}</Text>
            </View>
            <Text style={{ color: C.brand, fontWeight: '700', fontSize: 15 }}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // ── Paste / type input ──
  const isPaste = phase === 'paste';
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 52, backgroundColor: C.brand }} />
      <View style={s.pickHeader}>
        <TouchableOpacity onPress={() => { setPhase('pick'); setText(''); setTypeName(''); }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.pickBack}>‹</Text>
        </TouchableOpacity>
        <Text style={s.pickTitle}>{isPaste ? 'Paste a link' : 'Type it in'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        {isPaste ? (
          <>
            <Text style={s.inputLbl}>Paste any link or type a name</Text>
            {source && (
              <View style={[s.sourceBadge, { backgroundColor: source.color + '18', borderColor: source.color + '40' }]}>
                <Text style={{ fontSize: 13 }}>{source.icon}</Text>
                <Text style={[s.sourceTxt, { color: source.color }]}>{source.label} detected</Text>
              </View>
            )}
            <TextInput
              style={s.textInput} value={text} onChangeText={setText}
              placeholder={'instagram.com/p/…\ntiktok.com/@…\ngoogle.com/maps/…'}
              placeholderTextColor={C.sub} autoCapitalize="none" multiline
              autoFocus
            />
            <PrimaryButton
              label="Save it →"
              style={{ marginTop: 16, opacity: text.trim() ? 1 : 0.4 }}
              onPress={() => text.trim() && ingest(null, 'paste')}
            />
          </>
        ) : (
          <>
            <Text style={s.inputLbl}>Restaurant name</Text>
            <TextInput
              style={[s.textInput, { minHeight: 52 }]} value={typeName} onChangeText={setTypeName}
              placeholder="e.g. 麵屋武藏, Trattoria di Primo…"
              placeholderTextColor={C.sub} autoCapitalize="words" autoFocus
            />
            <PrimaryButton
              label="Save it →"
              style={{ marginTop: 16, opacity: typeName.trim() ? 1 : 0.4 }}
              onPress={() => typeName.trim() && ingest(null, 'type')}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Pick
  pickHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, backgroundColor: C.brand },
  pickBack:  { color: '#fff', fontSize: 22, fontWeight: '600' },
  pickTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  pickSub:   { fontSize: 13, color: C.sub, marginBottom: 18 },
  modeGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  modeCard:  { width: '47%', borderRadius: 18, borderWidth: 1.5, padding: 18, gap: 6 },
  modeIcon:  { fontSize: 28 },
  modeTitle: { fontSize: 15, fontWeight: '800', color: C.ink },
  modeSub:   { fontSize: 12, color: C.sub, lineHeight: 17 },
  sampleLbl: { fontSize: 12, fontWeight: '700', color: C.sub, letterSpacing: 0.5, marginBottom: 10 },
  sampleRow: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0.5, borderColor: C.border },
  sampleName:{ fontSize: 15, fontWeight: '700', color: C.ink },
  sampleMeta:{ fontSize: 12, color: C.sub, marginTop: 2 },
  // Paste / type input
  inputLbl:  { fontSize: 13, fontWeight: '700', color: C.body, marginBottom: 8 },
  sourceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 10 },
  sourceTxt: { fontSize: 12, fontWeight: '700' },
  textInput: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, fontSize: 15, color: C.body, minHeight: 90, textAlignVertical: 'top' },
  // Done
  doneHeader:{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.brand, padding: 20 },
  doneCheck: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  doneName:  { fontSize: 20, fontWeight: '800', color: '#fff' },
  doneMeta:  { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  tags:      { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  aiNote:    { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#D9E5FF' },
  aiLbl:     { fontSize: 10, fontWeight: '700', color: '#5B7BA6', letterSpacing: 1, marginBottom: 6 },
  aiTxt:     { fontSize: 14, color: C.body, lineHeight: 22 },
});

const cam = StyleSheet.create({
  frame:      { flex: 1, margin: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 14, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 20 },
  scanLine:   { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: C.brand, opacity: 0.9 },
  corner:     { position: 'absolute', width: 22, height: 22, borderColor: '#fff', borderWidth: 3 },
  hint:       { color: 'rgba(255,255,255,0.55)', fontSize: 12, textAlign: 'center' },
  shutter:    { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff' },
});

const vox = StyleSheet.create({
  ring:    { position: 'absolute', backgroundColor: '#fff' },
  doneBtn: { marginTop: 52, backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 40, paddingVertical: 16 },
});
