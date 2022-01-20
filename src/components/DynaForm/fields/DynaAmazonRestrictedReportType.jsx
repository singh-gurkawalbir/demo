import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers/index';
import DynaCheckbox from './checkbox/DynaCheckbox';

export default function DynaAmazonRestrictedReportType(props) {
  const {formKey} = props;
  const showAmazonRestrictedReportType = useSelector(state => selectors.showAmazonRestrictedReportType(state, formKey));

  return showAmazonRestrictedReportType ? <DynaCheckbox {...props} /> : null;
}
