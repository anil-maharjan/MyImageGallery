import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../shared/colors';
import {responsiveSize} from '../../utils/responsiveUi';
import theme from '../../shared/theme/theme';
import ImageAdditionModal from '../../components/modal/ImageAdditionModal';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import IconButton from '../../components/button/IconButton';
import {getArrayNumberToFill} from '../../utils/helperFunction';
import {SCREENS} from '../../shared/constants';

interface FlatListItemProps {
  item: string;
}

const GalleryScreen: React.FC = ({route, navigation}: any) => {
  const [imageFileNames, setImageFileNames] = useState<string[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchImageFileNames = async () => {
      try {
        const directoryPath = RNFS.DocumentDirectoryPath;
        const files = await RNFS.readDir(directoryPath);
        const imageFiles = files.filter(
          file =>
            file.isFile() &&
            file.name.endsWith('.jpg') &&
            file.name.startsWith('MyGalleryImg_'),
        );
        const fileNames = imageFiles.map(file => file.path);
        setImageFileNames(fileNames);
      } catch (error) {
        console.log('Error fetching image file names:', error);
      }
    };
    if (
      !route.params ||
      (route.params.imageUriLength !== undefined &&
        route.params.imageUriLength !== imageFileNames.length)
    ) {
      fetchImageFileNames();
    }
  }, [route.params]);

  const handleImagePress = (item: string) => {
    navigation.navigate(SCREENS.IMAGE_VIEWER, {imageFileNames, item});
  };

  const renderImageItem = ({item}: FlatListItemProps) => {
    return item.length ? (
      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <Image source={{uri: `file://${item}`}} style={styles.image} />
      </TouchableOpacity>
    ) : (
      <View style={styles.image}></View>
    );
  };

  const handleAddButtonPress = () => {
    setShowSelectionModal(true);
  };

  const handleAddAction = React.useCallback(
    async (type: string, options: CameraOptions | ImageLibraryOptions) => {
      const permissionResult = 'granted';
      if (permissionResult === 'granted') {
        if (type === 'capture') {
          launchCamera(options, handleResponse);
        } else {
          launchImageLibrary(options, handleResponse);
        }
      } else if (permissionResult === 'denied') {
        console.log(
          'So some modal to inform user to go to setting to give permission',
        );
      } else {
        console.log('Some error occured');
      }
    },
    [],
  );

  const handleResponse = (response: any) => {
    if (response.didCancel) {
      console.log('Image selection cancelled');
    } else if (response.error) {
      console.log('Image selection error:', response.error);
    } else {
      const imageData = response.assets && response.assets[0];
      const fileName = `MyGalleryImg_${Date.now()}.jpg`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      RNFS.copyFile(imageData.uri, destPath)
        .then(() => {
          setImageFileNames(prevImageFileName => [
            ...prevImageFileName,
            destPath,
          ]);
          console.log('Image saved successfully');
        })
        .catch(error => {
          console.log('Image save error:', error);
        });
    }
  };

  const closeSelectionModal = () => {
    setShowSelectionModal(false);
  };

  const renderEmptyComponent = (): JSX.Element => (
    <View style={styles.flex1}>
      <Icon
        style={styles.centered}
        name="image-outline"
        size={65}
        color={colors.lightGray}
      />
      <Text style={[styles.largeText, styles.greyText]}>No Images</Text>
      <Text style={[styles.smallText, styles.greyText]}>
        Add images using the plus button on the bottom right corner
      </Text>
    </View>
  );

  const renderSeperator = (): JSX.Element => <View style={styles.seperator} />;

  const emptyContainers = Array(
    getArrayNumberToFill(imageFileNames.length),
  ).fill('');
  const updatedData = [...imageFileNames, ...emptyContainers];
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flexGrow}
        data={updatedData}
        renderItem={renderImageItem}
        keyExtractor={item => item}
        ItemSeparatorComponent={renderSeperator}
        numColumns={3}
        columnWrapperStyle={styles.justifyBetween}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />

      <IconButton
        iconName="plus"
        iconSize={responsiveSize(30)}
        buttonStyle={styles.floatingBtn}
        buttonContainerStyle={styles.floatingBtnContainer}
        onPress={handleAddButtonPress}
      />
      <ImageAdditionModal
        visible={showSelectionModal}
        onPress={handleAddAction}
        onBackdropPress={closeSelectionModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  image: {
    height: responsiveSize(120),
    width: responsiveSize(113),
    borderRadius: responsiveSize(3),
  },
  floatingBtn: {
    width: responsiveSize(70),
    height: responsiveSize(70),
    elevation: 0,
  },
  floatingBtnContainer: {
    position: 'absolute',
    bottom: responsiveSize(100),
    right: responsiveSize(30),
  },
  flex1: {
    flex: 1,
    justifyContent: 'center',
  },
  flexGrow: {
    flexGrow: 1,
    paddingTop: responsiveSize(13),
    paddingBottom: responsiveSize(180),
  },
  largeText: {
    fontSize: theme.fonts.large,
    marginTop: responsiveSize(10),
  },
  greyText: {
    color: colors.gray,
    textAlign: 'center',
  },
  smallText: {
    fontSize: theme.fonts.small,
    paddingHorizontal: responsiveSize(40),
  },
  centered: {
    textAlign: 'center',
  },
  seperator: {
    marginTop: responsiveSize(8),
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
});

export default GalleryScreen;
