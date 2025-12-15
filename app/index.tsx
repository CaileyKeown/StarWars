// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// STAR WARS APP USING EXPO + REACT NATIVE
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Image,
  Animated,
  Pressable,
} from 'react-native';

import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Network from 'expo-network';

// navigation
import { useNavigation, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

/* -----------------------------------------
   SIMPLE LIST
----------------------------------------- */
function SimpleList({ title, data, loading, renderItem }) {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView>
      <Animated.View
        style={[
          styles.screenContainer,
          { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
        ]}
      >
        <Text style={styles.titleText}>{title}</Text>

        {loading && <ActivityIndicator size="large" color="yellow" />}

        {data.map((item, index) => (
          <View key={index}>{renderItem({ item })}</View>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

/* -----------------------------------------
   PLANET DETAIL SCREEN (STACK ONLY)
----------------------------------------- */
function PlanetDetailScreen({ route }) {
  const { planet } = route.params;

  return (
    <ScrollView style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{planet.name}</Text>
      <Text style={styles.detailLine}>Climate: {planet.climate}</Text>
      <Text style={styles.detailLine}>Terrain: {planet.terrain}</Text>
      <Text style={styles.detailLine}>Population: {planet.population}</Text>
      <Text style={styles.detailLine}>Diameter: {planet.diameter}</Text>
      <Text style={styles.detailLine}>Gravity: {planet.gravity}</Text>
      <Text style={styles.detailLine}>Orbital Period: {planet.orbital_period}</Text>
      <Text style={styles.detailLine}>Rotation Period: {planet.rotation_period}</Text>
    </ScrollView>
  );
}

/* -----------------------------------------
   PLANETS SCREEN
----------------------------------------- */
function PlanetsScreen() {
  const navigation = useNavigation();
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [networkOK, setNetworkOK] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('https://swapi.dev/api/planets/');
        const data = await res.json();
        setPlanets(data.results);
      } catch {
        setNetworkOK(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredPlanets = planets.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (!networkOK) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No network connection.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TextInput
        style={styles.inputBox}
        placeholder="Search planets..."
        placeholderTextColor="gray"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Image source={require('../assets/planets.png')} style={styles.headerImage} />

      <SimpleList
        title="Star Wars - Planets"
        data={filteredPlanets}
        loading={loading}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => <View />}
            onSwipeableRightOpen={() =>
              navigation.navigate('PlanetDetail', { planet: item })
            }
          >
            <Pressable
              onPress={() =>
                navigation.navigate('PlanetDetail', { planet: item })
              }
            >
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
            </Pressable>
          </Swipeable>
        )}
      />
    </GestureHandlerRootView>
  );
}

/* -----------------------------------------
   FILMS SCREEN
----------------------------------------- */
function FilmsScreen() {
  const [films, setFilms] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch('https://swapi.dev/api/films/')
      .then(res => res.json())
      .then(data => setFilms(data.results));
  }, []);

  return (
    <View>
      <TextInput
        style={styles.inputBox}
        placeholder="Search films..."
        placeholderTextColor="gray"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Image source={require('../assets/films.png')} style={styles.headerImage} />

      <SimpleList
        title="Star Wars - Films"
        data={films.filter(f =>
          f.title.toLowerCase().includes(searchText.toLowerCase())
        )}
        loading={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

/* -----------------------------------------
   SPACESHIPS SCREEN
----------------------------------------- */
function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch('https://swapi.dev/api/starships/')
      .then(res => res.json())
      .then(data => setShips(data.results));
  }, []);

  return (
    <View>
      <TextInput
        style={styles.inputBox}
        placeholder="Search ships..."
        placeholderTextColor="gray"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Image source={require('../assets/spaceships.png')} style={styles.headerImage} />

      <SimpleList
        title="Star Wars - Spaceships"
        data={ships.filter(s =>
          s.name.toLowerCase().includes(searchText.toLowerCase())
        )}
        loading={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

/* -----------------------------------------
   TABS / DRAWER (NO PlanetDetail)
----------------------------------------- */
function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Drawer.Navigator>
  );
}

/* -----------------------------------------
   ROOT STACK (DETAIL ONLY HERE)
----------------------------------------- */
function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Platform.OS === 'ios' ? TabsNavigator : DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PlanetDetail" component={PlanetDetailScreen} />
    </Stack.Navigator>
  );
}

/* -----------------------------------------
   APP ROOT
----------------------------------------- */
export default function App() {
  return (
    <NavigationIndependentTree>
      <RootStack />
    </NavigationIndependentTree>
  );
}

/* -----------------------------------------
   STYLES
----------------------------------------- */
const styles = StyleSheet.create({
  screenContainer: { backgroundColor: 'black', paddingTop: 12 },
  titleText: { color: 'yellow', fontSize: 24, textAlign: 'center' },
  headerImage: { width: '100%', height: 140, resizeMode: 'cover' },
  card: { backgroundColor: '#111', margin: 10, padding: 12, borderRadius: 8 },
  cardTitle: { color: 'yellow', fontSize: 18 },
  inputBox: {
    backgroundColor: '#222',
    borderColor: 'yellow',
    borderWidth: 1,
    margin: 10,
    padding: 8,
    color: 'white',
  },
  detailContainer: { backgroundColor: 'black', padding: 16 },
  detailTitle: { color: 'yellow', fontSize: 28, textAlign: 'center' },
  detailLine: { color: 'white', fontSize: 16, marginBottom: 8 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'yellow', fontSize: 18 },
});
