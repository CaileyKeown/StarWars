// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// STAR WARS APP USING EXPO + REACT NATIVE
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

// app/index.tsx

// New Expo projects use the Expo router, which starts from app/index.tsx
// app.js would be used in older projects without the router

import 'react-native-gesture-handler';

import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TextInput,
  Button,
  Modal,
  Pressable,
  ScrollView,
  Image,
  Animated,
} from 'react-native';

import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

// ⭐ NEW — network status
import * as Network from 'expo-network';

// navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/*  
  SIMPLE LIST — now includes:
  ✔ ScrollView
  ✔ Swipeable items
  ✔ Animated slide-in cards
*/
function SimpleList({ title, data, loading, renderItem }) {
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.screenContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.titleText}>{title}</Text>

        {loading && data.length === 0 ? (
          <ActivityIndicator size="large" color="yellow" />
        ) : null}

        {data.map((item, index) => (
          <Swipeable
            key={index}
            onSwipeableOpen={() =>
              alert(`You swiped: ${item.name || item.title}`)
            }
          >
            {renderItem({ item })}
          </Swipeable>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

/* -----------------------------------------
   PLANETS SCREEN
----------------------------------------- */
function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);

  // search + modal
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // ⭐ NEW — network state
  const [networkOK, setNetworkOK] = useState(true);

  useEffect(() => {
    async function checkNetwork() {
      const state = await Network.getNetworkStateAsync();
      setNetworkOK(state.isConnected && state.isInternetReachable);
    }
    checkNetwork();
  }, []);

  useEffect(() => {
    async function loadPlanets() {
      try {
        const response = await fetch('https://swapi.dev/api/planets/');
        const data = await response.json();
        setPlanets(data.results);
      } catch (error) {
        setNetworkOK(false);
      } finally {
        setLoading(false);
      }
    }
    loadPlanets();
  }, []);

  if (!networkOK) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No network connection. Please check your internet.
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* ⭐ IMAGE AT TOP OF SCREEN */}
        <Image
          source={require('../assets/planets.png')}
          style={styles.headerImage}
        />


        <TextInput
          style={styles.inputBox}
          placeholder="Search planets..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={() => setModalVisible(true)} />

        <SimpleList
          title="Star Wars - Planets"
          data={planets}
          loading={loading}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
          )}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>You typed: {searchText}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

/* -----------------------------------------
   FILMS SCREEN
----------------------------------------- */
function FilmsScreen() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [networkOK, setNetworkOK] = useState(true);

  useEffect(() => {
    async function checkNetwork() {
      const state = await Network.getNetworkStateAsync();
      setNetworkOK(state.isConnected && state.isInternetReachable);
    }
    checkNetwork();
  }, []);

  useEffect(() => {
    async function loadFilms() {
      try {
        const response = await fetch('https://swapi.dev/api/films/');
        const data = await response.json();
        setFilms(data.results);
      } catch {
        setNetworkOK(false);
      } finally {
        setLoading(false);
      }
    }
    loadFilms();
  }, []);

  if (!networkOK) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No network connection. Please check your internet.
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Image
          source={require('../assets/films.png')}
          style={styles.headerImage}
        />


        <TextInput
          style={styles.inputBox}
          placeholder="Search films..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={() => setModalVisible(true)} />

        <SimpleList
          title="Star Wars - Films"
          data={films}
          loading={loading}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardLine}>Episode: {item.episode_id}</Text>
            </View>
          )}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>You typed: {searchText}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

/* -----------------------------------------
   SPACESHIPS SCREEN
----------------------------------------- */
function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [networkOK, setNetworkOK] = useState(true);

  useEffect(() => {
    async function checkNetwork() {
      const state = await Network.getNetworkStateAsync();
      setNetworkOK(state.isConnected && state.isInternetReachable);
    }
    checkNetwork();
  }, []);

  useEffect(() => {
    async function loadShips() {
      try {
        const response = await fetch('https://swapi.dev/api/starships/');
        const data = await response.json();
        setShips(data.results);
      } catch {
        setNetworkOK(false);
      } finally {
        setLoading(false);
      }
    }
    loadShips();
  }, []);

  if (!networkOK) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No network connection. Please check your internet.
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Image
          source={require('../assets/spaceships.png')}
          style={styles.headerImage}
        />


        <TextInput
          style={styles.inputBox}
          placeholder="Search spaceships..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={() => setModalVisible(true)} />

        <SimpleList
          title="Star Wars - Spaceships"
          data={ships}
          loading={loading}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardLine}>Model: {item.model}</Text>
            </View>
          )}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>You typed: {searchText}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

/* -----------------------------------------
   NAVIGATION
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

export default function App() {
  return Platform.OS === 'ios' ? <TabsNavigator /> : <DrawerNavigator />;
}

/* -----------------------------------------
   STYLES
----------------------------------------- */
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 12,
    alignItems: 'stretch',
    backgroundColor: 'black',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  cardTitle: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  cardLine: {
    color: 'white',
    fontSize: 14,
  },
  inputBox: {
    backgroundColor: '#222',
    borderColor: 'yellow',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    color: 'white',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderColor: 'yellow',
    borderWidth: 2,
  },
  modalText: {
    color: 'yellow',
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'yellow',
    fontSize: 20,
    textAlign: 'center',
  },
});