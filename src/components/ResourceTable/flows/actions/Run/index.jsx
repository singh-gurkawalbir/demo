import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import actions from '../../../../../actions';
import RunIcon from '../../../../icons/RunIcon';

export default {
  key: 'runFlow',
  useLabel: () => 'Run flow',
  icon: RunIcon,
  useOnClick: rowData => {
    const { _integrationId: integrationId, _id: resourceId } = rowData;
    const history = useHistory();
    const dispatch = useDispatch();
    const runFlow = useCallback(() => {
      dispatch(actions.flow.run({ flowId: resourceId }));
      history.push(getRoutePath(`integrations/${integrationId}/dashboard`));
    }, [dispatch, history, integrationId, resourceId]);

    return runFlow;
  },
};
