import React, { } from 'react';
import { useSelector } from 'react-redux';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers';

export default function DynaHashAlogithm(props) {
  const { connectionId } = props;
  const connection = useSelector(state => selectors.resource(state, 'connections', connectionId));

  if (!(connection?.pgp?.privateKey)) {
    return null;
  }

  return (
    <>
      <DynaSelect {...props} />
    </>
  );
}
