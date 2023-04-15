import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import React from 'react';
import HomeScreen from './src/views/screens/HomeScreen';
import Attendance from './src/views/screens/Attendance';
import StudentRegistration from './src/views/screens/StudentRegistration';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {
  
  const Stack = createNativeStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
        <Stack.Screen name="StudentRegistration" component={StudentRegistration}></Stack.Screen>
        
        <Stack.Screen name="Attendance" component={Attendance}></Stack.Screen>
        

      </Stack.Navigator>
    </NavigationContainer>

  );
}

