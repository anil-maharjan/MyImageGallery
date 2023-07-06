import React from 'react';
import {Modal, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import IconButton from '../button/IconButton';
import {colors} from '../../shared/colors';
import {responsiveSize} from '../../utils/responsiveUi';
import theme from '../../shared/theme/theme';
import * as ImagePicker from 'react-native-image-picker';

interface ImageAdditionModalProps {
  visible: boolean;
  onPress: (
    type: string,
    options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions,
  ) => any;
  onBackdropPress: () => void;
}

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
  iconName: string;
}

const actions: Action[] = [
  {
    title: 'From Library',
    type: 'library',
    options: {
      mediaType: 'photo',
      includeBase64: false,
      includeExtra: true,
    },
    iconName: 'file-image',
  },
  {
    title: 'Take Photo',
    type: 'capture',
    options: {
      mediaType: 'photo',
      includeBase64: false,
      includeExtra: true,
    },
    iconName: 'camera',
  },
];

const ImageAdditionModal: React.FC<ImageAdditionModalProps> = ({
  visible,
  onPress,
  onBackdropPress,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalView}>
        <TouchableOpacity
          style={styles.flex1}
          activeOpacity={1}
          onPress={onBackdropPress}
        />
        <View style={styles.modalSubView}>
          <Text style={styles.title}>How would you like to add photo?</Text>
          <View style={[styles.flexRow, styles.justifyBetween, styles.mh60]}>
            {actions.map(({title, type, options, iconName}) => {
              return (
                <View key={title} style={styles.justifyCenter}>
                  <IconButton
                    iconName={iconName}
                    onPress={() => onPress(type, options)}
                  />
                  <Text style={styles.smallText}>{title}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSubView: {
    backgroundColor: colors.white,
    paddingHorizontal: responsiveSize(20),
    paddingTop: responsiveSize(20),
    paddingBottom: responsiveSize(60),
    zIndex: 2,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  smallText: {
    fontSize: theme.fonts.small,
    color: colors.darkGray,
    marginTop: responsiveSize(8),
  },
  mh60: {
    marginHorizontal: responsiveSize(60),
  },
  title: {
    fontSize: theme.fonts.large,
    marginBottom: 30,
    textAlign: 'center',
    color: colors.textColor,
  },
  justifyCenter: {
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
});

export default ImageAdditionModal;
