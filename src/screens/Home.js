import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';

export default function Home() {
  const { state } = useStore();
  const { navigate, switchTab } = useNav();
  const first = state.user?.name?.split(' ')[0] || 'there';
  const friend = [...state.friends].sort((a, b) => a.birthdayInDays - b.birthdayInDays)[0];
  const friendRest = friend && state.restaurants.find((r) => friend.wishlist.includes(r.id));
  const longSaved = state.restaurants.find((r) => !r.visited && r.savedAgo.includes('days'));
  const curated = state.restaurants.find((r) => r.cuisine === 'Italian');

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <LinearGradient colors={[C.brand, '#0c4aa0']} style={s.header}>
        <View style={{ height: 28 }} />
        <Text style={s.greet}>Good evening,{'\n'}{first}</Text>
        <TouchableOpacity style={s.search} onPress={() => switchTab('explore')} activeOpacity={0.85}>
          <Text style={s.searchTxt}>🔍  What are you in the mood for?</Text>
          <Text style={s.searchAi}>AI</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {['Near me', 'Date night', 'Late night', 'Brunch'].map((c) => (
            <TouchableOpacity key={c} style={s.chip} onPress={() => switchTab('explore')}>
              <Text style={s.chipTxt}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={s.remind}>
          <Text style={{ fontSize: 30 }}>🥐</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.remindTitle}>Your curated list is ready</Text>
            <Text style={s.remindSub}>{state.restaurants.length} places matched to {state.user?.taste || 'your taste'}</Text>
          </View>
        </View>

        {friend && (
          <TouchableOpacity style={s.friendCard} activeOpacity={0.9} onPress={() => navigate('plan', { friendId: friend.id })}>
            <View style={s.friendTop}>
              <View style={s.friendAv}><Text style={{ fontSize: 18 }}>{friend.avatar}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.friendName}>{friend.name}'s birthday</Text>
                <Text style={s.friendSub}>likes {friend.likes.join(' · ')}</Text>
              </View>
              <Text style={s.friendDays}>{friend.birthdayInDays} days</Text>
            </View>
            {friendRest && (
              <View style={s.friendRest}>
                <Image source={{ uri: friendRest.image }} style={s.friendThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={s.friendRestName}>{friendRest.name}</Text>
                  <Text style={s.friendRestMeta}>{friendRest.area} · you both saved this</Text>
                </View>
              </View>
            )}
            <View style={s.planBtn}><Text style={s.planBtnTxt}>Plan something →</Text></View>
          </TouchableOpacity>
        )}

        {curated && (
          <View style={{ paddingHorizontal: 14, marginTop: 14 }}>
            <Text style={s.sectionLbl}>BECAUSE YOU LIKE {curated.cuisine.toUpperCase()}</Text>
            <TouchableOpacity style={s.banner} activeOpacity={0.9} onPress={() => navigate('detail', { id: curated.id })}>
              <Image source={{ uri: curated.image }} style={StyleSheet.absoluteFill} />
              <LinearGradient colors={['rgba(8,58,130,0.78)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              <Text style={s.bannerTxt}>{curated.name}</Text>
            </TouchableOpacity>
          </View>
        )}

        {longSaved && (
          <TouchableOpacity style={s.nudge} activeOpacity={0.85} onPress={() => navigate('detail', { id: longSaved.id })}>
            <View style={s.nudgeDot} />
            <Text style={s.nudgeTxt}>You saved <Text style={{ fontWeight: '700' }}>{longSaved.name}</Text> {longSaved.savedAgo} — still want to go?</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingBottom: 18 },
  greet: { fontSize: 28, fontWeight: '800', color: '#fff', lineHeight: 33, marginBottom: 14 },
  search: { backgroundColor: '#fff', borderRadius: 50, flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 12 },
  searchTxt: { flex: 1, fontSize: 14, color: C.sub },
  searchAi: { fontSize: 11, fontWeight: '800', color: C.brand },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  chipTxt: { fontSize: 12, fontWeight: '600', color: '#fff' },
  remind: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 16, marginTop: 1 },
  remindTitle: { fontSize: 14, fontWeight: '700', color: C.ink },
  remindSub: { fontSize: 12, color: C.sub, marginTop: 2 },
  friendCard: { margin: 14, backgroundColor: C.brand, borderRadius: 18, borderWidth: 1.8, borderColor: C.amber, overflow: 'hidden' },
  friendTop: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 15 },
  friendAv: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
  friendName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  friendSub: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 1 },
  friendDays: { fontSize: 12, fontWeight: '700', color: C.amber },
  friendRest: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, paddingBottom: 12, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.12)', paddingTop: 12 },
  friendThumb: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#1a3a6b' },
  friendRestName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  friendRestMeta: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  planBtn: { backgroundColor: C.brandSoft, padding: 13, alignItems: 'center' },
  planBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  sectionLbl: { fontSize: 11, fontWeight: '700', color: C.brand, letterSpacing: 0.5, marginBottom: 9 },
  banner: { borderRadius: 14, overflow: 'hidden', height: 140, justifyContent: 'flex-end', padding: 14 },
  bannerTxt: { fontSize: 18, fontWeight: '800', color: '#fff' },
  nudge: { marginHorizontal: 14, marginTop: 14, backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 8 },
  nudgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.brand },
  nudgeTxt: { flex: 1, fontSize: 13, color: C.body },
});
