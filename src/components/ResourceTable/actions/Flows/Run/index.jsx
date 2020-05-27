import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import actions from '../../../../../actions';
import RunIcon from '../../../../icons/RunIcon';

export default {
  label: 'Run flow',
  icon: RunIcon,
  component: withRouter(({ rowData = {}, history }) => {
    const { _integrationId: integrationId, _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const runFlow = useCallback(() => {
      dispatch(actions.flow.run({ flowId: resourceId }));
      history.push(getRoutePath(`integrations/${integrationId}/dashboard`));
    }, [dispatch, history, integrationId, resourceId]);

    useEffect(() => {
      runFlow();
    }, [runFlow]);

    return null;
  }),
};
