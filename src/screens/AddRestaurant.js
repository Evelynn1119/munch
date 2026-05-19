// In-app equivalent of "save from somewhere": paste a link / name, the app
// "reads" it (simulated — no API) and auto-tags it into lists.
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { C, IMG } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';
import { Header, PrimaryButton, Tag } from '../components/ui';

const SAMPLES = [
  { name: 'Le Petit Jardin', cuisine: 'French', area: '中山區', price: '$$$', tags: ['Date night', 'Wine'], image: IMG.hero },
  { name: 'Smokehouse 88', cuisine: 'BBQ', area: '信義區', price: '$$', tags: ['Groups', 'Comfort'], image: IMG.fusion },
  { name: 'Green Bowl', cuisine: 'Vegan', area: '大安區', price: '$', tags: ['Healthy', 'Solo'], image: IMG.coffee },
];

export default function AddRestaurant() {
  const { state, dispatch } = useStore();
  const { goBack, navigate } = useNav();
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('input'); // input | reading | done
  const [draft, setDraft] = useState(null);

  const ingest = (seed) => {
    const base = seed || SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
    const guessedName = !seed && /^[a-zA-Z一-龥 '&]+$/.test(text.trim()) && text.trim().length < 40
      ? text.trim() : base.name;
    setPhase('reading');
    setTimeout(() => {
      setDraft({
        id: 'r' + Date.now(),
        name: guessedName,
        area: base.area, km: (Math.random() * 4 + 0.5).toFixed(1) * 1,
        cuisine: base.cuisine, price: base.price, tags: base.tags,
        source: text.includes('instagram') ? 'Instagram'
          : text.includes('http') ? 'Web link' : 'Added by you',
        why: `Auto-tagged from what you shared — matched to ${base.tags.join(' & ')}.`,
        image: base.image, visited: false, rating: null,
        listIds: [state.lists[0]?.id].filter(Boolean), savedAgo: 'just now',
      });
      setPhase('done');
    }, 1200);
  };

  if (phase === 'reading') {
    return (
      <View style={{ flex: 1, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Reading the place…</Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Pulling name, area & vibe</Text>
      </View>
    );
  }

  if (phase === 'done' && draft) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ height: 28 }} />
        <Header title="Saved ✓" onBack={goBack} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={s.savedName}>{draft.name}</Text>
          <Text style={s.savedMeta}>{draft.cuisine} · {draft.area} · {draft.price}</Text>
          <View style={s.tags}>{draft.tags.map((t) => <Tag key={t} label={t} />)}</View>
          <View style={s.aiNote}>
            <Text style={s.aiLbl}>◷  AUTO-TAGGED</Text>
            <Text style={s.aiTxt}>{draft.why} Filed into “{state.lists[0]?.name}”.</Text>
          </View>
          <PrimaryButton label="Open it" style={{ marginTop: 8 }}
            onPress={() => {
              dispatch({ type: 'ADD_RESTAURANT', restaurant: draft });
              goBack();
              navigate('detail', { id: draft.id });
            }} />
          <TouchableOpacity style={{ padding: 16, alignItems: 'center' }}
            onPress={() => { dispatch({ type: 'ADD_RESTAURANT', restaurant: draft }); goBack(); }}>
            <Text style={{ color: C.brand, fontWeight: '600' }}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 28 }} />
      <Header title="Add a place" onBack={goBack} />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Text style={s.lbl}>Paste a link or type a name</Text>
        <TextInput
          style={s.input} value={text} onChangeText={setText}
          placeholder="instagram.com/p/…  ·  a blog link  ·  “Sushi Tyu”"
          placeholderTextColor={C.sub} autoCapitalize="none" multiline
        />
        <PrimaryButton label="Save it" style={{ marginTop: 16, opacity: text.trim() ? 1 : 0.45 }}
          onPress={() => text.trim() && ingest(null)} />

        <Text style={[s.lbl, { marginTop: 28 }]}>Or try a sample</Text>
        {SAMPLES.map((sm) => (
          <TouchableOpacity key={sm.name} style={s.sample} onPress={() => ingest(sm)} activeOpacity={0.85}>
            <Text style={s.sampleName}>{sm.name}</Text>
            <Text style={s.sampleMeta}>{sm.cuisine} · {sm.area}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  lbl: { fontSize: 13, fontWeight: '600', color: C.body, marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, fontSize: 15, color: C.body, minHeight: 70, textAlignVertical: 'top' },
  sample: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: C.border },
  sampleName: { fontSize: 15, fontWeight: '700', color: C.ink },
  sampleMeta: { fontSize: 12, color: C.sub, marginTop: 2 },
  savedName: { fontSize: 24, fontWeight: '800', color: C.ink },
  savedMeta: { fontSize: 13, color: C.sub, marginTop: 4, marginBottom: 14 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  aiNote: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#D9E5FF' },
  aiLbl: { fontSize: 10, fontWeight: '700', color: '#5B7BA6', letterSpacing: 1, marginBottom: 6 },
  aiTxt: { fontSize: 14, color: C.body, lineHeight: 22 },
});
