import {StyleSheet} from 'react-native';
import ColorAssets from './colors';
import {scale, verticalScale} from 'react-native-size-matters';

export const gs = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  card: {
    borderRadius: scale(10),
    backgroundColor: ColorAssets.white,
    elevation: 5,
    padding: scale(14),
    shadowColor: ColorAssets.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  listTile: {
    borderBottomColor: ColorAssets.lightGrey,
    borderBottomWidth: 1,
    paddingHorizontal: scale(16),
    padding: verticalScale(10),
  },
});
