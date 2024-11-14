// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TouristSpotsScreen from './src/screens/TouristSpotsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TouristSpots">
        <Stack.Screen
          name="TouristSpots"
          component={TouristSpotsScreen}
          options={{ title: 'Descubra Sua Cidade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
