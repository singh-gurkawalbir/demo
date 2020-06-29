import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';

const useSuiteScriptIAFormWithHandleClose = (
  integrationId, ssLinkedConnectionId,
) => {
  const dispatch = useDispatch();
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
  }, [dispatch, integrationId, ssLinkedConnectionId]);

  return {
    handleClose: IASettingsHandleClose,
    formState,
  };
};

export default useSuiteScriptIAFormWithHandleClose;
