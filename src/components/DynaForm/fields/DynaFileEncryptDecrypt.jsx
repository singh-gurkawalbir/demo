import React, { } from 'react';
import { useSelector } from 'react-redux';
import DynaCheckbox from './checkbox/DynaCheckbox';
import { selectors } from '../../../reducers';

export default function DynaFileEncryptDecrypt(props) {
  const { connectionId, defaultValue } = props;
  const connection = useSelector(state => selectors.resource(state, 'connections', connectionId));

  const enabled = connection?.pgp?.publicKey || connection?.pgp?.privateKey;

  return (
    <>
      <DynaCheckbox {...props} disabled={!enabled} defaultValue={enabled ? defaultValue : undefined} />
    </>
  );
}
