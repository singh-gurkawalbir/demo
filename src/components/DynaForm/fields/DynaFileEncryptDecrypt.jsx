import React, { useEffect} from 'react';
import { useSelector } from 'react-redux';
import DynaCheckbox from './checkbox/DynaCheckbox';
import { selectors } from '../../../reducers';

export default function DynaFileEncryptDecrypt(props) {
  const { connectionId, defaultValue, id, onFieldChange } = props;
  const connection = useSelector(state => selectors.resource(state, 'connections', connectionId));

  const enabled = connection?.pgp?.publicKey || connection?.pgp?.privateKey;

  useEffect(() => {
    onFieldChange(id, enabled ? defaultValue : false, true);
  }, [defaultValue, enabled, id, onFieldChange]);

  return <DynaCheckbox {...props} disabled={!enabled} />;
}
