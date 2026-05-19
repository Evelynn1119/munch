// Flow 2 — Save a restaurant from Instagram. Port of remixed-54638c83.html.
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  Animated, SafeAreaView, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, IMG } from '../theme';

export default function Flow2({ onExit }) {
  const [screen, setScreen] = useState(1);
  const [sheet, setSheet] = useState(false);
  const [opening, setOpening] = useState(false);
  const banner = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(400)).current;
  const overlay = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sheetY, { toValue: sheet ? 0 : 400, duration: 380, useNativeDriver: true }).start();
  }, [sheet]);

  const go = (n) => {
    setScreen(n);
    if (n === 2) {
      banner.setValue(0);
      setTimeout(() => Animated.spring(banner, { toValue: 1, useNativeDriver: true, friction: 7 }).start(), 350);
    }
  };

  const tapMunch = () => {
    setSheet(false);
    setTimeout(() => go(2), 350);
  };

  const triggerAppOpen = () => {
    setOpening(true);
    overlay.setValue(0);
    Animated.timing(overlay, { toValue: 1, duration: 450, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(overlay, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setOpening(false);
        go(3);
      });
    }, 950);
  };

  const IGPost = ({ liked, saved }) => (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={s.igTop}>
        <Text style={s.igBack}>‹</Text>
        <View style={{ alignItems: 'center' }}>
          <Text style={s.igTopTitle}>TAIPEI_EAT_AROUND110</Text>
          <Text style={s.igTopSub}>Posts</Text>
        </View>
        <View style={{ width: 20 }} />
      </View>
      <View style={s.igHeader}>
        <LinearGradient colors={['#f9ce34', '#ee2a7b', '#6228d7']} style={s.igAvatar}>
          <View style={s.igAvatarInner}><Text style={{ fontSize: 18 }}>🍜</Text></View>
        </LinearGradient>
        <View>
          <Text style={s.igUname}>taipei_eat_around110</Text>
          <Text style={s.igLoc}>Taipei, Taiwan</Text>
        </View>
        <Text style={s.igMore}>···</Text>
      </View>
      <Image source={{ uri: IMG.bar }} style={s.igPhoto} />
      <View style={s.igActions}>
        <Text style={[s.igIcon, liked && { color: '#ed4956' }]}>{liked ? '♥' : '♡'}</Text>
        <Text style={s.igIcon}>💬</Text>
        <TouchableOpacity onPress={() => setSheet(true)}>
          <Text style={s.igIcon}>➤</Text>
        </TouchableOpacity>
        <Text style={[s.igIcon, s.igSave]}>{saved ? '🔖' : '🏷️'}</Text>
      </View>
      <Text style={s.igLikes}>Liked by <Text style={{ fontWeight: '700' }}>juliantara.uix</Text> and others</Text>
      <Text style={s.igCaption}>
        <Text style={{ fontWeight: '600' }}>taipei_eat_around110</Text> Taipei Restaurant top 10 must eat 🍜 #taipei #food #restaurant
      </Text>
      <Text style={s.igTime}>3 HOURS AGO</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ExitChip onExit={onExit} />

      {screen === 1 && (
        <View style={{ flex: 1 }}>
          <IGPost liked={false} saved={false} />
        </View>
      )}

      {screen === 2 && (
        <View style={{ flex: 1 }}>
          <IGPost liked saved />
          <Animated.View style={[s.banner, {
            opacity: banner,
            transform: [{ translateY: banner.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] }) }],
          }]}>
            <Image source={{ uri: IMG.bar }} style={s.bannerThumb} />
            <View style={{ flex: 1 }}>
              <Text style={s.bannerTitle}>The Bookstore Bar  <Text style={{ color: '#1D9E75' }}>✓ Saved</Text></Text>
              <Text style={s.bannerTags}>#Date_Night #Girls #Taipei #Food</Text>
            </View>
            <TouchableOpacity style={s.bannerCta} onPress={triggerAppOpen}>
              <Text style={s.bannerCtaTxt}>check out</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {screen === 3 && (
        <View style={{ flex: 1, backgroundColor: '#F6FCFF' }}>
          <View style={s.restBackBar}>
            <TouchableOpacity onPress={() => go(2)}>
              <Text style={s.restBackTxt}>‹ back to Instagram</Text>
            </TouchableOpacity>
            <View style={s.igBadge}><Text style={s.igBadgeTxt}>Instagram</Text></View>
          </View>
          <View style={s.restHero}>
            <Image source={{ uri: IMG.bar }} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['transparent', 'rgba(8,58,130,0.7)']} style={StyleSheet.absoluteFill} />
            <View style={s.restHeroInfo}>
              <Text style={s.restName}>The Bookstore Bar</Text>
              <Text style={s.restMeta}>大安區 · 1.2km · Open now   <Text style={s.restSrc}> Saved from IG </Text></Text>
            </View>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <View style={s.tagRow}>
              {['#Date_Night', '#Girls', 'Open now', '$$', '#Taipei'].map((t, i) => (
                <View key={i} style={[s.tag, i === 2 ? s.tagGreen : i === 3 ? s.tagAmber : s.tagBlue]}>
                  <Text style={[s.tagTxt, i === 2 ? { color: '#0F6E56' } : i === 3 ? { color: '#92600A' } : { color: C.brand }]}>{t}</Text>
                </View>
              ))}
            </View>
            <View style={s.aiNote}>
              <Text style={s.aiLabel}>◷  WHY YOU SAVED THIS</Text>
              <Text style={s.aiTxt}>Your IG saved post tagged this as Date Night spot in 大安區. AI also matched it to your "Girls night" mood based on the hashtags.</Text>
            </View>
            <View style={s.savedIn}>
              <Text style={s.savedInTitle}>SAVED INTO</Text>
              <SavedItem icon="💕" bg="#FFE5D9" name="Date night approved" meta="8 restaurants · 中山區" />
              <SavedItem icon="🌃" bg="#D9E5FF" name="Taipei must-eats" meta="12 restaurants" />
            </View>
          </ScrollView>
          <View style={s.ctaRow}>
            <TouchableOpacity style={s.ctaOutline}><Text style={s.ctaOutlineTxt}>Add to list</Text></TouchableOpacity>
            <TouchableOpacity style={s.ctaPrimary}><Text style={s.ctaPrimaryTxt}>Navigate →</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {/* Share sheet */}
      <Modal visible={sheet} transparent animationType="none" onRequestClose={() => setSheet(false)}>
        <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={() => setSheet(false)} />
        <Animated.View style={[s.shareSheet, { transform: [{ translateY: sheetY }] }]}>
          <View style={s.sheetHandle} />
          <View style={s.sheetSearch}><Text style={{ color: '#8e8e93' }}>🔍  Search</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.contacts}>
            {[['👩', 'Milla', '#FFE5D9'], ['👩‍🦱', 'Abby', '#D9E5FF'], ['🧑', 'Jordan', '#E5D9FF'], ['👦', 'Mike', '#D9FFE5'], ['👩‍🦰', 'Sara', '#FFD9E5']].map(([e, n, bg], i) => (
              <View key={i} style={s.contact}>
                <View style={[s.contactAv, { backgroundColor: bg }]}><Text style={{ fontSize: 24 }}>{e}</Text></View>
                <Text style={s.contactName}>{n}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={s.sheetSource}>
            <Text style={s.sheetSourceTitle}>Post from instagram.com</Text>
            <Text style={s.sheetSourceUrl}>instagram.com</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.apps}>
            <View style={[s.appIcon, { backgroundColor: '#0077b6' }]}><Text style={s.appGlyph}>✓</Text></View>
            <View style={[s.appIcon, { backgroundColor: '#34c759' }]}><Text style={s.appGlyph}>✉</Text></View>
            <TouchableOpacity style={[s.appIcon, s.appMunch]} onPress={tapMunch}>
              <Text style={s.appMunchTxt}>MM</Text>
              <Text style={s.appMunchSub}>Munch</Text>
            </TouchableOpacity>
            <View style={[s.appIcon, { backgroundColor: '#1877F2' }]}><Text style={s.appGlyph}>f</Text></View>
            <View style={[s.appIcon, { backgroundColor: '#E1306C' }]}><Text style={s.appGlyph}>📷</Text></View>
          </ScrollView>
        </Animated.View>
      </Modal>

      {/* App-open overlay */}
      {opening && (
        <Animated.View style={[StyleSheet.absoluteFill, s.appOpen, { opacity: overlay }]}>
          <Text style={s.appOpenLogo}>Munch{'\n'}Munch</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

function SavedItem({ icon, bg, name, meta }) {
  return (
    <View style={s.savedItem}>
      <View style={[s.savedIcon, { backgroundColor: bg }]}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
      <View>
        <Text style={s.savedName}>{name}</Text>
        <Text style={s.savedMeta}>{meta}</Text>
      </View>
    </View>
  );
}

function ExitChip({ onExit }) {
  return (
    <TouchableOpacity style={s.exitChip} onPress={onExit}>
      <Text style={s.exitChipTxt}>✕ flows</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  exitChip: { position: 'absolute', top: 6, right: 12, zIndex: 99, backgroundColor: 'rgba(0,0,0,0.06)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  exitChipTxt: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  igTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb' },
  igBack: { fontSize: 24, color: '#262626' },
  igTopTitle: { fontSize: 14, fontWeight: '600', color: '#262626' },
  igTopSub: { fontSize: 12, color: '#8e8e93' },
  igHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10 },
  igAvatar: { width: 36, height: 36, borderRadius: 18, padding: 2 },
  igAvatarInner: { flex: 1, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  igUname: { fontSize: 13, fontWeight: '600', color: '#262626' },
  igLoc: { fontSize: 11, color: '#8e8e93' },
  igMore: { marginLeft: 'auto', fontSize: 20, color: '#262626' },
  igPhoto: { width: '100%', height: 290 },
  igActions: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 },
  igIcon: { fontSize: 24, color: '#262626' },
  igSave: { marginLeft: 'auto' },
  igLikes: { fontSize: 13, fontWeight: '600', color: '#262626', paddingHorizontal: 14, paddingBottom: 4 },
  igCaption: { fontSize: 13, color: '#262626', paddingHorizontal: 14, paddingBottom: 4, lineHeight: 18 },
  igTime: { fontSize: 11, color: '#8e8e93', paddingHorizontal: 14, paddingBottom: 10 },
  banner: { position: 'absolute', top: 50, left: 10, right: 10, backgroundColor: '#fff', borderRadius: 18, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 30, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  bannerThumb: { width: 40, height: 40, borderRadius: 10 },
  bannerTitle: { fontSize: 12, fontWeight: '700', color: C.brand },
  bannerTags: { fontSize: 10, color: '#8e8e93', marginTop: 1 },
  bannerCta: { backgroundColor: C.brand, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  bannerCtaTxt: { color: '#fff', fontSize: 11, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  shareSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#f2f2f7', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#c7c7cc', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  sheetSearch: { marginHorizontal: 14, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  contacts: { gap: 16, paddingHorizontal: 18, paddingBottom: 14 },
  contact: { alignItems: 'center', gap: 5, width: 58 },
  contactAv: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  contactName: { fontSize: 11, color: '#3a3a3c' },
  sheetSource: { marginHorizontal: 14, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  sheetSourceTitle: { fontSize: 13, fontWeight: '500', color: '#000' },
  sheetSourceUrl: { fontSize: 12, color: '#8e8e93' },
  apps: { gap: 14, paddingHorizontal: 18, alignItems: 'center' },
  appIcon: { width: 54, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  appGlyph: { fontSize: 22, color: '#fff', fontWeight: '800' },
  appMunch: { backgroundColor: C.brand },
  appMunchTxt: { fontSize: 13, fontWeight: '800', color: '#fff' },
  appMunchSub: { fontSize: 9, color: 'rgba(255,255,255,0.7)' },
  appOpen: { backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  appOpenLogo: { fontSize: 42, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 46 },
  restBackBar: { backgroundColor: '#fff', paddingTop: 12, paddingBottom: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: C.border },
  restBackTxt: { fontSize: 13, color: C.brand, fontWeight: '500' },
  igBadge: { marginLeft: 'auto', backgroundColor: '#E1306C', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  igBadgeTxt: { fontSize: 10, fontWeight: '700', color: '#fff' },
  restHero: { height: 220 },
  restHeroInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  restName: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  restMeta: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  restSrc: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, fontSize: 10, color: '#fff', fontWeight: '600' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  tag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  tagBlue: { backgroundColor: '#EEF2FF' },
  tagGreen: { backgroundColor: '#E6F9F2' },
  tagAmber: { backgroundColor: '#FFF8E1' },
  tagTxt: { fontSize: 12, fontWeight: '500' },
  aiNote: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#D9E5FF' },
  aiLabel: { fontSize: 10, fontWeight: '700', color: '#5B7BA6', letterSpacing: 1, marginBottom: 6 },
  aiTxt: { fontSize: 13, color: C.textB, lineHeight: 21 },
  savedIn: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: '#EEF2FF' },
  savedInTitle: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 10 },
  savedItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  savedIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  savedName: { fontSize: 13, fontWeight: '600', color: C.brand },
  savedMeta: { fontSize: 11, color: '#9CA3AF' },
  ctaRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  ctaOutline: { flex: 1, padding: 15, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.brand, borderRadius: 50, alignItems: 'center' },
  ctaOutlineTxt: { color: C.brand, fontSize: 15, fontWeight: '600' },
  ctaPrimary: { flex: 1, padding: 15, backgroundColor: C.brand, borderRadius: 50, alignItems: 'center' },
  ctaPrimaryTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
