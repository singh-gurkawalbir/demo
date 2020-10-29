import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import RightDrawer from '../../../../components/drawer/Right/V2';
import DrawerHeader from '../../../../components/drawer/Right/V2/DrawerHeader';
import DrawerContent from '../../../../components/drawer/Right/V2/DrawerContent';
import ErrorList from '../../../../components/ErrorList';
import ErrorDrawerAction from './ErrorDrawerAction';

export default function ErrorDetailsDrawer({ flowId }) {
  const history = useHistory();
  const match = useRouteMatch();
  const [errorType, setErrorType] = useState('open');
  const { resourceId } = match?.params || {};

  const resourceName = useSelector(state => {
    if (!resourceId) return;

    const exportObj = selectors.resource(state, 'exports', resourceId);

    if (exportObj?.name) return exportObj.name;

    return selectors.resource(state, 'imports', resourceId)?.name;
  });

  const handleClose = useCallback(() => {
    // history.goBack() doesn't work when this url is redirected from another source
    // TODO @Raghu: Check for any other places that can fall into this case
    history.replace(match.url);
    setTimeout(() => setErrorType('open'), 1000);
  }, [history, match.url]);

  return (
    <RightDrawer
      path="errors/:resourceId"
      width="full"
      onClose={handleClose}
      variant="temporary">

      <DrawerHeader title={`Errors: ${resourceName}`}>
        <ErrorDrawerAction
          flowId={flowId}
          errorType={errorType}
          setErrorType={setErrorType} />
      </DrawerHeader>

      <DrawerContent>
        <ErrorList
          flowId={flowId}
          errorType={errorType} />
      </DrawerContent>
    </RightDrawer>
  );
}
