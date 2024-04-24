import React, {useMemo, PropsWithChildren, useContext} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {ThemeContext} from '../contexts/theme_context';

export type BottomSheetRefType = BottomSheetModal;

type Props = {
  snapPoint: number;
  onDismissCallback?: () => void;
};

const BottomSheetComponent = React.forwardRef<
  BottomSheetModal,
  PropsWithChildren<Props>
>((props, ref) => {
  const {theme} = useContext(ThemeContext);
  const snapPoints = useMemo(() => [`${props.snapPoint}%`, '90%'], []);
  return (
    <BottomSheetModal
      ref={ref}
      handleIndicatorStyle={{
        backgroundColor: theme.secondaryColor,
      }}
      backdropComponent={(props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          {...props}
        />
      )}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      index={0}
      snapPoints={snapPoints}
      onDismiss={props.onDismissCallback ? props.onDismissCallback : () => {}}
      backgroundStyle={{
        backgroundColor: theme.surfaceVariant,
      }}>
      {props.children}
    </BottomSheetModal>
  );
});

export default BottomSheetComponent;
