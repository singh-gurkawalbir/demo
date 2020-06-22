import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../actions';
import * as selectors from '../reducers';

const useSuiteScriptIAFormWithHandleClose = (
  integrationId, ssLinkedConnectionId,
  parentUrl
) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const formState = useSelector(
    state =>
      selectors.suiteScriptIAFormState(
        state,
        {integrationId, ssLinkedConnectionId}
      ),
    shallowEqual
  );

  const IASettingsHandleClose = useCallback(() => {
    dispatch(
      actions.suiteScript.iaForm.initClear(ssLinkedConnectionId, integrationId)
    );
    history.push(parentUrl);
  }, [dispatch, history, integrationId, parentUrl, ssLinkedConnectionId]);

  return {
    handleClose: IASettingsHandleClose,
    formState,
  };
};

export default useSuiteScriptIAFormWithHandleClose;
