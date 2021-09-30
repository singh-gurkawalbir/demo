import React from 'react';
import { useSelector } from 'react-redux';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers/index';

export default function DynaSelectAmazonSellerCentralAPIType(props) {
  const {formKey} = props;
  const connectionId = useSelector(state => selectors.fieldState(state, formKey, '_connectionId')?.value);
  const isConnectionHybrid = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)?.http?.type === 'Amazon-Hybrid');

  return isConnectionHybrid ? <DynaSelect {...props} /> : null;
}
