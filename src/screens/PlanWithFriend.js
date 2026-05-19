// Scripted assistant (no API). Pulls the friend + a matching saved place
// from the store so it reflects real data, not hardcoded names.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';

export default function PlanWithFriend({ friendId }) {
  const { state } = useStore();
  const { goBack } = useNav();
  const friend = state.friends.find((f) => f.id === friendId) || state.friends[0];
  const rest = state.restaurants.find((r) => friend?.wishlist.includes(r.id))
    || state.restaurants.find((r) => friend?.likes.some((l) => r.cuisine.toLowerCase().includes(l.toLowerCase())))
    || state.restaurants[0];

  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [sent, setSent] = useState(false);
  const scroller = useRef(null);
  const push = (m) => setMsgs((p) => [...p, m]);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    let alive = true;
    (async () => {
      await wait(350); if (!alive) return;
      push({ t: 'user', x: `Find something for ${friend.name}'s birthday` });
      setTyping(true); await wait(1300); if (!alive) return; setTyping(false);
      push({ t: 'ai', x: `She's into ${friend.likes.join(' & ')}. Want me to pull from places you've both got saved?` });
      setTyping(true); await wait(1500); if (!alive) return; setTyping(false);
      push({ t: 'card' });
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => { setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 60); }, [msgs, typing]);

  const invite = async () => {
    push({ t: 'user', x: `Invite ${friend.name} to ${rest.name}` });
    setTyping(true); await wait(1100); setTyping(false);
    push({ t: 'ai', italic: true, x: `"hey ${friend.name} 🎂 found somewhere I think you'd love for your birthday — ${rest.cuisine.toLowerCase()}, ${rest.area}. you in?"` });
    push({ t: 'send' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: 28, backgroundColor: C.brand }} />
      <View style={s.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}><Text style={s.back}>‹</Text></TouchableOpacity>
        <Text style={s.title}>{friend.name}'s birthday · {friend.birthdayInDays} days</Text>
      </View>
      <ScrollView ref={scroller} style={{ flex: 1 }} contentContainerStyle={{ padding: 14, gap: 12 }}>
        {msgs.map((m, i) => {
          if (m.t === 'user') return <View key={i} style={s.user}><Text style={s.userTxt}>{m.x}</Text></View>;
          if (m.t === 'ai') return <View key={i} style={s.ai}><Text style={[s.aiTxt, m.italic && { fontStyle: 'italic' }]}>{m.x}</Text></View>;
          if (m.t === 'card') return (
            <View key={i} style={s.card}>
              <Image source={{ uri: rest.image }} style={s.cardImg} />
              <View style={s.cardBody}>
                <Text style={s.cardName}>{rest.name}</Text>
                <Text style={s.cardMeta}>{rest.cuisine} · {rest.area} · {rest.price}</Text>
                <View style={s.cardWhy}><Text style={s.cardWhyTxt}>
                  {rest.name} matches {friend.name}'s taste, and it's on your shared saves — basically a sign.
                </Text></View>
                <TouchableOpacity style={s.inviteBtn} onPress={invite}>
                  <Text style={s.inviteTxt}>Draft an invite</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
          if (m.t === 'send') return (
            <View key={i} style={{ gap: 8 }}>
              {['Line', 'Instagram', 'iMessage'].map((p) => (
                <TouchableOpacity key={p} style={s.platBtn} onPress={() => setSent(true)}>
                  <Text style={s.platTxt}>Send with {p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
          return null;
        })}
        {typing && <View style={s.typing}><Text style={{ color: '#B0C1D9' }}>● ● ●</Text></View>}
      </ScrollView>
      <View style={s.inputBar}>
        <View style={s.input}><Text style={{ color: C.sub }}>Ask anything…</Text></View>
        <View style={s.send}><Text style={{ color: '#fff' }}>→</Text></View>
      </View>
      {sent && (
        <View style={s.overlay}>
          <View style={s.check}><Text style={{ fontSize: 34, color: '#fff' }}>✓</Text></View>
          <Text style={s.sentTitle}>Invite sent!</Text>
          <Text style={s.sentSub}>{friend.name}'s going to love this. Fingers crossed 🤞</Text>
          <TouchableOpacity style={s.sentHome} onPress={goBack}>
            <Text style={s.sentHomeTxt}>Back to home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: C.brand, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 14 },
  back: { color: '#fff', fontSize: 26 },
  title: { color: '#fff', fontSize: 15, fontWeight: '700' },
  user: { alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: C.brand, borderRadius: 18, borderBottomRightRadius: 4, padding: 12 },
  userTxt: { color: '#fff', fontSize: 14, lineHeight: 20 },
  ai: { alignSelf: 'flex-start', maxWidth: '88%', backgroundColor: C.bg, borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, borderWidth: 0.5, borderColor: C.border },
  aiTxt: { color: '#1a1a2a', fontSize: 14, lineHeight: 20 },
  typing: { alignSelf: 'flex-start', backgroundColor: C.bg, borderWidth: 0.5, borderColor: C.border, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12 },
  card: { alignSelf: 'flex-start', width: 270, backgroundColor: '#fff', borderWidth: 0.5, borderColor: C.border, borderRadius: 14, overflow: 'hidden' },
  cardImg: { height: 115, width: '100%', backgroundColor: '#1a3a6b' },
  cardBody: { backgroundColor: C.brand, padding: 12 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  cardMeta: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  cardWhy: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10 },
  cardWhyTxt: { fontSize: 12, color: C.body, lineHeight: 18 },
  inviteBtn: { padding: 11, backgroundColor: C.brandSoft, borderRadius: 25, alignItems: 'center' },
  inviteTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  platBtn: { alignSelf: 'flex-start', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 25, backgroundColor: C.brandSoft },
  platTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, paddingBottom: 26, borderTopWidth: 0.5, borderTopColor: C.border },
  input: { flex: 1, backgroundColor: C.bg, borderWidth: 0.5, borderColor: C.border, borderRadius: 25, paddingHorizontal: 16, paddingVertical: 11 },
  send: { width: 38, height: 38, backgroundColor: C.brand, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', padding: 32 },
  check: { width: 70, height: 70, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  sentTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 },
  sentSub: { fontSize: 14, color: 'rgba(255,255,255,0.62)', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  sentHome: { paddingHorizontal: 36, paddingVertical: 14, backgroundColor: '#fff', borderRadius: 50 },
  sentHomeTxt: { color: C.brand, fontSize: 15, fontWeight: '700' },
});
