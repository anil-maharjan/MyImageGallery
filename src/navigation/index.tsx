import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREENS} from '../shared/constants';
import GalleryScreen from '../screens/gallery/GalleryScreen';
import ImageViewerScreen from '../screens/imageViewer/ImageViewerScreen';
import {colors} from '../shared/colors';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={SCREENS.GALLERY}
          component={GalleryScreen}
          options={{
            headerTitleStyle: {
              color: colors.textColor,
            },
          }}
        />
        <Stack.Screen
          name={SCREENS.IMAGE_VIEWER}
          component={ImageViewerScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
