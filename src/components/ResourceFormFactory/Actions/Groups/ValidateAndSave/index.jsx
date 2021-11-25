import React from 'react';
import { TestSaveAndClose } from '../TestAndSave';
import NetsuiteValidateButton from './NetsuiteValidate';

export default function ValidateAndSave(props) {
  return (
    <TestSaveAndClose {...props} >
      <NetsuiteValidateButton {...props} />
    </TestSaveAndClose>
  );
}

