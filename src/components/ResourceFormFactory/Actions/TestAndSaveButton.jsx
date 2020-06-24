import React from 'react';
import TestSaveAndCloseButton from './TestSaveAndCloseButton';

export default function TestAndSaveButton(props) {
  return <TestSaveAndCloseButton {...props} skipCloseOnSave color="primary" label="Save" />;
}
