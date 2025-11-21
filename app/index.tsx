// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// STAR WARS APP USING EXPO + REACT NATIVE
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

// app/index.tsx

// New Expo projects use the Expo router, which starts from app/index.tsx
// app.js would be used in older projects without the router

// sets up gesture handling for the app (touch & swipe), and drawer menus
import 'react-native-gesture-handler';

// React basics + state + side effects
// useState lets us store API data
// useEffect lets us run code when the screen first loads
import React, { useState, useEffect } from 'react';

// UI tools from React Native
import {
  View,
  Text,
  StyleSheet,
  Platform, // tells us if we are on iOS or Android
  FlatList, // shows a scrollable list
  ActivityIndicator, // loading spinner
  TextInput, // ⭐ NEW (textbox for search)
  Button, // ⭐ NEW (submit button)
  Modal, // ⭐ NEW (popup box)
  Pressable, // ⭐ NEW (close modal button)
} from 'react-native';

// navigation tools
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// side darwer menu

// Create navigator objects: one for bottom tabs (iOS) and one for drawer menu (Android)
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


function SimpleList({ title, data, loading, renderItem }) {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.titleText}>{title}</Text>

      {/* If loading and no data yet, show spinner */}
      {loading && data.length === 0 ? (
        <ActivityIndicator size="large" color="yellow" />
      ) : null}

      {/* Show list of items */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

/*
  Comonents for each screen: (Planets, Films, Spaceships).
*/

/* ⭐PLANETS SCREEN
   - show loading circle
   - call the API
   - save the planets in planets state variable
   - stop the loading circle
   - display the list of planets
*/
function PlanetsScreen() { // planets screen component
  const [planets, setPlanets] = useState([]); // store list of planets
  const [loading, setLoading] = useState(true); // loading circle thingy

  // ⭐ NEW state for search + modal
  const [searchText, setSearchText] = useState(""); // textbox value
  const [modalVisible, setModalVisible] = useState(false); // opens modal

  // when user opens the screen, that's when useEffect runs and then fetches the planet list
  useEffect(() => {
    async function loadPlanets() { // async function to fetch planets
      try {
        const response = await fetch('https://swapi.dev/api/planets/'); // "Go to Star Wars API and get the planets page"
        const data = await response.json(); // Converts the response into JSON format
        setPlanets(data.results); // data.results is the array of planets; i'm storing it in the state varaibles "planets"
      } catch (error) {
        console.log('Error loading planets:', error); // just incase there's a network error or something
      } finally {
        setLoading(false); // turning off the loading circle thingy 
      }
    }

    loadPlanets(); // now i'm actually executing the function to load the planets
  }, []);

  return (
    <View style={{ flex: 1 }}>
      
      {/* ⭐ SEARCH TEXTBOX + BUTTON */}
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
        renderItem={({ item }) => ( // tells the list how to display each item
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text> 
          </View>
        )}
      />

        //

      {/* ⭐ NEW MODAL POPUP */}
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


/* ⭐FILMS SCREEN
    -displays each film title and episode number
    -scrollable list
*/
function FilmsScreen() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ NEW
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

// Modal is a type of pop-up windoww inside an app
// Appears at the top of screen and blocks interaction with the rest of the app until the user closes it
// will say something like "You typed: Tattoine"

      {/* ⭐ MODAL POPUP */}
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


/* ⭐SPACESHIPS SCREEN
   - SWAPI calls these starships but i'm calling them spaceships
   - Shows each ship name
*/
function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ NEW
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

      {/* ⭐ MODAL POPUP */}
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


/*
  Bottom tabs (for iOS):
  Shows Planets / Films / Spaceships at the bottom of the screen.
  makes a tab button called "Planets", "Films", "Spaceships", and when tapped, shows the component for that screen.
*/
function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}

/*
  Drawer (for Android/web):
  Sets up drawer navigation; the menu slides in from the left and lets the user open any of the 3 screens
*/
function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Drawer.Navigator>
  );
}

// App() is the root component. It checks the platform and loads TabsNavigator for iOS or DrawerNavigator for Android/web.

export default function App() {
  return Platform.OS === 'ios' ? <TabsNavigator /> : <DrawerNavigator />;
}

/*   STYLES
   - Screen layout
   - List styling
   - Card styling
   - Colors matching Star Wars theme, so yellow and black stuffs
*/
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 12,
    alignItems: 'stretch',
    backgroundColor: 'black', // background color
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow', // title color
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

  // ⭐ SEARCH FIELD STYLE
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

  // ⭐ NEW MODAL STYLES
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

// Reminder: To start the app, run "expo start" in the terminal