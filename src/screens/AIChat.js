import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../../theme';
import { useStore } from '../store';
import { useNav } from '../nav';

// ─── Intent detection ─────────────────────────────────────────────────────────
function detectIntent(q) {
  const t = q.toLowerCase();
  if (/date|romantic|couple|boyfriend|girlfriend|anniversary/i.test(t)) return 'date';
  if (/birthday|celebrate|special|occasion/i.test(t))                   return 'special';
  if (/mia|friend|together|with.*friend/i.test(t))                      return 'friend';
  if (/tonight|dinner|lunch|eat|hungry|craving|mood/i.test(t))          return 'tonight';
  if (/cheap|budget|affordable|\$/i.test(t))                            return 'budget';
  if (/expensive|splurge|fancy|treat/i.test(t))                         return 'fancy';
  if (/nearby|near me|close|walking/i.test(t))                          return 'nearby';
  if (/italian|japanese|ramen|sushi|thai|vegan|fusion|cocktail/i.test(t)) return 'cuisine';
  return 'general';
}

function aiResponse(query, state) {
  const intent   = detectIntent(query);
  const unvisited = state.restaurants.filter((r) => !r.visited);
  const friend    = state.friends[0];
  const sorted    = [...unvisited].sort((a, b) => (parseInt(b.savedAgo) || 0) - (parseInt(a.savedAgo) || 0));

  switch (intent) {
    case 'date': {
      const spots = unvisited.filter((r) => r.tags.some((t) => /date/i.test(t)));
      return {
        text: `For a date night? Honestly, ${spots[0]?.name || 'The Bookstore Bar'} is the one — dimly lit, great cocktails, and you've been putting it off for weeks. Stop overthinking and just book it 😄`,
        cards: spots.length ? spots.slice(0, 3) : unvisited.slice(0, 3),
      };
    }
    case 'special': {
      const spots = unvisited.filter((r) => r.tags.some((t) => /special|omakase/i.test(t)));
      return {
        text: `Special occasion? Pull out all the stops. ${spots[0]?.name || 'Sushi Tyu'} is the kind of place that makes people feel seen. It's saved for a reason ✨`,
        cards: spots.length ? spots.slice(0, 3) : unvisited.slice(0, 3),
      };
    }
    case 'friend': {
      const rest = friend && state.restaurants.find((r) => friend.wishlist.includes(r.id));
      return {
        text: `${friend?.name}'s birthday is in ${friend?.birthdayInDays} days! She loves ${friend?.likes.join(' & ')}, so ${rest?.name || 'Sushi Tyu'} is the move. You both saved it — she'll love that you remembered 💛`,
        cards: rest ? [rest, ...unvisited.slice(0, 2)] : unvisited.slice(0, 3),
      };
    }
    case 'tonight': {
      return {
        text: `You've got ${unvisited.length} places in your saves just collecting dust 😅 My honest pick for tonight? ${sorted[0]?.name} — saved ${sorted[0]?.savedAgo} and you still haven't gone. That's criminal.`,
        cards: sorted.slice(0, 3),
      };
    }
    case 'budget': {
      const cheap = unvisited.filter((r) => r.price === '$' || r.price === '$$');
      return {
        text: `Budget-friendly but still good? You've saved a few gems. ${cheap[0]?.name} gives you a lot for the price — ${cheap[0]?.cuisine} in ${cheap[0]?.area}, no regrets.`,
        cards: cheap.length ? cheap.slice(0, 3) : unvisited.slice(0, 3),
      };
    }
    case 'fancy': {
      const fancy = unvisited.filter((r) => r.price === '$$$');
      return {
        text: `Time to splurge? ${fancy[0]?.name} is in your saves for a reason. ${fancy[0]?.why} Treat yourself — you've earned it.`,
        cards: fancy.length ? fancy.slice(0, 3) : unvisited.slice(0, 3),
      };
    }
    case 'nearby': {
      const near = [...unvisited].sort((a, b) => a.km - b.km);
      return {
        text: `Closest to you right now? ${near[0]?.name} is only ${near[0]?.km}km away in ${near[0]?.area}. You could walk there. Literally no excuse 🚶`,
        cards: near.slice(0, 3),
      };
    }
    case 'cuisine': {
      const match = unvisited.filter((r) =>
        r.cuisine.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some((t) => query.toLowerCase().includes(t.toLowerCase()))
      );
      return {
        text: match.length
          ? `You've actually saved something that matches. ${match[0]?.name} is top of my list for that — ${match[0]?.why}`
          : `Nothing in that exact category in your saves yet, but these are the closest vibes:`,
        cards: match.length ? match.slice(0, 3) : unvisited.slice(0, 3),
      };
    }
    default:
      return {
        text: `Let me dig through your ${state.restaurants.length} saves… Here's what stands out right now based on your taste:`,
        cards: sorted.slice(0, 3),
      };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TypingBubble() {
  return (
    <View style={m.aiBubble}>
      <ActivityIndicator size="small" color={C.sub} />
    </View>
  );
}

function RestCard({ r, onPress }) {
  return (
    <TouchableOpacity style={m.card} onPress={onPress} activeOpacity={0.88}>
      <Image source={{ uri: r.image }} style={m.cardImg} />
      <View style={m.cardBody}>
        <Text style={m.cardName} numberOfLines={1}>{r.name}</Text>
        <Text style={m.cardMeta}>{r.cuisine} · {r.area} · {r.price}</Text>
        <Text style={m.cardWhy} numberOfLines={2}>{r.why}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Message({ msg, onRestTap }) {
  if (msg.role === 'user') {
    return <View style={m.userRow}><View style={m.userBubble}><Text style={m.userTxt}>{msg.text}</Text></View></View>;
  }
  return (
    <View style={{ gap: 10 }}>
      <View style={m.aiRow}>
        <View style={m.aiAvatar}><Text style={{ fontSize: 14 }}>✨</Text></View>
        <View style={m.aiBubble}><Text style={m.aiTxt}>{msg.text}</Text></View>
      </View>
      {msg.cards?.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 44, gap: 10, paddingRight: 16 }}>
          {msg.cards.map((r) => (
            <RestCard key={r.id} r={r} onPress={() => onRestTap(r.id)} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function AIChat({ query: initialQuery }) {
  const { state } = useStore();
  const { goBack, navigate } = useNav();
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const scrollRef               = useRef(null);

  const push = (msg) => setMessages((prev) => [...prev, msg]);

  const reply = (query) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const { text, cards } = aiResponse(query, state);
      push({ role: 'ai', text, cards });
    }, 1300);
  };

  useEffect(() => {
    if (!initialQuery) return;
    push({ role: 'user', text: initialQuery });
    reply(initialQuery);
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  }, [messages, typing]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setInput('');
    push({ role: 'user', text: q });
    reply(q);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <LinearGradient colors={[C.brand, '#0c4aa0']} style={s.header}>
        <View style={{ height: 52 }} />
        <View style={s.headerRow}>
          <TouchableOpacity onPress={goBack} style={s.backBtn}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}>
            <Text style={s.backTxt}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>✨ Munch AI</Text>
            <Text style={s.headerSub}>Your personal dining assistant</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Intro if no messages yet */}
        {messages.length === 0 && !typing && (
          <View style={s.intro}>
            <Text style={s.introEmoji}>✨</Text>
            <Text style={s.introTitle}>Hey, I know your saves</Text>
            <Text style={s.introSub}>Ask me anything — "what should I eat tonight?", "plan a date night", "what does Mia like?"</Text>
            <View style={s.suggestions}>
              {['What should I eat tonight?', 'Find me a date night spot', "Plan something for Mia's birthday"].map((sug) => (
                <TouchableOpacity key={sug} style={s.sugChip}
                  onPress={() => { push({ role: 'user', text: sug }); reply(sug); }}>
                  <Text style={s.sugTxt}>{sug}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((msg, i) => (
          <Message key={i} msg={msg} onRestTap={(id) => navigate('detail', { id })} />
        ))}
        {typing && (
          <View style={m.aiRow}>
            <View style={m.aiAvatar}><Text style={{ fontSize: 14 }}>✨</Text></View>
            <TypingBubble />
          </View>
        )}
      </ScrollView>

      {/* Input bar */}
      <View style={s.inputWrap}>
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything about food…"
          placeholderTextColor={C.sub}
          returnKeyType="send"
          onSubmitEditing={send}
          multiline={false}
        />
        <TouchableOpacity
          style={[s.sendBtn, !input.trim() && { opacity: 0.35 }]}
          onPress={send} activeOpacity={0.8}>
          <Text style={s.sendTxt}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  header:      { paddingHorizontal: 18, paddingBottom: 16 },
  headerRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:     { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backTxt:     { color: '#fff', fontSize: 22, fontWeight: '600', lineHeight: 26 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  headerSub:   { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  intro:       { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 },
  introEmoji:  { fontSize: 40, marginBottom: 12 },
  introTitle:  { fontSize: 20, fontWeight: '800', color: C.ink, marginBottom: 6 },
  introSub:    { fontSize: 14, color: C.sub, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  suggestions: { gap: 8, width: '100%' },
  sugChip:     { backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 16, paddingVertical: 11, borderWidth: 1, borderColor: C.border },
  sugTxt:      { fontSize: 13, fontWeight: '600', color: C.brand, textAlign: 'center' },
  inputWrap:   { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, paddingBottom: 24, backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: C.border },
  input:       { flex: 1, backgroundColor: C.bg, borderRadius: 50, paddingHorizontal: 16, paddingVertical: 11, fontSize: 14, color: C.body },
  sendBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center' },
  sendTxt:     { color: '#fff', fontSize: 18, fontWeight: '700' },
});

const m = StyleSheet.create({
  userRow:    { flexDirection: 'row', justifyContent: 'flex-end' },
  userBubble: { backgroundColor: C.brand, borderRadius: 18, borderBottomRightRadius: 4, padding: 12, maxWidth: '80%' },
  userTxt:    { color: '#fff', fontSize: 14, lineHeight: 20 },
  aiRow:      { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  aiAvatar:   { width: 30, height: 30, borderRadius: 15, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D9E5FF' },
  aiBubble:   { backgroundColor: '#fff', borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, maxWidth: '80%', borderWidth: 0.5, borderColor: C.border },
  aiTxt:      { color: C.body, fontSize: 14, lineHeight: 21 },
  card:       { width: 180, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 0.5, borderColor: C.border },
  cardImg:    { width: '100%', height: 100, backgroundColor: '#dde6f5' },
  cardBody:   { padding: 10, gap: 2 },
  cardName:   { fontSize: 13, fontWeight: '700', color: C.ink },
  cardMeta:   { fontSize: 11, color: C.sub },
  cardWhy:    { fontSize: 11, color: C.body, marginTop: 4, lineHeight: 15, fontStyle: 'italic' },
});
