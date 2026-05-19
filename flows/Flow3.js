// Flow 3 — Notification → rate + plan Mia's birthday. Port of remixed-f7e2e492.html.
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  Animated, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, IMG } from '../theme';

const RATINGS = ['Bestie,\nthis is everything', 'lowkey\nobsessed', 'it was...\nfine', 'never again\nbestie'];
const SECTIONS = [
  ['Food', ["i'd eat the whole plate", 'order the pasta', 'skip the dessert', 'portion was tiny']],
  ['Vibe ✨', ['date night approved', 'too loud', 'bring your camera', 'great for groups']],
  ['Price 💸', ['worth every penny', 'affordable treat', 'a bit pricey']],
];

export default function Flow3({ onExit }) {
  const [s, setS] = useState(1);
  const [rating, setRating] = useState(null);
  const [chips, setChips] = useState({});
  const overlay = useRef(new Animated.Value(0)).current;
  const go = (n) => setS(n);

  const openApp = () => {
    overlay.setValue(0);
    Animated.timing(overlay, { toValue: 1, duration: 450, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(overlay, { toValue: 0, duration: 280, useNativeDriver: true }).start();
      go(2);
    }, 750);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: s === 1 ? '#2d1b4e' : C.brand }}>
      <ExitChip onExit={onExit} dark />

      {s === 1 && (
        <LinearGradient colors={['#2d1b4e', '#6b1f3a', '#c0392b', '#8e44ad', '#1a6eb5']} style={{ flex: 1 }}>
          <View style={lk.center}>
            <Text style={lk.date}>Sunday, March 10</Text>
            <Text style={lk.time}>1:47</Text>
          </View>
          <TouchableOpacity style={lk.notif} activeOpacity={0.9} onPress={openApp}>
            <View style={lk.notifRow}>
              <View style={lk.notifIcon}><Text style={lk.notifIconTxt}>M</Text></View>
              <Text style={lk.notifName}>Munch Munch</Text>
              <Text style={lk.notifAgo}>15m ago</Text>
            </View>
            <Text style={lk.notifTitle}>You actually went, didn't you ?</Text>
            <Text style={lk.notifBody}>Looks like you visited Trattoria di Primo. Honestly, spill the tea how was it ?</Text>
          </TouchableOpacity>
          <Text style={lk.hint}>tap notification to open</Text>
        </LinearGradient>
      )}

      {s === 2 && (
        <View style={{ flex: 1, backgroundColor: C.brand }}>
          <View style={rc.visitedBar}>
            <Text style={rc.visitedTxt}>📍 Looks like you just visited!</Text>
            <TouchableOpacity style={rc.visitedBtn} onPress={() => go(3)}><Text style={rc.visitedBtnTxt}>Rate it →</Text></TouchableOpacity>
          </View>
          <View style={rc.photo}>
            <Image source={{ uri: IMG.pasta }} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['transparent', 'rgba(8,58,130,0.85)']} style={StyleSheet.absoluteFill} />
            <View style={rc.photoInfo}>
              <Text style={rc.name}>Trattoria di Primo</Text>
              <Text style={rc.meta}>大安區 · 3.2KM · Opens Now   <Text style={rc.badge}> FROM IG </Text></Text>
            </View>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18 }}>
            <View style={rc.tags}>
              {['手工義大利麵', '約會適合', '道地料理'].map((t, i) => (
                <View key={i} style={rc.tag}><Text style={rc.tagTxt}>{t}</Text></View>
              ))}
            </View>
            <View style={rc.aiBox}>
              <Text style={rc.aiLabel}>WHY YOU SAVED THIS PLACE</Text>
              <Text style={rc.aiTxt}>Your Instagram Post you saved mentioned truffle pasta and wine — saved three weeks ago.</Text>
              <Text style={rc.aiSrc}>@pastaintaipei_eat</Text>
            </View>
          </ScrollView>
          <View style={rc.ctas}>
            <TouchableOpacity style={rc.cta1} onPress={() => go(3)}><Text style={rc.cta1Txt}>ADD TO THIS WEEK</Text></TouchableOpacity>
            <TouchableOpacity style={rc.cta2} onPress={() => go(3)}><Text style={rc.cta2Txt}>NAVIGATE NOW</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {s === 3 && (
        <View style={{ flex: 1, backgroundColor: C.brand }}>
          <Image source={{ uri: IMG.pasta }} style={{ height: 155 }} />
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 10 }}>
            <Text style={rt.rest}>Trattoria di Primo</Text>
            <Text style={rt.h1}>ok, so you actually went....</Text>
            <Text style={rt.sub}>no cap, actually how was it ?</Text>
            <View style={rt.grid}>
              {RATINGS.map((r, i) => (
                <TouchableOpacity key={i} style={[rt.opt, rating === i && rt.optSel]} onPress={() => setRating(i)}>
                  <Text style={[rt.optTxt, rating === i && { color: C.brand }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {SECTIONS.map(([label, items], si) => (
              <View key={si} style={rt.section}>
                <Text style={rt.sectionLbl}>{label}</Text>
                <View style={rt.chips}>
                  {items.map((c, ci) => {
                    const key = `${si}-${ci}`;
                    const on = chips[key];
                    return (
                      <TouchableOpacity key={ci} style={[rt.chip, on && rt.chipOn]} onPress={() => setChips({ ...chips, [key]: !on })}>
                        <Text style={[rt.chipTxt, on && { color: C.brand }]}>{c}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={rt.submit} onPress={() => go(4)}><Text style={rt.submitTxt}>Drop my rating →</Text></TouchableOpacity>
        </View>
      )}

      {s === 4 && (
        <View style={stp.wrap}>
          <Text style={stp.h1}>Stamp Collected!</Text>
          <Text style={stp.rest}>Trattoria di Primo</Text>
          <View style={stp.stamp}><Text style={{ fontSize: 90 }}>🍝</Text></View>
          <View style={stp.badge}><Text style={stp.badgeTxt}>Italian Cuisine</Text></View>
          <View style={stp.progRow}><Text style={stp.progL}>Cuisine Explored</Text><Text style={stp.progR}>2 of 12</Text></View>
          <View style={stp.bar}><View style={stp.fill} /></View>
          <Text style={stp.visits}>You've been to 8 restaurants so far.</Text>
          <View style={stp.btns}>
            <TouchableOpacity style={stp.done} onPress={() => go(5)}><Text style={stp.doneTxt}>DONE</Text></TouchableOpacity>
            <TouchableOpacity style={stp.explore}><Text style={stp.exploreTxt}>EXPLORE MORE ITALIAN</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {s === 5 && (
        <View style={{ flex: 1, backgroundColor: '#F0F4FA' }}>
          <View style={hm.header}>
            <Text style={hm.greet}>Good Morning{'\n'}Evelynn</Text>
            <TouchableOpacity style={hm.search} onPress={() => go(6)}>
              <Text style={hm.searchTxt}>🔍  What are you in the mood for ?</Text>
              <Text style={hm.searchAi}>AI</Text>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
              {['near me', 'date night', 'late night', 'breakfast'].map((c, i) => (
                <TouchableOpacity key={i} style={hm.chip} onPress={() => go(6)}><Text style={hm.chipTxt}>{c}</Text></TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 90 }}>
            <View style={hm.remind}>
              <Text style={{ fontSize: 34 }}>🥐</Text>
              <View>
                <Text style={hm.remindDate}>2026/3/15</Text>
                <Text style={hm.remindTitle}>Before noon...</Text>
                <Text style={hm.remindSub}>check out your curated list!</Text>
              </View>
            </View>
            <TouchableOpacity style={hm.miaCard} activeOpacity={0.9} onPress={() => go(7)}>
              <View style={hm.miaInner}>
                <View style={hm.miaTop}>
                  <View style={hm.miaAv}><Text style={{ fontSize: 19 }}>🎂</Text></View>
                  <View>
                    <Text style={hm.miaName}>Mia's Birthday in 14 Days</Text>
                    <Text style={hm.miaDate}>1997/5/6</Text>
                  </View>
                  <Text style={hm.mia14}>14 days</Text>
                </View>
                <Text style={hm.miaDesc}>She loves omakase, she have save these places for on her munch munch wishlist......</Text>
                <View style={hm.miaRestRow}>
                  <Image source={{ uri: IMG.sushi }} style={hm.miaThumb} />
                  <View>
                    <Text style={hm.miaRestName}>Sushi Tyu</Text>
                    <Text style={hm.miaRestLoc}>大安區</Text>
                    <Text style={hm.miaRestSaved}>You both saved this 2 weeks ago</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={hm.miaInvite} onPress={() => go(7)}><Text style={hm.miaInviteTxt}>INVITE MIA HERE</Text></TouchableOpacity>
              <TouchableOpacity style={hm.miaOther} onPress={() => go(7)}><Text style={hm.miaOtherTxt}>other options</Text></TouchableOpacity>
            </TouchableOpacity>
            <View style={hm.section}>
              <TouchableOpacity style={hm.banner} onPress={() => go(6)}>
                <Image source={{ uri: IMG.pasta }} style={StyleSheet.absoluteFill} />
                <LinearGradient colors={['rgba(8,58,130,0.72)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                <Text style={hm.bannerTxt}>We know you{'\n'}like Pasta</Text>
              </TouchableOpacity>
            </View>
            <View style={hm.savedPill}>
              <View style={hm.savedDot} />
              <Text style={hm.savedTxt}>You have saved <Text style={{ fontWeight: '700' }}>麵屋武藏</Text> for more than 66 days ...</Text>
            </View>
          </ScrollView>
          <View style={hm.nav}>
            <Text style={[hm.navIcon, hm.navOn]}>🏠</Text>
            <Text style={hm.navIcon}>📍</Text>
            <TouchableOpacity style={hm.navAdd} onPress={() => go(6)}><Text style={hm.navAddTxt}>+</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => go(7)}><Text style={hm.navIcon}>⭐</Text></TouchableOpacity>
            <Text style={hm.navIcon}>👤</Text>
          </View>
        </View>
      )}

      {s === 6 && (
        <View style={{ flex: 1, backgroundColor: C.brand }}>
          <View style={sr.top}>
            <TouchableOpacity onPress={() => go(5)}><Text style={sr.back}>‹</Text></TouchableOpacity>
            <View style={sr.bar}>
              <Text style={sr.barTxt}>🔍  near me</Text>
              <View style={sr.arrow}><Text style={{ color: '#fff' }}>→</Text></View>
            </View>
          </View>
          <Text style={sr.found}>Found 3 restaurants matching " near me " from your save</Text>
          <ScrollView style={{ flex: 1 }}>
            {[['Trattoria di Primo', 'From IG'], ['Italian Restaurant', 'From 小紅...'], ['Trattoria di Primo', 'From IG']].map(([n, src], i) => (
              <TouchableOpacity key={i} style={sr.item} onPress={() => go(2)}>
                <Image source={{ uri: IMG.pasta }} style={sr.thumb} />
                <View style={{ flex: 1 }}>
                  <Text style={sr.itemName}>{n}</Text>
                  <Text style={sr.itemMeta}>大安區 · saved 3 weeks ago</Text>
                </View>
                <View style={sr.src}><Text style={sr.srcTxt}>{src}</Text></View>
              </TouchableOpacity>
            ))}
            <View style={sr.searchAll}><Text style={{ color: '#fff' }}>🔍  Search All " near me "</Text></View>
            <View style={sr.trending}>
              <Text style={sr.trendTitle}>Trending in 大安</Text>
              <Text style={sr.trendSub}>What everyone is munching now</Text>
              <View style={sr.trendGrid}>
                {[['An\'s Kitchen', IMG.fusion, '#Fusion #Asia'], ['Ramen', IMG.ramen, '#Fusion #Asia']].map(([n, img, tags], i) => (
                  <View key={i} style={sr.trendCard}>
                    <Image source={{ uri: img }} style={sr.trendPhoto} />
                    <View style={sr.trendInfo}>
                      <Text style={sr.trendName}>{n}</Text>
                      <Text style={sr.trendRating}>4.7 ⭐</Text>
                      <Text style={sr.trendTags}>{tags}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {s === 7 && <MiaChat onHome={() => go(5)} />}

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, lk.appOverlay, { opacity: overlay }]}>
        <Text style={lk.appLogo}>Munch{'\n'}Munch</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

function MiaChat({ onHome }) {
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState('intro');
  const [sentShow, setSentShow] = useState(false);
  const scroller = useRef(null);
  const push = (m) => setMsgs((p) => [...p, m]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      await wait(400); if (!alive) return;
      push({ t: 'user', x: "Find something for Mia's Birthday" });
      setTyping(true); await wait(1500); if (!alive) return; setTyping(false);
      push({ t: 'ai', x: "I know she's into Japanese and omakase. want me to find somewhere she'd actually love?" });
      setTyping(true); await wait(1600); if (!alive) return; setTyping(false);
      push({ t: 'card' });
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => { setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 60); }, [msgs, typing]);

  const invite = async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    push({ t: 'user', x: 'Invite Mia to Sushi Tyu 大安' });
    setTyping(true); await wait(1200); setTyping(false);
    push({ t: 'ai', italic: true, x: '" hey Mia 🎂 found somewhere i think you\'d actually love for your birthday — it\'s omakase, no shellfish, and the plating is unreal. you in? "' });
    push({ t: 'send1' });
    setStage('send1');
  };
  const chooseSend = async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    push({ t: 'user', x: 'Send Mia the Invite' });
    setTyping(true); await wait(900); setTyping(false);
    push({ t: 'platforms' });
    setStage('platforms');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={mc.header}>
        <TouchableOpacity onPress={onHome}><Text style={mc.back}>‹</Text></TouchableOpacity>
        <Text style={mc.title}>Mia's Birthday is in 14 Days</Text>
      </View>
      <ScrollView ref={scroller} style={{ flex: 1 }} contentContainerStyle={mc.body}>
        {msgs.map((m, i) => {
          if (m.t === 'user') return <View key={i} style={mc.userBubble}><Text style={mc.userTxt}>{m.x}</Text></View>;
          if (m.t === 'ai') return <View key={i} style={mc.aiBubble}><Text style={[mc.aiTxt, m.italic && { fontStyle: 'italic' }]}>{m.x}</Text></View>;
          if (m.t === 'card') return (
            <View key={i} style={mc.restCard}>
              <Image source={{ uri: IMG.sushi }} style={mc.restPhoto} />
              <View style={mc.restBody}>
                <Text style={mc.restName}>Sushi Tyu 大安</Text>
                <Text style={mc.restMeta}>大安區 $$$ few spots left !!</Text>
                <View style={mc.restWhy}><Text style={mc.restWhyTxt}>Why this one? No shellfish in the standard course, Mia saved it herself last month, and you both bookmarked it — that's basically a sign!</Text></View>
                <TouchableOpacity style={mc.inviteBtn} onPress={invite}><Text style={mc.inviteBtnTxt}>INVITE MIA HERE</Text></TouchableOpacity>
              </View>
            </View>
          );
          if (m.t === 'send1') return <TouchableOpacity key={i} style={[mc.platBtn, mc.platLine]} onPress={chooseSend}><Text style={mc.platTxt}>Send Invite</Text></TouchableOpacity>;
          if (m.t === 'platforms') return (
            <View key={i} style={{ gap: 8 }}>
              <TouchableOpacity style={[mc.platBtn, mc.platLine]} onPress={() => setSentShow(true)}><Text style={mc.platTxt}>Send with Line</Text></TouchableOpacity>
              <TouchableOpacity style={[mc.platBtn, mc.platIg]} onPress={() => setSentShow(true)}><Text style={mc.platTxt}>Send with Instagram</Text></TouchableOpacity>
              <TouchableOpacity style={[mc.platBtn, mc.platImsg]} onPress={() => setSentShow(true)}><Text style={mc.platTxt}>Send with iMessage</Text></TouchableOpacity>
            </View>
          );
          return null;
        })}
        {typing && (
          <View style={mc.typing}><Text style={{ color: '#B0C1D9' }}>● ● ●</Text></View>
        )}
      </ScrollView>
      <View style={mc.inputBar}>
        <View style={mc.input}><Text style={{ color: '#9CA3AF' }}>Ask Anything ....</Text></View>
        <View style={mc.send}><Text style={{ color: '#fff' }}>→</Text></View>
      </View>
      {sentShow && (
        <View style={mc.sentOverlay}>
          <View style={mc.sentCheck}><Text style={{ fontSize: 34, color: '#fff' }}>✓</Text></View>
          <Text style={mc.sentTitle}>Invite Sent!</Text>
          <Text style={mc.sentSub}>Mia's going to love this. fingers crossed she says yes 🤞</Text>
          <TouchableOpacity style={mc.sentHome} onPress={onHome}><Text style={mc.sentHomeTxt}>Back to home</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function ExitChip({ onExit, dark }) {
  return (
    <TouchableOpacity style={[gx.exitChip, dark && { backgroundColor: 'rgba(255,255,255,0.18)' }]} onPress={onExit}>
      <Text style={[gx.exitChipTxt, dark && { color: 'rgba(255,255,255,0.85)' }]}>✕ flows</Text>
    </TouchableOpacity>
  );
}

const gx = StyleSheet.create({
  exitChip: { position: 'absolute', top: 6, right: 12, zIndex: 99, backgroundColor: 'rgba(0,0,0,0.18)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  exitChipTxt: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
});

const lk = StyleSheet.create({
  center: { position: 'absolute', top: 70, left: 0, right: 0, alignItems: 'center' },
  date: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  time: { fontSize: 88, fontWeight: '200', color: '#fff' },
  notif: { position: 'absolute', bottom: 170, left: 16, right: 16, backgroundColor: 'rgba(240,240,250,0.9)', borderRadius: 18, padding: 14 },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  notifIcon: { width: 22, height: 22, backgroundColor: C.brand, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  notifIconTxt: { fontSize: 10, fontWeight: '900', color: '#fff' },
  notifName: { fontSize: 13, fontWeight: '600', color: '#1a1a2a' },
  notifAgo: { fontSize: 12, color: '#888', marginLeft: 'auto' },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a2a', marginBottom: 3 },
  notifBody: { fontSize: 13, color: '#555', lineHeight: 19 },
  hint: { position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  appOverlay: { backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  appLogo: { fontSize: 44, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 48 },
});

const rc = StyleSheet.create({
  visitedBar: { backgroundColor: C.amber, paddingVertical: 9, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  visitedTxt: { fontSize: 13, fontWeight: '600', color: '#412402', flex: 1 },
  visitedBtn: { backgroundColor: '#412402', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  visitedBtnTxt: { color: '#FAEEDA', fontSize: 12, fontWeight: '600' },
  photo: { height: 220 },
  photoInfo: { position: 'absolute', bottom: 14, left: 16, right: 16 },
  name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 3 },
  meta: { fontSize: 12, color: 'rgba(255,255,255,0.78)' },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 10, color: '#fff', fontWeight: '600' },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  tag: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  tagTxt: { color: '#fff', fontSize: 12, fontWeight: '500' },
  aiBox: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 15 },
  aiLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 1, marginBottom: 5 },
  aiTxt: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 21 },
  aiSrc: { fontSize: 12, color: '#B0C1D9', marginTop: 4 },
  ctas: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 30 },
  cta1: { flex: 1, padding: 15, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 50, alignItems: 'center' },
  cta1Txt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  cta2: { flex: 1, padding: 15, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 50, alignItems: 'center' },
  cta2Txt: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

const rt = StyleSheet.create({
  rest: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  h1: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18, gap: 9 },
  opt: { width: '47%', backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 15, paddingVertical: 18, paddingHorizontal: 13 },
  optSel: { backgroundColor: 'rgba(255,255,255,0.94)', borderColor: '#fff' },
  optTxt: { fontSize: 14, fontWeight: '600', color: '#fff', lineHeight: 19 },
  section: { marginBottom: 12 },
  sectionLbl: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, marginBottom: 7 },
  chips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: 'rgba(255,255,255,0.09)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)' },
  chipOn: { backgroundColor: '#fff', borderColor: '#fff' },
  chipTxt: { fontSize: 12, fontWeight: '500', color: '#fff' },
  submit: { marginHorizontal: 18, marginVertical: 18, padding: 15, backgroundColor: '#fff', borderRadius: 50, alignItems: 'center' },
  submitTxt: { color: C.brand, fontSize: 15, fontWeight: '700' },
});

const stp = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.brand, padding: 28 },
  h1: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 },
  rest: { fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 22 },
  stamp: { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  badge: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.38)', borderRadius: 30, paddingHorizontal: 24, paddingVertical: 9, marginBottom: 24 },
  badgeTxt: { fontSize: 14, color: '#fff' },
  progRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 290, marginBottom: 8 },
  progL: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },
  progR: { fontSize: 13, color: '#fff', fontWeight: '600' },
  bar: { width: '100%', maxWidth: 290, height: 5, backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 3, marginBottom: 10 },
  fill: { width: '16.67%', height: 5, backgroundColor: '#fff', borderRadius: 3 },
  visits: { fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 26 },
  btns: { width: '100%', maxWidth: 290, gap: 10 },
  done: { padding: 15, backgroundColor: '#1a56db', borderRadius: 50, alignItems: 'center' },
  doneTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  explore: { padding: 13, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: 50, alignItems: 'center' },
  exploreTxt: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
});

const hm = StyleSheet.create({
  header: { backgroundColor: C.brand, paddingTop: 18, paddingHorizontal: 18, paddingBottom: 18 },
  greet: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 14, lineHeight: 32 },
  search: { backgroundColor: '#fff', borderRadius: 50, flexDirection: 'row', alignItems: 'center', padding: 13, marginBottom: 11 },
  searchTxt: { flex: 1, fontSize: 14, color: '#9CA3AF' },
  searchAi: { fontSize: 11, fontWeight: '700', color: C.brand },
  chip: { borderRadius: 20, paddingHorizontal: 13, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.32)' },
  chipTxt: { fontSize: 12, fontWeight: '500', color: '#fff' },
  remind: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, backgroundColor: '#fff' },
  remindDate: { fontSize: 11, color: '#9CA3AF' },
  remindTitle: { fontSize: 14, fontWeight: '600', color: C.brand },
  remindSub: { fontSize: 12, color: '#9CA3AF' },
  miaCard: { margin: 14, backgroundColor: C.brand, borderRadius: 18, borderWidth: 1.8, borderColor: C.amber, overflow: 'hidden' },
  miaInner: { padding: 15, paddingBottom: 0 },
  miaTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  miaAv: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EF9F27', alignItems: 'center', justifyContent: 'center' },
  miaName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  miaDate: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  mia14: { fontSize: 12, fontWeight: '600', color: C.amber, marginLeft: 'auto' },
  miaDesc: { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 20, marginBottom: 11 },
  miaRestRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.12)', paddingTop: 10, marginBottom: 12 },
  miaThumb: { width: 42, height: 42, borderRadius: 10 },
  miaRestName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  miaRestLoc: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  miaRestSaved: { fontSize: 11, color: 'rgba(255,255,255,0.38)' },
  miaInvite: { padding: 14, backgroundColor: '#1a56db', alignItems: 'center' },
  miaInviteTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  miaOther: { padding: 10, alignItems: 'center' },
  miaOtherTxt: { color: 'rgba(255,255,255,0.45)', fontSize: 12 },
  section: { padding: 14 },
  banner: { borderRadius: 14, overflow: 'hidden', height: 140, justifyContent: 'flex-end', padding: 14 },
  bannerTxt: { fontSize: 17, fontWeight: '800', color: '#fff', lineHeight: 21 },
  savedPill: { marginHorizontal: 14, backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', gap: 8 },
  savedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.brand },
  savedTxt: { fontSize: 13, color: '#374151', flex: 1 },
  nav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: '#E8ECF0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, paddingBottom: 22 },
  navIcon: { fontSize: 22, opacity: 0.4 },
  navOn: { opacity: 1 },
  navAdd: { width: 48, height: 48, backgroundColor: C.brand, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  navAddTxt: { fontSize: 26, color: '#fff' },
});

const sr = StyleSheet.create({
  top: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { color: '#fff', fontSize: 24 },
  bar: { flex: 1, backgroundColor: '#fff', borderRadius: 50, flexDirection: 'row', alignItems: 'center', padding: 11, paddingLeft: 16 },
  barTxt: { flex: 1, fontSize: 14, color: '#374151' },
  arrow: { width: 34, height: 34, backgroundColor: C.brand, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  found: { fontSize: 13, color: 'rgba(255,255,255,0.65)', paddingHorizontal: 16, paddingBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.08)' },
  thumb: { width: 48, height: 48, borderRadius: 12 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#fff' },
  itemMeta: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  src: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  srcTxt: { fontSize: 10, fontWeight: '600', color: '#fff' },
  searchAll: { margin: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 50, padding: 13, alignItems: 'center' },
  trending: { backgroundColor: '#F0F4FA', padding: 16 },
  trendTitle: { fontSize: 14, fontWeight: '700', color: C.brand },
  trendSub: { fontSize: 12, color: '#9CA3AF', marginBottom: 12 },
  trendGrid: { flexDirection: 'row', gap: 10 },
  trendCard: { flex: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#E5E7EB' },
  trendPhoto: { height: 90, width: '100%' },
  trendInfo: { padding: 10 },
  trendName: { fontSize: 13, fontWeight: '600', color: C.brand },
  trendRating: { fontSize: 11, color: '#9CA3AF' },
  trendTags: { fontSize: 10, color: '#B0C1D9', marginTop: 1 },
});

const mc = StyleSheet.create({
  header: { backgroundColor: C.brand, paddingTop: 14, paddingHorizontal: 18, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { color: '#fff', fontSize: 24 },
  title: { fontSize: 15, fontWeight: '700', color: '#fff' },
  body: { padding: 14, gap: 12 },
  userBubble: { alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: C.brand, borderRadius: 18, borderBottomRightRadius: 4, padding: 12 },
  userTxt: { color: '#fff', fontSize: 14, lineHeight: 20 },
  aiBubble: { alignSelf: 'flex-start', maxWidth: '88%', backgroundColor: '#F0F4FA', borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, borderWidth: 0.5, borderColor: '#E5E7EB' },
  aiTxt: { color: '#1a1a2a', fontSize: 14, lineHeight: 20 },
  typing: { alignSelf: 'flex-start', backgroundColor: '#F0F4FA', borderWidth: 0.5, borderColor: '#E5E7EB', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12 },
  restCard: { alignSelf: 'flex-start', width: 270, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#E5E7EB', borderRadius: 14, overflow: 'hidden' },
  restPhoto: { height: 115, width: '100%' },
  restBody: { backgroundColor: C.brand, padding: 12 },
  restName: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  restMeta: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  restWhy: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10 },
  restWhyTxt: { fontSize: 12, color: '#374151', lineHeight: 18 },
  inviteBtn: { padding: 11, backgroundColor: '#1a56db', borderRadius: 25, alignItems: 'center' },
  inviteBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  platBtn: { alignSelf: 'flex-start', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 25 },
  platLine: { backgroundColor: '#06C755' },
  platIg: { backgroundColor: '#ee2a7b' },
  platImsg: { backgroundColor: '#34C759' },
  platTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, paddingBottom: 24, borderTopWidth: 0.5, borderTopColor: '#E5E7EB' },
  input: { flex: 1, backgroundColor: '#F0F4FA', borderWidth: 0.5, borderColor: '#E5E7EB', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 11 },
  send: { width: 38, height: 38, backgroundColor: C.brand, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  sentOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', padding: 32 },
  sentCheck: { width: 70, height: 70, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  sentTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 },
  sentSub: { fontSize: 14, color: 'rgba(255,255,255,0.62)', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  sentHome: { paddingHorizontal: 36, paddingVertical: 14, backgroundColor: '#fff', borderRadius: 50 },
  sentHomeTxt: { color: C.brand, fontSize: 15, fontWeight: '700' },
});
