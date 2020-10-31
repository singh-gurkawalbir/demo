import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ReplaceConnectionForm from './form';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';

export default function ReplaceConnectionDrawer({
  flowId,
  integrationId,
  childId,
}) {
  const [connName, setConnName] = useState('');
  const history = useHistory();

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <RightDrawer
      path="replaceConnection/:connId"
      height="short"
      onClose={handleClose}>
      <DrawerHeader title={`Replace connection: ${connName}`} />
      <ReplaceConnectionForm
        flowId={flowId} integrationId={integrationId} childId={childId} setConnName={setConnName}
        onClose={handleClose} />
    </RightDrawer>
  );
}
