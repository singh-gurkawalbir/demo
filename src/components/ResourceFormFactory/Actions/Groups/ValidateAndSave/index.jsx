import React from 'react';
import NetsuiteValidateButton from './NetsuiteValidate';
import SaveAndClose from '../SaveAndClose';

export default function ValidateAndSave(props) {
  return (
    <>
      <SaveAndClose {...props} />
      <NetsuiteValidateButton {...props} />

    </>
  );
}

