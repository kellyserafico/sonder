import { Tabs } from "expo-router";
import React from "react";
import { View, Platform } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
// import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#451994", 
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
              backgroundColor: "black",
            },
            default: {
              backgroundColor: "black",
            },
          }),
          tabBarBackground: () => (
            <View style={{ backgroundColor: "black", flex: 1 }} />
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              <AntDesign name="search1" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wordstorm"
          options={{
            title: "Word Cloud",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="brain" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <AntDesign name="user" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="viewprofile"
          options={{
            href: null, 
          }}
        />
      </Tabs>
    </>
  );
}