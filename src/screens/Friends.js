import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';

function FriendSection({ friend, state, navigate }) {
  const theirSaves = state.restaurants.filter((r) => friend.wishlist.includes(r.id));
  const mySaved    = new Set(state.restaurants.map((r) => r.id));

  return (
    <View style={s.section}>
      {/* Friend header */}
      <View style={s.friendRow}>
        <View style={s.avatar}>
          <Text style={{ fontSize: 22 }}>{friend.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.friendName}>{friend.name}</Text>
          <Text style={s.friendMeta}>
            likes {friend.likes.join(' · ')}  ·  🎂 {friend.birthdayInDays}d
          </Text>
        </View>
        <TouchableOpacity style={s.planBadge}
          onPress={() => navigate('plan', { friendId: friend.id })} activeOpacity={0.85}>
          <Text style={s.planBadgeTxt}>Plan →</Text>
        </TouchableOpacity>
      </View>

      {/* Their saves */}
      {theirSaves.length > 0 ? (
        <>
          <Text style={s.savesLbl}>
            {friend.name.split(' ')[0]}'s wishlist · {theirSaves.length} place{theirSaves.length !== 1 ? 's' : ''}
          </Text>
          {theirSaves.map((r) => {
            const mutual = mySaved.has(r.id);
            return (
              <TouchableOpacity key={r.id} style={s.restCard}
                onPress={() => navigate('detail', { id: r.id })} activeOpacity={0.85}>
                <Image source={{ uri: r.image }} style={s.thumb} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={s.restName}>{r.name}</Text>
                  <Text style={s.restMeta}>{r.cuisine} · {r.area} · {r.price}</Text>
                  {mutual && (
                    <View style={s.mutualBadge}>
                      <Text style={s.mutualTxt}>✓ You both saved this</Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: C.sub, fontSize: 16 }}>›</Text>
              </TouchableOpacity>
            );
          })}
        </>
      ) : (
        <Text style={s.empty}>Nothing saved yet — maybe suggest something?</Text>
      )}

      {/* Plan CTA */}
      <TouchableOpacity style={s.planCta}
        onPress={() => navigate('plan', { friendId: friend.id })} activeOpacity={0.85}>
        <Text style={s.planCtaTxt}>Plan a night out with {friend.name.split(' ')[0]} →</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Friends() {
  const { state } = useStore();
  const { navigate } = useNav();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <LinearGradient colors={[C.brand, '#0c4aa0']} style={s.header}>
        <View style={{ height: 52 }} />
        <Text style={s.title}>Friends</Text>
        <Text style={s.subtitle}>See what your people are craving</Text>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>

        {state.friends.length > 0 ? (
          state.friends.map((f) => (
            <FriendSection key={f.id} friend={f} state={state} navigate={navigate} />
          ))
        ) : (
          <View style={s.emptyState}>
            <Text style={{ fontSize: 40, marginBottom: 14 }}>👥</Text>
            <Text style={s.emptyTitle}>No friends yet</Text>
            <Text style={s.emptySub}>Add friends to see what they're saving and plan nights out together.</Text>
          </View>
        )}

        {/* Add friend */}
        <TouchableOpacity style={s.addFriend} activeOpacity={0.85}>
          <View style={s.addIcon}><Text style={{ fontSize: 18 }}>+</Text></View>
          <View>
            <Text style={s.addTxt}>Add a friend</Text>
            <Text style={s.addSub}>Invite by username or phone</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  // Header
  header:       { paddingHorizontal: 18, paddingBottom: 20 },
  title:        { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle:     { fontSize: 14, color: 'rgba(255,255,255,0.65)' },

  // Friend section
  section:      { backgroundColor: '#fff', marginTop: 12, paddingVertical: 16, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: C.border },
  friendRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, marginBottom: 14 },
  avatar:       { width: 46, height: 46, borderRadius: 23, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
  friendName:   { fontSize: 16, fontWeight: '700', color: C.ink },
  friendMeta:   { fontSize: 12, color: C.sub, marginTop: 2 },
  planBadge:    { backgroundColor: C.brand, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  planBadgeTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Saves list
  savesLbl:     { fontSize: 11, fontWeight: '700', color: C.sub, letterSpacing: 0.5, paddingHorizontal: 16, marginBottom: 8 },
  restCard:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 0.5, borderColor: C.border },
  thumb:        { width: 52, height: 52, borderRadius: 12, backgroundColor: '#dde6f5' },
  restName:     { fontSize: 14, fontWeight: '700', color: C.ink },
  restMeta:     { fontSize: 12, color: C.sub },
  mutualBadge:  { alignSelf: 'flex-start', backgroundColor: C.greenBg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginTop: 3 },
  mutualTxt:    { fontSize: 10, fontWeight: '700', color: C.green },

  // Plan CTA
  planCta:      { marginHorizontal: 16, marginTop: 14, backgroundColor: '#EEF2FF', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D9E5FF' },
  planCtaTxt:   { fontSize: 13, fontWeight: '700', color: C.brand },

  empty:        { fontSize: 13, color: C.sub, paddingHorizontal: 16, fontStyle: 'italic' },

  // Empty state
  emptyState:   { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle:   { fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 8 },
  emptySub:     { fontSize: 14, color: C.sub, textAlign: 'center', lineHeight: 20 },

  // Add friend
  addFriend:    { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginTop: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, borderStyle: 'dashed' },
  addIcon:      { width: 44, height: 44, borderRadius: 22, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.border },
  addTxt:       { fontSize: 14, fontWeight: '700', color: C.ink },
  addSub:       { fontSize: 12, color: C.sub, marginTop: 1 },
});
