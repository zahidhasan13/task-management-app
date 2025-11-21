import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import TaskListScreen from "../screens/Tasks/TaskListScreen";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        // User logged in → go to Tabs
        <Stack.Screen name="Tabs" component={TabNavigator} />
      ) : (
        // Not logged in → go to Auth (Login/Signup)
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
      <Stack.Screen name="Tasks" component={TaskListScreen} />
    </Stack.Navigator>
  );
}
