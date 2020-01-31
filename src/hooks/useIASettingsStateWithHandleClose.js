import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../actions';
import * as selectors from '../reducers';

const useIASettingsStateWithHandleClose = (
  integrationId,
  flowId,
  sectionId,
  parentUrl
) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const formState = useSelector(
    state =>
      selectors.integrationAppSettingsFormState(
        state,
        integrationId,
        flowId,
        sectionId
      ),
    shallowEqual
  );
  const IASettingsHandleClose = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.clear(integrationId, flowId, sectionId)
    );
    history.push(parentUrl);
  }, [dispatch, flowId, history, integrationId, parentUrl, sectionId]);

  return {
    handleClose: IASettingsHandleClose,
    formState,
  };
};

export default useIASettingsStateWithHandleClose;
