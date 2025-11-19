import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import MainNavigator from "./src/navigation/MainNavigator";
import store from "./src/redux/store";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}
