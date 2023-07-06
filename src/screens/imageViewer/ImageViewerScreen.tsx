import React, {useEffect, useState} from 'react';
import ImageView from 'react-native-image-viewing';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {colors} from '../../shared/colors';
import {responsiveSize} from '../../utils/responsiveUi';
import {extractedDate, getFormattedDate} from '../../utils/helperFunction';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import {SCREENS} from '../../shared/constants';
import theme from '../../shared/theme/theme';

interface HeaderProps {
  imageIndex: number;
}

const ImageViewerScreen: React.FC = ({route, navigation}: any) => {
  const {imageFileNames, item} = route.params;
  const [imageUri, setImageUri] = useState<{uri: string}[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    if (imageFileNames.length) {
      const uriList = imageFileNames.map((fileName: string) => ({
        uri: `file://${fileName}`,
      }));
      setImageUri(uriList);
      setCurrentImageIndex(imageFileNames.indexOf(item));
    }
  }, [imageFileNames, item]);

  useEffect(() => {
    const backButtonHandler = () => {
      if (imageFileNames.length !== imageUri.length) {
        navigation.navigate(SCREENS.GALLERY, {imageUriLength: imageUri.length});
        return true;
      } else {
        return false;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
  }, [imageFileNames, imageUri]);

  const handleKey = (_: any, index: number) => {
    return index.toString();
  };

  const onClose = (): void => {
    navigation.navigate(SCREENS.GALLERY, {imageUriLength: imageUri.length});
  };

  const handleDeleteImage = async (imagePath: string) => {
    try {
      const url = imagePath;
      await RNFS.unlink(url.replace('file:///', ''));
      const imageUriList = imageUri.filter(
        uriData => uriData.uri !== imagePath,
      );
      setImageUri(imageUriList);
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
      if (imageUriList.length <= 0) {
        onClose();
      }
    } catch (e) {
      console.log('Error deleting image:', e);
    }
  };

  const renderHeader = () =>
    imageUri.length ? (
      <View style={[styles.headerContainer, styles.flexRow]}>
        <View style={styles.flexRow}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.backBtn}
            activeOpacity={0.8}>
            <Icon
              name="chevron-left"
              size={responsiveSize(25)}
              color={colors.textColor}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {getFormattedDate(extractedDate(imageUri[currentImageIndex].uri))}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteImage(imageUri[currentImageIndex].uri)}
          style={styles.backBtn}
          activeOpacity={0.8}>
          <Icon
            name="trash-can-outline"
            size={responsiveSize(25)}
            color={colors.textColor}
          />
        </TouchableOpacity>
      </View>
    ) : null;

  return (
    <ImageView
      images={imageUri}
      imageIndex={currentImageIndex}
      HeaderComponent={renderHeader}
      visible={true}
      onRequestClose={onClose}
      keyExtractor={handleKey}
      backgroundColor={colors.lightestGray}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    paddingVertical: responsiveSize(16),
    justifyContent: 'space-between',
  },
  headerText: {
    color: colors.textColor,
    fontSize: theme.fonts.normal,
  },
  backBtn: {
    paddingHorizontal: responsiveSize(15),
    paddingVertical: responsiveSize(8),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ImageViewerScreen;
