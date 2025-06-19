import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarShowLabel: false }}>
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='bookmarks'
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name='bookmarks-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='create'
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name='add-circle-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='notifications'
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name='notifications-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name='person-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
