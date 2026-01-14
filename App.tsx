import { NavigationContainer } from '@react-navigation/native';
import WundercarNavigation from './WundercarGarageCrossword/garagenavigation/WundercarNavigation';
import { StoreProvider } from './WundercarGarageCrossword/wundercaststore/garageContext';

const App = () => {
  return (
    <NavigationContainer>
      <StoreProvider>
        <WundercarNavigation />
      </StoreProvider>
    </NavigationContainer>
  );
};

export default App;
