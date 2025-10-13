import React from 'react';
import { IconProps } from './common/commonIconTypes';

const CloseIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  color = '#fff',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 1L1 17M17 17L1 1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CloseIcon;
