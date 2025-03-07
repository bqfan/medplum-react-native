import React from 'react';
import { G, Path, Svg, type SvgProps } from 'react-native-svg';

export const Theme = ({ color = '#000', ...props }: SvgProps) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <G
        id="🔍-Product-Icons"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <G
          id="ic_fluent_dark_theme_24_regular"
          fill="#212121"
          fillRule="nonzero"
        >
          <Path
            d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20.5 L12,3.5 C16.6944204,3.5 20.5,7.30557963 20.5,12 C20.5,16.6944204 16.6944204,20.5 12,20.5 Z"
            id="🎨-Color"
            fill={color}
          />
        </G>
      </G>
    </Svg>
  );
};
