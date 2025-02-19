import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BackButtonSvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const BackButtonSvg: React.FC<BackButtonSvgProps> = ({ 
  width = 25, 
  height = 25, 
  color = '#000' 
}) => {
  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
};

export default BackButtonSvg;
