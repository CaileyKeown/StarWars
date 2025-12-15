import { ScrollView, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PlanetDetail() {
  const { planet } = useLocalSearchParams();

  if (!planet || typeof planet !== 'string') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="yellow" />
      </View>
    );
  }

  const data = JSON.parse(planet);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{data.name}</Text>

      <Text style={styles.line}>Climate: {data.climate}</Text>
      <Text style={styles.line}>Terrain: {data.terrain}</Text>
      <Text style={styles.line}>Population: {data.population}</Text>
      <Text style={styles.line}>Diameter: {data.diameter}</Text>
      <Text style={styles.line}>Gravity: {data.gravity}</Text>
      <Text style={styles.line}>Orbital Period: {data.orbital_period}</Text>
      <Text style={styles.line}>Rotation Period: {data.rotation_period}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'yellow',
    marginBottom: 16,
    textAlign: 'center',
  },
  line: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
