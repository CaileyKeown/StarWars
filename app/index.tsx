// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// STAR WARS APP USING EXPO + REACT NATIVE
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

// app/index.tsx

// New Expo projects use the Expo router, which starts from app/index.tsx
// app.js would be used in older projects without the router

// sets up gesture handling for the app (touch & swipe), and drawer menus
import 'react-native-gesture-handler';

// React basics + state + side effects
import React, { useState, useEffect, useRef } from 'react';

// UI tools
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
  Animated,   // ⭐ for animation
} from 'react-native';

// ⭐ SWIPEABLE
import { Swipeable } from 'react-native-gesture-handler';

// NAVIGATION
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// ⭐ IMAGES FOR EACH SCREEN
import FilmsImage from '../assets/films.png';
import PlanetsImage from '../assets/planets.png';
import SpaceshipsImage from '../assets/spaceships.png';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


// ⭐ SIMPLE LIST WITH SWIPE + ANIMATION
function SimpleList({ title, data, loading, renderItem }) {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.screenContainer}>
        <Text style={styles.titleText}>{title}</Text>

        {loading && data.length === 0 ? (
          <ActivityIndicator size="large" color="yellow" />
        ) : null}

        {data.map((item, index) => {
          // ⭐ animation setup
          const fadeAnim = useRef(new Animated.Value(0)).current;
          const slideAnim = useRef(new Animated.Value(20)).current;

          useEffect(() => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
              }),
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
              }),
            ]).start();
          }, []);

          return (
            <Swipeable
              key={index}
              onSwipeableOpen={() =>
                alert(`You swiped: ${item.name || item.title}`)
              }
            >
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                {renderItem({ item })}
              </Animated.View>
            </Swipeable>
          );
        })}
      </View>
    </ScrollView>
  );
}

/* ⭐ PLANETS SCREEN */
function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadPlanets() {
      try {
        const response = await fetch('https://swapi.dev/api/planets/');
        const data = await response.json();
        setPlanets(data.results);
      } catch (error) {
        console.log('Error loading planets:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPlanets();
  }, []);

  return (
    <View style={{ flex: 1 }}>

      {/* ⭐ HEADER IMAGE */}
      <Image
        source={PlanetsImage}
        style={{ width: '100%', height: 180, resizeMode: 'cover' }}
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

      {/* modal */}
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
  );
}

/* ⭐ FILMS SCREEN */
function FilmsScreen() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadFilms() {
      try {
        const response = await fetch('https://swapi.dev/api/films/');
        const data = await response.json();
        setFilms(data.results);
      } catch (error) {
        console.log('Error loading films:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFilms();
  }, []);

  return (
    <View style={{ flex: 1 }}>

      {/* ⭐ HEADER IMAGE */}
      <Image
        source={FilmsImage}
        style={{ width: '100%', height: 180, resizeMode: 'cover' }}
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

      {/* modal */}
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
  );
}

/* ⭐ SPACESHIPS SCREEN */
function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadShips() {
      try {
        const response = await fetch('https://swapi.dev/api/starships/');
        const data = await response.json();
        setShips(data.results);
      } catch (error) {
        console.log('Error loading starships:', error);
      } finally {
        setLoading(false);
      }
    }
    loadShips();
  }, []);

  return (
    <View style={{ flex: 1 }}>

      {/* ⭐ HEADER IMAGE */}
      <Image
        source={SpaceshipsImage}
        style={{ width: '100%', height: 180, resizeMode: 'cover' }}
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

      {/* modal */}
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
  );
}


// ⭐ BOTTOM TABS (iOS)
function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}

// ⭐ DRAWER NAV (Android/Web)
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


// ⭐ STYLES (your original ones kept)
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
});
