import * as React from 'react';
import { Animated, Easing, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import GameNavigation from './screens/GameScreens/GameNavigator';
import ProfilePage from './screens/ProfilePage';
import SplashScreen from './screens/CustomComponents/Splash'; 
import ImageFeed from './screens/ImageFeed';
import LogInNavigation from './screens/LoginReg/LogInNavigator';

const Stack = createNativeStackNavigator();

const CustomTransition = ({ children, transition }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(100)).current;

  React.useEffect(() => {
    const animateIn = () => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400, // Adjust duration as needed
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200, // Adjust duration as needed
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    };

    const animateOut = () => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 100,
          duration: 150, 
          easing: Easing.in(Easing.ease),
        }),
      ]).start();
    };

    if (transition.type === 'slide_in') {
      animateIn();
    } else if (transition.type === 'slide_out') {
      animateOut();
    }
  }, [transition]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            animation: ({ current, next, layouts }) => {
              return {
                gestureDirection: 'horizontal',
                transitionSpec: {
                  open: { animation: 'timing', config: { duration: 400 } },
                  close: { animation: 'timing', config: { duration: 400 } },
                },
                cardStyleInterpolator: ({ current, next, layouts: { screen } }) => {
                  const transition = {
                    type: next ? 'slide_in' : 'slide_out',
                  };
                  return <CustomTransition transition={transition}></CustomTransition>;
                },
              };
            },
          }}>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LogInNav" component={LogInNavigation} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameNavigation} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Social" component={ImageFeed} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default App;
