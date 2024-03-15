import * as React from 'react';
import MainContainer from './screens/MainContainer';

function App(){
  return(
    <MainContainer/>
  )
}

export default App;
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './screens/HomeScreen';
// import GameNavigation from './screens/GameScreens/GameNavigator';
// import ProfilePage from './screens/ProfilePage';
// import SplashScreen from './screens/CustomComponents/Splash';
// import NavBar from './screens/CustomComponents/NavBar';
// import ImageFeed from './screens/ImageFeed';

// import LogInNavigation from './screens/LoginReg/LogInNavigator';

// const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//     <Stack.Navigator initialRouteName="Splash">
//       <Stack.Screen
//         name="Splash"
//         component={SplashScreen}
//         options={{ headerShown: false, gestureEnabled: false, }} 
//       />
//       <Stack.Screen
//         name="LogInNav"
//         component={LogInNavigation}
//         options={{ headerShown: false, gestureEnabled: false }} 
//       />
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ headerShown: false, gestureEnabled: false }} 
//       />
//       <Stack.Screen
//           name="Main"
//           component={NavBar}
//           options={{ headerShown: false, gestureEnabled: false }} 
//       />
//       <Stack.Screen
//         name="Game"
//         component={GameNavigation}
//         options={{ headerShown: false, gestureEnabled: false }} 
//       />
//       <Stack.Screen
//         name="Profile"
//         component={ProfilePage}
//         options={{ headerShown: false, gestureEnabled: false }} 
//       />
//       <Stack.Screen
//         name="Social"
//         component={ImageFeed}
//         options={{ headerShown: false, gestureEnabled: false }} 
//       />
//     </Stack.Navigator>
//   </NavigationContainer>
//   );
// }

// export default App;