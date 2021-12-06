import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers/index';
import DynaCheckbox from './checkbox/DynaCheckbox';

export default function DynaAmazonRestrictedReportType(props) {
  const {formKey} = props;
  const connectionId = useSelector(state => selectors.fieldState(state, formKey, '_connectionId')?.value);
  const connectionType = useSelector(state => selectors.resource(state, 'connections', connectionId)?.http?.type);
  const apiType = useSelector(state => selectors.fieldState(state, formKey, 'unencrypted.apiType')?.value);
  const relativeURI = useSelector(state => selectors.fieldState(state, formKey, 'http.relativeURI')?.value);

  const visible = ((connectionType === 'Amazon-Hybrid' && apiType === 'Amazon-SP-API') || connectionType === 'Amazon-SP-API') &&
                    relativeURI?.startsWith('/reports/2021-06-30/documents/');

  return visible ? <DynaCheckbox {...props} /> : null;
}
