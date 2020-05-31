import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import FlowCard from '../../../../common/FlowCard';
import MappingDrawer from '../../../../common/FlowCard/MappingDrawer';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import LoadResources from '../../../../../../components/LoadResources';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: '12px',
  },
  divider: {
    width: 1,
    height: 30,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 5,
  },
}));
const flowsFilterConfig = { type: 'flows' };

export default function FlowsPanel({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const allFlows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const flows = useMemo(
    () => allFlows && allFlows.filter(f => f._integrationId === integrationId),
    [allFlows, integrationId]
  );
  const { status, data: integrationErrorsMap = {} } = useSelector(state =>
    selectors.errorMap(state, integrationId)
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isUserInErrMgtTwoDotZero(state)
  );

  useEffect(() => {
    if (!status && isUserInErrMgtTwoDotZero) {
      dispatch(
        actions.errorManager.integrationErrors.request({ integrationId })
      );
    }
  }, [dispatch, integrationId, isUserInErrMgtTwoDotZero, status]);

  return (
    <div className={classes.root}>
      <MappingDrawer integrationId={integrationId} />

      <LoadResources required resources="flows,exports">
        {flows.map(f => (
          <FlowCard
            key={f._id}
            flowId={f._id}
            excludeActions={['schedule']}
            errorCount={integrationErrorsMap[f._id] || 0}
          />
        ))}
      </LoadResources>
    </div>
  );
}
