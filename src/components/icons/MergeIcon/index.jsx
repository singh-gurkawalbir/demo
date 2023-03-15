import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const path = `M4.17761 4.68228C4.00304 4.41296 3.64652 4.35201 3.3813 4.54615C3.11608 4.74029 3.04261 5.11599 3.21717 
  5.38531L7.50424 11.9991L3.21585 18.615C3.04128 18.8843 3.11476 19.26 3.37998 19.4542C3.6452 19.6483 4.00171 19.5874 
  4.17629 19.3181L8.46344 12.7041H19.6644L15.9202 16.68C15.6975 16.9165 15.7009 17.2964 15.9281 17.5285C16.1551 17.7605 
  16.5198 17.7569 16.7426 17.5203L21.3684 12.6083C21.518 12.4494 21.5656 12.226 21.5119 12.0261C21.5071 11.8855 21.4551 
  11.746 21.355 11.6357L16.8184 6.63414C16.5999 6.39328 16.2354 6.38251 16.0041 6.61009C15.7728 6.83766 15.7626 7.21741 
  15.9811 7.45827L19.6508 11.5041H8.59687C8.58904 11.4894 8.58055 11.4749 8.57136 11.4607L4.17761 4.68228Z`;

export default function MergeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d={path} />
    </SvgIcon>
  );
}

