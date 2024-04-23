import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function IcSend(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M27.45 15.11l-22-11a1 1 0 00-1.08.12 1 1 0 00-.33 1L7 16 4 26.74A1 1 0 005 28a1 1 0 00.45-.11l22-11a1 1 0 000-1.78zm-20.9 10L8.76 17H18v-2H8.76L6.55 6.89 24.76 16 6.55 25.11z"
        fill="#fafafa"
      />
    </Svg>
  );
}

export default IcSend;
