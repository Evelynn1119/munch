// Munch Munch — a single restaurant-saving app.
// Boots to onboarding until an account exists, then a tabbed app. All state
// is local (AsyncStorage) — no API providers, fully self-contained.
import React from 'react';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { C } from './theme';
import { StoreProvider, useStore } from './src/store';
import { NavProvider, useNav } from './src/nav';
import TabBar from './src/components/TabBar';
import Onboarding from './src/screens/Onboarding';
import Home from './src/screens/Home';
import Explore from './src/screens/Explore';
import Lists, { ListDetail } from './src/screens/Lists';
import Profile from './src/screens/Profile';
import RestaurantDetail from './src/screens/RestaurantDetail';
import AddRestaurant from './src/screens/AddRestaurant';
import RateVisit from './src/screens/RateVisit';
import PlanWithFriend from './src/screens/PlanWithFriend';

const TABS = { home: Home, explore: Explore, lists: Lists, profile: Profile };

function Root() {
  const { state } = useStore();
  const { tab, top } = useNav();

  if (!state._ready) {
    return (
      <View style={{ flex: 1, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Text style={{ fontSize: 34, fontWeight: '800', color: '#fff' }}>Munch Munch</Text>
        <ActivityIndicator color="rgba(255,255,255,0.7)" />
      </View>
    );
  }

  if (!state.user) {
    return <Onboarding />;
  }

  const TabScreen = TABS[tab] || Home;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1 }}><TabScreen /></View>
      <TabBar />
      {top && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.bg }}>
          <StackScreen screen={top.screen} params={top.params} />
        </View>
      )}
    </View>
  );
}

function StackScreen({ screen, params }) {
  switch (screen) {
    case 'detail': return <RestaurantDetail id={params.id} />;
    case 'rate': return <RateVisit id={params.id} />;
    case 'add': return <AddRestaurant />;
    case 'plan': return <PlanWithFriend friendId={params.friendId} />;
    case 'listDetail': return <ListDetail listId={params.listId} />;
    default: return null;
  }
}

export default function App() {
  return (
    <StoreProvider>
      <NavProvider>
        <StatusBar barStyle="light-content" />
        <Root />
      </NavProvider>
    </StoreProvider>
  );
}
