// app/index.tsx

// New Expo projects use the Expo router, which starts from app/index.tsx
// app.js would be used in older projects without the router

// sets up gesture handling for the app (touch & swipe), and drawer menus
import 'react-native-gesture-handler';


import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native'; //Reactive Native UI tools
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // bottom tab bar
import { createDrawerNavigator } from '@react-navigation/drawer'; // side darwer menu

// Create navigator objects: one for bottom tabs (iOS) and one for drawer menu (Android)
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/*
  Comonents for each screen: (Planets, Films, Spaceships).
  Each one just shows text of which screen you're on
*/

function PlanetsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.titleText}>Star Wars - Planets</Text>
      <Text style={styles.bodyText}>This is the Planets screen.</Text>
    </View>
  );
}

function FilmsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.titleText}>Star Wars - Films</Text>
      <Text style={styles.bodyText}>This is the Films screen.</Text>
    </View>
  );
}

function SpaceshipsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.titleText}>Star Wars - Spaceships</Text>
      <Text style={styles.bodyText}>This is the Spaceships screen.</Text>
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


// just some basic styling to give Star Wars vibes
// each key (like ScreenContainer) is a style that can be applied to a component using style={styles.screenContainer}

const styles = StyleSheet.create({ 
  screenContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // background color
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow', // title color
    marginBottom: 8, // add some space below the title
  },
  bodyText: {
    fontSize: 16,
    color: 'white', // body text color
  },
});
