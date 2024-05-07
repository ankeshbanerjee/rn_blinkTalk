import {StyleSheet} from 'react-native';
import React, {useMemo, PropsWithChildren, useContext} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {ThemeContext} from '../contexts/theme_context';

export type BottomSheetRefType = BottomSheetModal;

type Props = {
  snapPoint: number;
  hideHandle?: boolean;
  removeTopPadding?: boolean;
  onDismissCallback?: () => void;
  onChange?: (index: number) => void;
};

const BottomSheetComponent = React.forwardRef<
  BottomSheetModalMethods,
  PropsWithChildren<Props>
>((props, ref) => {
  const snapPoints = useMemo(() => [`${props.snapPoint}%`], []);
  const {theme} = useContext(ThemeContext);
  return (
    <BottomSheetModal
      ref={ref}
      handleIndicatorStyle={{
        height: props.hideHandle ? 0 : 6,
        backgroundColor: theme.secondaryContainer,
      }}
      handleStyle={props.removeTopPadding ? {padding: 0} : null}
      backdropComponent={(props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          {...props}
        />
      )}
      onChange={i => {
        if (props.onChange !== undefined) {
          props.onChange(i);
        }
      }}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      index={0}
      snapPoints={snapPoints}
      onDismiss={props.onDismissCallback ? props.onDismissCallback : () => {}}
      backgroundStyle={{
        backgroundColor: theme.backgroungColor,
      }}>
      {props.children}
    </BottomSheetModal>
  );
});

export default BottomSheetComponent;

const styles = StyleSheet.create({});
