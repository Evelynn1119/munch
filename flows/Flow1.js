// Flow 1 — Onboarding. Faithful port of remixed-9eace2be.html.
// Bug fix vs. original: "No, I'll pass" now skips the whole quiz to the
// result instead of dropping the user into quiz question 2 (clearly a typo
// in the prototype's go(9) call).
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Animated, SafeAreaView,
} from 'react-native';
import { C, CARD_COLORS } from '../theme';

const QUIZ = [
  {
    sub: '選餐廳的時候，哪個最讓你崩潰？',
    title: 'This is the most annoying......',
    opts: ['超多選擇，不知從何選起', '排隊等很久', '每個人意見不同', '推薦的不合口味', '訂不到位', '沒有停車位', '菜單看不懂', '太貴了'],
  },
  {
    sub: '如果只能選一條街住一輩子，你選…',
    title: 'I know this is a hard one.....',
    opts: ['忠孝東路', '永康街', '饒河街夜市', '信義區', '師大商圈', '東區', '中山北路', '天母'],
  },
  {
    sub: '你的胃什麼時候最有靈魂？',
    title: 'We want to dive deeper here...',
    opts: ['深夜宵夜', '週末早午餐', '下班後的第一口', '假日市集', '朋友聚餐', '一個人放空', '出去玩的時候', '慶祝特別日子'],
  },
  {
    sub: '你手機裡的餐廳情報通常從哪來？',
    title: 'Ok, promise last one',
    opts: ['Instagram', '小紅書', '朋友推薦', 'Google Maps', '美食部落格', 'YouTube', 'TikTok', '路過看到'],
  },
  {
    sub: '朋友突然問你「今晚吃什麼」，你的反應是…',
    title: 'This is really the last one',
    opts: ['我早有名單了', '開始狂滑手機', '帶你去秘密口袋', '隨便你決定', '問 AI 推薦', '附近走走看', '查 Munch Munch', '叫外送吧'],
  },
];
const FOODS = ['拉麵', '漢堡', '火鍋', '墨西哥', '壽司', '義大利麵'];
const VALUE_PROPS = [
  { emoji: '🍜', t: 'Every restaurant\nworth remembering', s: 'One place for the spots you actually want to try.' },
  { emoji: '✨', t: 'Saved from anywhere', s: 'Instagram, friends, that blog you read at 2am — all in one list.' },
  { emoji: '📍', t: 'Never lose a craving', s: 'We nudge you when you\'re near a place you saved.' },
];

function Fade({ id, children }) {
  const o = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    o.setValue(0);
    Animated.timing(o, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [id]);
  return <Animated.View style={{ flex: 1, opacity: o }}>{children}</Animated.View>;
}

