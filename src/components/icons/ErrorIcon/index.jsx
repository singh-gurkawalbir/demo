import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function ErrorIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M16.11,8.09c-0.25-0.25-0.65-0.25-0.9,0L12.1,11.2L8.98,8.09c-0.25-0.25-0.65-0.25-0.9,0
  c-0.25,0.25-0.25,0.65,0,0.9l3.12,3.12l-3.12,3.12c-0.25,0.25-0.25,0.65,0,0.9c0.25,0.25,0.65,0.25,0.9,0L12.1,13l3.12,3.12
  c0.25,0.25,0.65,0.25,0.9,0c0.25-0.25,0.25-0.65,0-0.9L13,12.1l3.12-3.12C16.36,8.74,16.36,8.33,16.11,8.09z M12,1
  C5.92,1,1,5.92,1,12s4.92,11,11,11s11-4.92,11-11S18.08,1,12,1z M12,21.8c-5.41,0-9.8-4.39-9.8-9.8c0-5.41,4.39-9.8,9.8-9.8
  s9.8,4.39,9.8,9.8C21.8,17.41,17.41,21.8,12,21.8z"
      />
    </SvgIcon>
  );
}
