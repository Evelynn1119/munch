import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { C, CUISINE_TOTAL } from '../../theme';
import { useStore, cuisinesExplored, visitedCount } from '../store';
import { useNav } from '../nav';

export default function Profile() {
  const { state, dispatch } = useStore();
  const { reset } = useNav();
  const explored = cuisinesExplored(state);
  const visits = visitedCount(state);
  const pct = Math.round((explored.length / CUISINE_TOTAL) * 100);

  const signOut = () => {
    const go = () => { dispatch({ type: 'SIGN_OUT' }); reset('home'); };
    if (Platform.OS === 'web') go();
    else Alert.alert('Sign out?', 'This clears local data and restarts onboarding.',
      [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign out', style: 'destructive', onPress: go }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 28, backgroundColor: C.brand }} />
      <View style={s.head}>
        <View style={s.avatar}><Text style={{ fontSize: 30 }}>👤</Text></View>
        <Text style={s.name}>{state.user?.name}</Text>
        <Text style={s.handle}>@{state.user?.username}</Text>
        <View style={s.tasteChip}><Text style={s.tasteTxt}>{state.user?.taste}</Text></View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={s.statsRow}>
          <Stat n={visits} l="Visited" />
          <Stat n={`${explored.length}/${CUISINE_TOTAL}`} l="Cuisines" />
          <Stat n={state.restaurants.filter((r) => !r.visited).length} l="To try" />
        </View>

        <Text style={s.sec}>CUISINE STAMPS</Text>
        <View style={s.stampWrap}>
          <View style={s.barTrack}><View style={[s.barFill, { width: `${pct}%` }]} /></View>
          <Text style={s.barLabel}>{explored.length} of {CUISINE_TOTAL} explored</Text>
          <View style={s.stampGrid}>
            {explored.length === 0
              ? <Text style={s.noStamps}>Mark a place visited and rate it to earn your first stamp.</Text>
              : explored.map((c) => (
                <View key={c} style={s.stamp}><Text style={s.stampTxt}>{c}</Text></View>
              ))}
          </View>
        </View>

        <TouchableOpacity style={s.signOut} onPress={signOut}>
          <Text style={s.signOutTxt}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Stat({ n, l }) {
  return (
    <View style={s.stat}>
      <Text style={s.statN}>{n}</Text>
      <Text style={s.statL}>{l}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  head: { backgroundColor: C.brand, alignItems: 'center', paddingBottom: 24, paddingTop: 8 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '800', color: '#fff' },
  handle: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  tasteChip: { marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 30, paddingHorizontal: 18, paddingVertical: 7 },
  tasteTxt: { fontSize: 13, color: '#fff', fontWeight: '600' },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: C.border },
  stat: { flex: 1, alignItems: 'center' },
  statN: { fontSize: 22, fontWeight: '800', color: C.brand },
  statL: { fontSize: 12, color: C.sub, marginTop: 3 },
  sec: { fontSize: 11, fontWeight: '700', color: C.sub, letterSpacing: 0.5, marginTop: 22, marginBottom: 8 },
  stampWrap: { backgroundColor: '#fff', borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: C.border },
  barTrack: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: C.brand, borderRadius: 3 },
  barLabel: { fontSize: 12, color: C.sub, marginTop: 8 },
  stampGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  stamp: { backgroundColor: '#EEF2FF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  stampTxt: { fontSize: 13, fontWeight: '700', color: C.brand },
  noStamps: { fontSize: 13, color: C.sub, lineHeight: 20 },
  signOut: { marginTop: 24, padding: 15, alignItems: 'center' },
  signOutTxt: { fontSize: 14, color: '#DC2626', fontWeight: '600' },
});