export default function Flow1({ onExit }) {
  const [s, setS] = useState(0);
  const [food, setFood] = useState({});
  const [picks, setPicks] = useState({}); // per-question selected indices
  const go = (n) => setS(n);

  const TopBar = ({ back, pct }) => (
    <View style={st.topbar}>
      <TouchableOpacity style={st.backBtn} onPress={() => go(back)}>
        <Text style={st.backChevron}>‹</Text>
      </TouchableOpacity>
      <View style={st.progWrap}><View style={st.progBar}>
        <View style={[st.progFill, { width: `${pct}%` }]} />
      </View></View>
      <View style={{ width: 36 }} />
    </View>
  );

  const QuizScreen = ({ qi, pct, back, next }) => {
    const q = QUIZ[qi];
    const sel = picks[qi] || {};
    const toggle = (i) => setPicks({ ...picks, [qi]: { ...sel, [i]: !sel[i] } });
    return (
      <View style={{ flex: 1 }}>
        <TopBar back={back} pct={pct} />
        <View style={st.qHeader}>
          <Text style={st.qSub}>{q.sub}</Text>
          <Text style={st.qTitle}>{q.title}</Text>
        </View>
        <ScrollView contentContainerStyle={st.cardGrid} showsVerticalScrollIndicator={false}>
          {q.opts.map((label, i) => (
            <TouchableOpacity key={i} activeOpacity={0.85}
              style={[st.qCard, sel[i] && st.qCardSel]} onPress={() => toggle(i)}>
              <View style={[st.cardColor, { backgroundColor: CARD_COLORS[i % 8] }]} />
              <View style={st.qLabelWrap}><Text style={st.qLabel}>{label}</Text></View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={st.bottomWrap}>
          <TouchableOpacity style={st.btnPrimary} onPress={() => go(next)}>
            <Text style={st.btnPrimaryTxt}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  let screen;
  if (s === 0) {
    screen = (
      <TouchableOpacity activeOpacity={1} style={st.splash} onPress={() => go(1)}>
        <Text style={st.splashLogo}>Munch{'\n'}Munch</Text>
        <Text style={st.splashHint}>tap anywhere to start</Text>
      </TouchableOpacity>
    );
  } else if (s >= 1 && s <= 3) {
    const vp = VALUE_PROPS[s - 1];
    screen = (
      <View style={st.vpScreen}>
        <View style={st.vpBody}>
          <Text style={st.vpEmoji}>{vp.emoji}</Text>
          <Text style={st.vpTitle}>{vp.t}</Text>
          <Text style={st.vpSub}>{vp.s}</Text>
        </View>
        <View style={st.dotsNav}>
          <TouchableOpacity onPress={() => go(4)}><Text style={st.navTxt}>Skip</Text></TouchableOpacity>
          <View style={st.dots}>
            {[1, 2, 3].map((d) => <View key={d} style={[st.dot, d === s && st.dotOn]} />)}
          </View>
          <TouchableOpacity onPress={() => go(s === 3 ? 4 : s + 1)}>
            <Text style={st.navTxt}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (s === 4) {
    screen = (
      <View style={st.signup}>
        <Text style={st.signupLogo}>Munch Munch</Text>
        <TouchableOpacity style={st.btnPrimary} onPress={() => go(5)}><Text style={st.btnPrimaryTxt}>Sign Up Free</Text></TouchableOpacity>
        <TouchableOpacity style={st.btnSecondary} onPress={() => go(5)}><Text style={st.btnSecondaryTxt}>Sign In</Text></TouchableOpacity>
        <Text style={st.dividerTxt}>or</Text>
        <TouchableOpacity style={st.btnSocial} onPress={() => go(6)}><Text style={st.btnSecondaryTxt}>  Sign in with Google</Text></TouchableOpacity>
        <TouchableOpacity style={st.btnSocial} onPress={() => go(6)}><Text style={st.btnSecondaryTxt}>  Sign in with Apple</Text></TouchableOpacity>
        <Text style={st.fineprint}>By continuing you agree to our Privacy Policy</Text>
      </View>
    );
  } else if (s === 5) {
    screen = (
      <ScrollView style={st.white} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={st.sHeader}>
          <TouchableOpacity onPress={() => go(4)}><Text style={st.backLink}>← Back</Text></TouchableOpacity>
          <Text style={st.sLabel}>Welcome!</Text>
          <Text style={st.sSub}>Just the basics and we can get you started</Text>
        </View>
        <View style={st.inputWrap}>
          <Field label="Email" placeholder="Enter your email here" />
          <Field label="Password" placeholder="Enter your password here" secure />
          <Text style={st.inputHint}>8 characters min · 1 uppercase · 1 number or special character</Text>
          <Field label="Phone" placeholder="🇹🇼 +886  Phone number" />
        </View>
        <View style={st.bottomWrap}>
          <TouchableOpacity style={st.btnPrimary} onPress={() => go(6)}><Text style={st.btnPrimaryTxt}>Continue</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else if (s === 6) {
    screen = (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={st.sHeader}>
          <TouchableOpacity onPress={() => go(5)}><Text style={st.backLink}>← Back</Text></TouchableOpacity>
          <Text style={st.sLabel}>About You</Text>
          <Text style={st.sSub}>How can we call you?</Text>
        </View>
        <View style={st.inputWrap}>
          <Field label="Name" placeholder="Enter your name here" white />
          <Text style={st.inputHint}>How would you like us to call you</Text>
          <Field label="Username" placeholder="@" white />
        </View>
        <View style={st.bottomWrap}>
          <TouchableOpacity style={st.btnPrimary} onPress={() => go(7)}><Text style={st.btnPrimaryTxt}>Create account</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else if (s === 7) {
    screen = (
      <View style={st.pers}>
        <Text style={st.persIcon}>🍽️</Text>
        <Text style={st.persTitle}>Let's Personalize this for You</Text>
        <Text style={st.persSub}>Help us understand your taste so we can curate the perfect restaurant list — takes 30 seconds.</Text>
        <View style={{ width: '100%', gap: 10, marginTop: 20 }}>
          <TouchableOpacity style={st.btnPrimary} onPress={() => go(8)}><Text style={st.btnPrimaryTxt}>Continue</Text></TouchableOpacity>
          <TouchableOpacity style={st.btnSecondary} onPress={() => go(14)}><Text style={st.btnSecondaryTxt}>No, I'll pass</Text></TouchableOpacity>
        </View>
      </View>
    );
  } else if (s === 8) {
    screen = (
      <View style={{ flex: 1 }}>
        <TopBar back={7} pct={16} />
        <View style={st.qHeader}>
          <Text style={st.qSub}>Evelynn, nice to have you here</Text>
          <Text style={st.qTitle}>週五晚上，你的理想晚餐是...</Text>
          <Text style={st.qHint}>Pick all that speak to your soul</Text>
        </View>
        <ScrollView contentContainerStyle={st.cardGrid} showsVerticalScrollIndicator={false}>
          {FOODS.map((label, i) => (
            <TouchableOpacity key={i} activeOpacity={0.85}
              style={[st.qCard, food[i] && st.qCardSel]} onPress={() => setFood({ ...food, [i]: !food[i] })}>
              <View style={[st.cardColor, { backgroundColor: CARD_COLORS[i % 8] }]} />
              <View style={st.foodLabelWrap}>
                <View style={[st.checkDot, food[i] && st.checkDotOn]} />
                <Text style={st.qLabel}>{label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={st.bottomWrap}>
          <TouchableOpacity style={st.btnPrimary} onPress={() => go(9)}><Text style={st.btnPrimaryTxt}>Continue</Text></TouchableOpacity>
        </View>
      </View>
    );
  } else if (s >= 9 && s <= 13) {
    const qi = s - 9;
    const pct = [33, 50, 66, 83, 100][qi];
    screen = <QuizScreen qi={qi} pct={pct} back={s - 1} next={s + 1} />;
  } else {
    screen = (
      <View style={{ flex: 1 }}>
        <View style={st.resultTop}>
          <Text style={st.resultIllus}>🌟</Text>
          <Text style={st.resultTag}>You are a real one......</Text>
          <Text style={st.resultType}>氛圍製造機</Text>
        </View>
        <View style={st.resultBottom}>
          <Text style={st.resultDesc}>對你來說，吃什麼是其次，在哪裡吃才是重點。你的 IG 限動就是一本活的台北餐廳氛圍指南。</Text>
          <TouchableOpacity style={st.resultNext} onPress={onExit}>
            <Text style={st.resultNextTxt}>Let's go →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: s === 0 || s === 4 ? '#fff' : C.bg1 }}>
      <ExitChip onExit={onExit} />
      <Fade id={s}>{screen}</Fade>
    </SafeAreaView>
  );
}

function Field({ label, placeholder, secure, white }) {
  return (
    <View style={[st.inputGroup, white && { backgroundColor: '#fff' }]}>
      <Text style={st.inputLabel}>{label}</Text>
      <TextInput style={st.inputField} placeholder={placeholder}
        placeholderTextColor={C.textS} secureTextEntry={secure} />
    </View>
  );
}

function ExitChip({ onExit }) {
  return (
    <TouchableOpacity style={st.exitChip} onPress={onExit}>
      <Text style={st.exitChipTxt}>✕ flows</Text>
    </TouchableOpacity>
  );
}

const st = StyleSheet.create({
  white: { flex: 1, backgroundColor: '#fff' },
  exitChip: { position: 'absolute', top: 6, right: 12, zIndex: 99, backgroundColor: 'rgba(0,0,0,0.06)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  exitChipTxt: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', gap: 8 },
  splashLogo: { fontSize: 52, fontWeight: '800', color: C.blue1, textAlign: 'center', lineHeight: 56 },
  splashHint: { fontSize: 14, color: C.textS, marginTop: 20 },
  vpScreen: { flex: 1, backgroundColor: '#fff' },
  vpBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 36, gap: 14 },
  vpEmoji: { fontSize: 72 },
  vpTitle: { fontSize: 28, fontWeight: '800', color: C.textH, textAlign: 'center', lineHeight: 34 },
  vpSub: { fontSize: 15, color: C.textS, textAlign: 'center', lineHeight: 24 },
  dotsNav: { height: 88, backgroundColor: C.blue1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32 },
  dots: { flexDirection: 'row', gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotOn: { width: 20, backgroundColor: '#fff' },
  navTxt: { color: '#fff', fontSize: 16, fontWeight: '500', padding: 8 },
  signup: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12, backgroundColor: '#fff' },
  signupLogo: { fontSize: 34, fontWeight: '800', color: C.blue1, marginBottom: 24 },
  dividerTxt: { fontSize: 14, color: C.textS, marginVertical: 4 },
  fineprint: { fontSize: 12, color: C.textS, textAlign: 'center', marginTop: 8 },
  btnPrimary: { width: '100%', padding: 17, borderRadius: 50, backgroundColor: C.blue1, alignItems: 'center' },
  btnPrimaryTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnSecondary: { width: '100%', padding: 16, borderRadius: 50, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.border, alignItems: 'center' },
  btnSecondaryTxt: { color: C.textB, fontSize: 16, fontWeight: '500' },
  btnSocial: { width: '100%', padding: 16, borderRadius: 50, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.border, alignItems: 'center' },
  sHeader: { paddingTop: 40, paddingHorizontal: 28, paddingBottom: 28 },
  backLink: { color: C.blue1, fontSize: 14, fontWeight: '500', marginBottom: 20 },
  sLabel: { fontSize: 26, fontWeight: '700', color: C.textH },
  sSub: { fontSize: 14, color: C.textS, marginTop: 4 },
  inputWrap: { paddingHorizontal: 24, gap: 12 },
  inputGroup: { backgroundColor: C.inputBg, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: C.textB, minWidth: 72, paddingVertical: 18 },
  inputField: { flex: 1, fontSize: 15, color: C.textB, paddingVertical: 18 },
  inputHint: { fontSize: 12, color: C.textS, paddingHorizontal: 4 },
  bottomWrap: { padding: 24, paddingBottom: 36, marginTop: 'auto' },
  pers: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14, backgroundColor: '#fff' },
  persIcon: { fontSize: 64 },
  persTitle: { fontSize: 24, fontWeight: '700', color: C.textH, textAlign: 'center', lineHeight: 32 },
  persSub: { fontSize: 15, color: C.textS, textAlign: 'center', lineHeight: 24 },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.inputBg, alignItems: 'center', justifyContent: 'center' },
  backChevron: { fontSize: 22, color: C.textB, lineHeight: 24 },
  progWrap: { flex: 1 },
  progBar: { backgroundColor: C.border, borderRadius: 4, height: 5, overflow: 'hidden' },
  progFill: { height: 5, backgroundColor: C.blue1, borderRadius: 4 },
  qHeader: { paddingHorizontal: 24, paddingBottom: 16 },
  qSub: { fontSize: 12, fontWeight: '600', color: C.blue1, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  qTitle: { fontSize: 20, fontWeight: '700', color: C.textH, lineHeight: 26 },
  qHint: { fontSize: 13, color: C.textS, marginTop: 4 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 16, gap: 12 },
  qCard: { width: '47%', borderRadius: 16, overflow: 'hidden', borderWidth: 2.5, borderColor: 'transparent' },
  qCardSel: { borderColor: C.blue1 },
  cardColor: { height: 110, width: '100%' },
  qLabelWrap: { backgroundColor: '#fff', padding: 10 },
  qLabel: { fontSize: 13, fontWeight: '600', color: C.textH, textAlign: 'center' },
  foodLabelWrap: { backgroundColor: '#fff', padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  checkDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: '#C5D5F2', backgroundColor: '#fff' },
  checkDotOn: { backgroundColor: C.blue1, borderColor: C.blue1 },
  resultTop: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingTop: 70, paddingHorizontal: 40, paddingBottom: 36 },
  resultIllus: { fontSize: 80, marginBottom: 16 },
  resultTag: { fontSize: 15, color: C.textS, marginBottom: 8 },
  resultType: { fontSize: 32, fontWeight: '800', color: C.textH, textAlign: 'center' },
  resultBottom: { flex: 1, backgroundColor: C.blue1, paddingHorizontal: 32, paddingTop: 28, paddingBottom: 48 },
  resultDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 28, marginBottom: 28 },
  resultNext: { width: '100%', padding: 17, borderRadius: 50, backgroundColor: '#000', alignItems: 'center' },
  resultNextTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
