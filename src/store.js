// Local app state + persistence. No backend — everything lives here and in
// AsyncStorage so the prototype is fully self-contained and testable.
import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMG } from '../theme';

const KEY = 'mm.state.v1';

function seed() {
  return {
    user: null, // { name, username, taste } once onboarded
    restaurants: [
      { id: 'r1', name: 'The Bookstore Bar', area: '大安區', km: 1.2, cuisine: 'Cocktail Bar',
        price: '$$', tags: ['Date night', 'Girls'], source: 'Instagram',
        why: 'You saved this from an IG post tagged as a date-night spot in 大安區.',
        image: IMG.bar, visited: false, rating: null, listIds: ['l1', 'l2'], savedAgo: '2 weeks ago' },
      { id: 'r2', name: 'Trattoria di Primo', area: '大安區', km: 3.2, cuisine: 'Italian',
        price: '$$$', tags: ['Hand-made pasta', 'Date'], source: 'Instagram',
        why: 'An IG post you saved mentioned truffle pasta and wine — saved 3 weeks ago.',
        image: IMG.pasta, visited: false, rating: null, listIds: ['l1'], savedAgo: '3 weeks ago' },
      { id: 'r3', name: 'Sushi Tyu', area: '大安區', km: 2.0, cuisine: 'Japanese',
        price: '$$$', tags: ['Omakase', 'Special occasion'], source: 'Saved by a friend',
        why: 'No shellfish in the standard course — great for an omakase night.',
        image: IMG.sushi, visited: false, rating: null, listIds: ['l3'], savedAgo: '2 weeks ago' },
      { id: 'r4', name: '麵屋武藏', area: '信義區', km: 4.1, cuisine: 'Ramen',
        price: '$', tags: ['Late night', 'Solo'], source: 'Trending',
        why: 'You saved this over 66 days ago and still haven\'t been.',
        image: IMG.ramen, visited: false, rating: null, listIds: ['l2'], savedAgo: '66 days ago' },
      { id: 'r5', name: "An's Kitchen", area: '大安區', km: 0.8, cuisine: 'Fusion',
        price: '$$', tags: ['Fusion', 'Trending'], source: 'Trending',
        why: 'Trending in 大安 — matched to your taste profile.',
        image: IMG.fusion, visited: false, rating: null, listIds: [], savedAgo: 'Suggested' },
    ],
    lists: [
      { id: 'l1', name: 'Date night approved', emoji: '💕' },
      { id: 'l2', name: 'Taipei must-eats', emoji: '🌃' },
      { id: 'l3', name: 'Wishlist', emoji: '⭐' },
    ],
    friends: [
      { id: 'f1', name: 'Mia', avatar: '🎂', birthdayInDays: 14, likes: ['Japanese', 'omakase'],
        wishlist: ['r3'] },
    ],
  };
}

const StoreCtx = createContext(null);
export const useStore = () => useContext(StoreCtx);

function reducer(state, a) {
  switch (a.type) {
    case 'HYDRATE':
      return { ...a.state, _ready: true };
    case 'SIGN_UP':
      return { ...state, user: { name: a.name, username: a.username, taste: a.taste } };
    case 'SIGN_OUT':
      return { ...seed(), _ready: true };
    case 'ADD_RESTAURANT':
      return { ...state, restaurants: [a.restaurant, ...state.restaurants] };
    case 'TOGGLE_LIST': {
      return {
        ...state,
        restaurants: state.restaurants.map((r) => {
          if (r.id !== a.restaurantId) return r;
          const has = r.listIds.includes(a.listId);
          return { ...r, listIds: has ? r.listIds.filter((x) => x !== a.listId) : [...r.listIds, a.listId] };
        }),
      };
    }
    case 'MARK_VISITED':
      return {
        ...state,
        restaurants: state.restaurants.map((r) =>
          r.id === a.restaurantId ? { ...r, visited: true, rating: a.rating } : r),
      };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { _ready: false });
  const first = useRef(true);

  // Load once on boot.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        dispatch({ type: 'HYDRATE', state: raw ? JSON.parse(raw) : seed() });
      } catch {
        dispatch({ type: 'HYDRATE', state: seed() });
      }
    })();
  }, []);

  // Persist on change (skip the initial hydrate write).
  useEffect(() => {
    if (!state._ready) return;
    if (first.current) { first.current = false; return; }
    const { _ready, ...persist } = state;
    AsyncStorage.setItem(KEY, JSON.stringify(persist)).catch(() => {});
  }, [state]);

  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}

// Selectors / helpers
export const cuisinesExplored = (state) =>
  [...new Set(state.restaurants.filter((r) => r.visited).map((r) => r.cuisine))];
export const visitedCount = (state) =>
  state.restaurants.filter((r) => r.visited).length;
export const restaurantsInList = (state, listId) =>
  state.restaurants.filter((r) => r.listIds.includes(listId));
