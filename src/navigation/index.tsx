import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ContactScreen from '../screens/ContactScreen';
import MockExamScreen from '../screens/MockExamScreen';
import MockExamResultScreen from '../screens/MockExamResultScreen';
import ContactScreen from '../screens/ContactScreen';

import { RootStackParamList, RootTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'AWS CLF 試験対策' }} 
      />
      <Stack.Screen 
        name="Quiz" 
        component={QuizScreen} 
        options={{ title: '問題' }} 
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
        options={{ title: '結果' }} 
      />
      <Stack.Screen 
        name="MockExam" 
        component={MockExamScreen} 
        options={{ title: '模擬試験' }} 
      />
      <Stack.Screen 
        name="MockExamResult" 
        component={MockExamResultScreen} 
        options={{ title: '模擬試験結果' }} 
      />
    </Stack.Navigator>
  );
};

const StatisticsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Statistics" 
        component={StatisticsScreen} 
        options={{ title: '学習統計' }} 
      />
    </Stack.Navigator>
  );
};

const BookmarksStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen} 
        options={{ title: 'ブックマーク' }} 
      />
      <Stack.Screen 
        name="Quiz" 
        component={QuizScreen} 
        options={{ title: '問題' }} 
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
        options={{ title: '結果' }} 
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: '設定' }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: 'お問い合わせ' }}
      />
    </Stack.Navigator>
  );
};

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'StatisticsTab') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'BookmarksTab') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            } else if (route.name === 'SettingsTab') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066cc',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack} 
          options={{ 
            headerShown: false,
            title: 'ホーム'
          }} 
        />
        <Tab.Screen 
          name="StatisticsTab" 
          component={StatisticsStack} 
          options={{ 
            headerShown: false,
            title: '統計'
          }} 
        />
        <Tab.Screen 
          name="BookmarksTab" 
          component={BookmarksStack} 
          options={{ 
            headerShown: false,
            title: 'ブックマーク'
          }} 
        />
        <Tab.Screen 
          name="SettingsTab" 
          component={SettingsStack} 
          options={{ 
            headerShown: false,
            title: '設定'
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
