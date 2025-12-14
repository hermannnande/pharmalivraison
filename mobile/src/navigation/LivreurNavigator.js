import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Écrans
import LivreurHomeScreen from '../screens/livreur/LivreurHomeScreen';
import LivreurOrdersScreen from '../screens/livreur/LivreurOrdersScreen';
import LivreurProfileScreen from '../screens/livreur/LivreurProfileScreen';

const Tab = createBottomTabNavigator();

const LivreurNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        },
        headerShown: false
      }}>
      <Tab.Screen
        name="LivreurHome"
        component={LivreurHomeScreen}
        options={{
          tabBarLabel: 'Commandes',
          tabBarIcon: ({ color, size }) => (
            <Icon name="motorbike" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="LivreurOrders"
        component={LivreurOrdersScreen}
        options={{
          tabBarLabel: 'Historique',
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="LivreurProfile"
        component={LivreurProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default LivreurNavigator;








