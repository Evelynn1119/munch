import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { C } from '../../theme';
import { useStore } from '../store';
import { PrimaryButton, OutlineButton } from '../components/ui';

const VALUE = [
  { emoji: '🍜', t: 'Every restaurant\nworth remembering', s: 'One home for the places you actually want to try.' },
  { emoji: '✨', t: 'Saved from anywhere', s: 'A link, a friend, that 2am blog — auto-tagged into lists.' },
  { emoji: '📍', t: 'Never lose a craving', s: 'Reminders, ratings, and a stamp for every cuisine you explore.' },
];

const TASTES = ['The Atmosphere Seeker', 'The Planner', 'The Spontaneous Foodie', 'The Comfort Seeker'];
const Q = [
  {
    q: 'When picking a restaurant, what ruins it for you?',
    opts: ['Too many choices', 'Long queues', 'Everyone disagrees', 'Recommendations miss'],
  },
  {
    q: 'When does your appetite come alive?',
    opts: ['Late-night cravings', 'Weekend brunch', 'First bite after work', 'Celebrating something'],
  },
];

export default function Onboarding() {
  const { dispatch } = useStore();
  const [step, setStep] = useState(0); // 0..2 value, 3 auth, 4..5 quiz, 6 result
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [ans, setAns] = useState({});
  const taste = TASTES[(ans[0] ?? 0) % TASTES.length];

  if (step <= 2) {
    const v = VALUE[step];
    return (
      <SafeAreaView style={s.splash}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Text style={{ fontSize: 76 }}>{v.emoji}</Text>
          <Text style={s.vTitle}>{v.t}</Text>
          <Text style={s.vSub}>{v.s}</Text>
        </View>
        <View style={s.vNav}>
          <TouchableOpacity onPress={() => setStep(3)}><Text style={s.vSkip}>Skip</Text></TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 7 }}>
            {[0, 1, 2].map((d) => <View key={d} style={[s.dot, d === step && s.dotOn]} />)}
          </View>
          <TouchableOpacity onPress={() => setStep(step === 2 ? 3 : step + 1)}>
            <Text style={s.vNext}>{step === 2 ? 'Get started' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 3) {
    const ok = name.trim() && username.trim() && email.trim() && pw.length >= 6;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={s.formWrap} keyboardShouldPersistTaps="handled">
          <Text style={s.logo}>Munch Munch</Text>
          <Text style={s.h1}>Create your account</Text>
          <Text style={s.sub}>Just the basics and we can get you started.</Text>
          <Field label="Name" value={name} onChangeText={setName} placeholder="What should we call you?" />
          <Field label="Username" value={username} onChangeText={setUsername} placeholder="@yourname" autoCapitalize="none" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Password" value={pw} onChangeText={setPw} placeholder="6+ characters" secureTextEntry />
          <PrimaryButton label="Continue" style={{ marginTop: 18, opacity: ok ? 1 : 0.45 }}
            onPress={() => ok && setStep(4)} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 4 || step === 5) {
    const qi = step - 4;
    const q = Q[qi];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ height: 28 }} />
        <View style={s.qWrap}>
          <View style={s.progBar}><View style={[s.progFill, { width: `${(qi + 1) * 50}%` }]} /></View>
          <Text style={s.qKicker}>Personalize · {qi + 1} of 2</Text>
          <Text style={s.qTitle}>{q.q}</Text>
          <View style={{ gap: 12, marginTop: 18 }}>
            {q.opts.map((o, i) => {
              const on = ans[qi] === i;
              return (
                <TouchableOpacity key={i} style={[s.qOpt, on && s.qOptOn]}
                  onPress={() => setAns({ ...ans, [qi]: i })} activeOpacity={0.85}>
                  <Text style={[s.qOptTxt, on && { color: '#fff' }]}>{o}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ flex: 1 }} />
          <PrimaryButton label={qi === 1 ? 'See my taste' : 'Continue'}
            style={{ opacity: ans[qi] != null ? 1 : 0.45, marginBottom: 28 }}
            onPress={() => ans[qi] != null && setStep(step + 1)} />
        </View>
      </SafeAreaView>
    );
  }

  // result
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={s.resTop}>
        <Text style={{ fontSize: 80, marginBottom: 16 }}>🌟</Text>
        <Text style={s.resTag}>Nice to meet you, {name.split(' ')[0]}</Text>
        <Text style={s.resType}>{taste}</Text>
      </View>
      <View style={s.resBottom}>
        <Text style={s.resDesc}>
          We'll curate your lists around this. You can always retune it later in your profile.
        </Text>
        <PrimaryButton label="Enter Munch Munch"
          onPress={() => dispatch({ type: 'SIGN_UP', name: name.trim(), username: username.trim(), taste })} />
      </View>
    </SafeAreaView>
  );
}

function Field(props) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLbl}>{props.label}</Text>
      <TextInput {...props} style={s.input} placeholderTextColor={C.sub} />
    </View>
  );
}

const s = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#fff' },
  vTitle: { fontSize: 28, fontWeight: '800', color: C.ink, textAlign: 'center', lineHeight: 34 },
  vSub: { fontSize: 15, color: C.sub, textAlign: 'center', lineHeight: 23, paddingHorizontal: 36 },
  vNav: { height: 88, backgroundColor: C.brand, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32 },
  vSkip: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  vNext: { color: '#fff', fontSize: 16, fontWeight: '600' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotOn: { width: 20, backgroundColor: '#fff' },
  formWrap: { padding: 28, paddingTop: 70 },
  logo: { fontSize: 30, fontWeight: '800', color: C.brand, textAlign: 'center', marginBottom: 28 },
  h1: { fontSize: 24, fontWeight: '700', color: C.ink },
  sub: { fontSize: 14, color: C.sub, marginTop: 4, marginBottom: 20 },
  field: { marginBottom: 14 },
  fieldLbl: { fontSize: 13, fontWeight: '600', color: C.body, marginBottom: 6 },
  input: { backgroundColor: '#EEEEF4', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 15, fontSize: 15, color: C.body },
  qWrap: { flex: 1, paddingHorizontal: 24, paddingBottom: 12 },
  progBar: { height: 5, backgroundColor: C.border, borderRadius: 4, overflow: 'hidden', marginBottom: 22 },
  progFill: { height: 5, backgroundColor: C.brand, borderRadius: 4 },
  qKicker: { fontSize: 12, fontWeight: '700', color: C.brand, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  qTitle: { fontSize: 24, fontWeight: '800', color: C.ink, lineHeight: 31 },
  qOpt: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.border, borderRadius: 16, padding: 18 },
  qOptOn: { backgroundColor: C.brand, borderColor: C.brand },
  qOptTxt: { fontSize: 15, fontWeight: '600', color: C.body },
  resTop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  resTag: { fontSize: 15, color: C.sub, marginBottom: 8 },
  resType: { fontSize: 32, fontWeight: '800', color: C.ink, textAlign: 'center' },
  resBottom: { backgroundColor: C.brand, padding: 32, paddingBottom: 44 },
  resDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 24, marginBottom: 24 },
});
