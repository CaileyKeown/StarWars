import React from "react";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Star Wars" }} />
      <Tabs.Screen name="PlanetsScreen" options={{ title: "Planets" }} />
      <Tabs.Screen name="FilmsScreen" options={{ title: "Films" }} />
      <Tabs.Screen name="SpaceshipsScreen" options={{ title: "Spaceships" }} />
    </Tabs>
  );
}
