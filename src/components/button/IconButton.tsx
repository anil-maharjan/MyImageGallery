import React from 'react';
import {colors} from '../../shared/colors';
import {responsiveSize} from '../../utils/responsiveUi';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../shared/theme/theme';

interface IconButtonProps {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
  buttonContainerStyle?: object;
  buttonStyle?: object;
  onPress: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconSize = 40,
  iconColor = colors.white,
  buttonContainerStyle = {},
  buttonStyle = {},
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={buttonContainerStyle}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={[styles.buttonStyle, buttonStyle]}>
        <Icon
          name={iconName}
          size={responsiveSize(iconSize)}
          color={iconColor}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.boxShadow,
    borderRadius: responsiveSize(100),
    width: responsiveSize(75),
    height: responsiveSize(75),
  },
});

export default IconButton;
