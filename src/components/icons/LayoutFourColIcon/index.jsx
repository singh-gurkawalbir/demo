import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function LayoutFourColIcon(props) {
  return (
    <SvgIcon {...props}>
      <rect width="24" height="24" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.2 3.2V9.8H9.8V3.2H3.2ZM3.2 14.2V20.8H9.8V14.2H3.2ZM14.2 3.2V9.8H20.8V3.2H14.2ZM14.2
        14.2V20.8H20.8V14.2H14.2ZM3 2C2.44772 2 2 2.44772 2 3V10C2 10.5523 2.44772 11 3 11H10C10.5523 11 11 10.5523 11
        10V3C11 2.44772 10.5523 2 10 2H3ZM3 13C2.44772 13 2 13.4477 2 14V21C2 21.5523 2.44772 22 3 22H10C10.5523 22 11
        21.5523 11 21V14C11 13.4477 10.5523 13 10 13H3ZM13 3C13 2.44772 13.4477 2 14 2H21C21.5523 2 22 2.44772 22 3V10C22
        10.5523 21.5523 11 21 11H14C13.4477 11 13 10.5523 13 10V3ZM14 13C13.4477 13 13 13.4477 13 14V21C13 21.5523 13.4477
        22 14 22H21C21.5523 22 22 21.5523 22 21V14C22 13.4477 21.5523 13 21 13H14Z" />
    </SvgIcon>

  );
}
