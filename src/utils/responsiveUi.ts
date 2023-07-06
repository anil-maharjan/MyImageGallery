import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 393;
const guidelineBaseHeight = 851;

const scaleHorizontal = width / guidelineBaseWidth;
const scaleVertical = height / guidelineBaseHeight;
const scaleAvg = (scaleHorizontal + scaleVertical) / 2;

const responsiveSize = (size: number) => size * scaleAvg;

export {width, height, responsiveSize};
