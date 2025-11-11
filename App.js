import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import SplashScreen from "./src/screens/SplashScreen";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  const isLoggedIn = false;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500); // simulate splash delay
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Provider store={store}>
      <NavigationContainer>
      {isLoggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
    </Provider>
  );
}
