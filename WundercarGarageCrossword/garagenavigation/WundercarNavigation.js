import { createStackNavigator } from '@react-navigation/stack';

import WundercarOnboard from '../wundercarscreens/WundercarOnboard';
import GarageHome from '../wundercarscreens/GarageHome';
import GarageStoriesScreen from '../wundercarscreens/GarageStoriesScreen';
import SavedGarageStories from '../wundercarscreens/SavedGarageStories';
import CrosswordPlayScreen from '../wundercarscreens/CrosswordScreen';
import WundercarLevels from '../wundercarscreens/WundercarLevels';
import RepairGarageScreen from '../wundercarscreens/RepairGarageScreen';
import WundercarLoader from '../wundercarscreens/WundercarLoader';

const Stack = createStackNavigator();

const WundercarNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WundercarLoader" component={WundercarLoader} />
      <Stack.Screen name="WundercarOnboard" component={WundercarOnboard} />
      <Stack.Screen name="GarageHome" component={GarageHome} />
      <Stack.Screen
        name="GarageStoriesScreen"
        component={GarageStoriesScreen}
      />
      <Stack.Screen name="SavedGarageStories" component={SavedGarageStories} />
      <Stack.Screen name="CrosswordScreen" component={CrosswordPlayScreen} />
      <Stack.Screen name="WundercarLevels" component={WundercarLevels} />
      <Stack.Screen name="RepairGarageScreen" component={RepairGarageScreen} />
    </Stack.Navigator>
  );
};

export default WundercarNavigation;
