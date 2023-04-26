import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const path = 'M18.0793 12.2243C17.7584 12.2243 17.598 12.4649 17.598 12.7055V17.5982C17.598 18.8816 16.5553 19.8441 15.3522 19.8441H6.52919C5.24585 19.8441 4.04762 18.8014 4.04762 17.5982V8.77528C4.04762 7.49194 5.32606 6.52943 6.52919 6.52943H10.9407C11.2615 6.52943 11.4219 6.28881 11.4219 6.04818C11.4219 5.72734 11.1813 5.56693 10.9407 5.56693L6.5 5.50024C4.5 5.50024 3 6.93048 3 8.77528V17.5982C3 19.4431 4.52397 20.967 6.36877 20.967H15.1917C17.0365 20.967 18.5605 19.4431 18.5605 17.5982V12.7055C18.6407 12.4649 18.4001 12.2243 18.0793 12.2243ZM20.8866 3.24087C20.7262 3.08045 20.5657 3.08045 20.4053 3.08045L14.9511 3.00024C14.6303 3.00024 14.4699 3.24087 14.4699 3.4815C14.4699 3.80233 14.7105 3.96275 14.9511 3.96275H19.122L11.1011 12.2243C10.8605 12.4649 10.8605 12.7857 11.1011 12.9461C11.1813 13.0263 11.3417 13.1066 11.5021 13.1066C11.6626 13.1066 11.823 13.0263 11.9032 12.9461L19.9241 4.76484V8.85549C19.9241 9.17632 20.1647 9.33674 20.4053 9.33674C20.7261 9.33674 20.8866 9.09611 20.8866 8.85549L20.9668 3.56171C21.047 3.4815 20.9668 3.32108 20.8866 3.24087Z';

export default function ExitIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d={path} />
    </SvgIcon>
  );
}
