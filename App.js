import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { AppRegistry } from 'react-native';

import AppNavigator from "./Navigation"; 


export default function App() {
  return (
    <NavigationContainer>
    <AppNavigator/>
    </NavigationContainer>
  );
}

