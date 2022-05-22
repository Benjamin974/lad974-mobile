import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import BasketScreen from './screens/BasketScreen';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventBus from 'react-native-event-bus';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

const homeName = "Commerces";
const productsName = "Produits";
const basketName = "Panier";
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badge: 0
    };
  }

  async componentDidMount() {

    EventBus.getInstance().addListener("basketLength", this.listener = data => {
      this.setState({
        badge: data
      });
    })

    const basket = await AsyncStorage.getItem('currentBasket');
    this.setState({
      badge: basket != null ? basket.length.toString()[0] : 0
    });
  }

  render() {

    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={homeName}
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'grey',
            tabBarHideOnKeyboard: true,
            tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
            tabBarStyle: { padding: 10, height: 70 },
            tabBarIcon: ({ focused, color, size }) => {
              let rn = route.name;
              if (rn === homeName) {
                return <Ionicons name="home-outline" size={size} color={color} />;

              } else if (rn === productsName) {
                return <Feather name='shopping-bag' size={size} color={color} />;

              } else if (rn === basketName) {
                return <SimpleLineIcons name="basket" size={size} color={color} />;
              }
            },

          })}
        >

          <Tab.Screen name={homeName} component={HomeScreen} />
          <Tab.Screen name={productsName} component={ProductsScreen} initialParams={{ badge: this.state.badge }} />
          <Tab.Screen name={basketName} component={BasketScreen} options={{ tabBarBadge: this.state.badge }} />

        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}


