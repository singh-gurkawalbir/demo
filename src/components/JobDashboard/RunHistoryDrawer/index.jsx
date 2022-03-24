import React, { useCallback, useEffect, useMemo } from 'react';
import { useRouteMatch, useHistory, matchPath, useLocation } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../utils/constants';
import RunHistory from '../RunHistory';
import {FILTER_KEYS_AD, getDashboardIntegrationId} from '../../../utils/accountDashboard';
import {FILTER_KEYS} from '../../../utils/errorManagement';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  runHistoryDrawer: {
    padding: theme.spacing(0, 3, 3),
  },
  runHistoryPage: {
    '& > div:first-child': {
      borderTop: 'none',
      padding: theme.spacing(3, 0, 3),
      '& > div': {
        padding: 0,
        margin: 0,
        alignItems: 'center',
      },
    },
    '& table': {
      border: `1px solid ${theme.palette.secondary.lightest}`,
    },

  },
}));

export default function RunHistoryDrawer() {
  const match = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { params: { flowId } = {} } = matchPath(location.pathname, {path: `${match.path}/:flowId/runHistory`}) || {};
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || emptyObject;
  const handleClose = useCallback(() => {
    history.push(match.url);
  }, [match.url, history]);
  let { integrationId } = match.params;
  const { childId } = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

  integrationId = getDashboardIntegrationId(integrationId, childId, isIntegrationAppV1);
  const filter = useSelector(state =>
    selectors.filter(state, `${integrationId || ''}${FILTER_KEYS_AD.COMPLETED}`),
  shallowEqual
  );

  const selectedDate = useMemo(() => (
    {
      preset: filter.range ? filter.range.preset : 'last24hours',
      startDate: filter.range ? new Date(filter.range.startDate) : startOfDay(addDays(new Date(), -29)),
      endDate: filter.range ? new Date(filter.range.endDate) : endOfDay(new Date()),
    }), [filter.range]);

  useEffect(() => {
    dispatch(
      actions.patchFilter(FILTER_KEYS.RUN_HISTORY, {
        range: selectedDate,
      })
    );
  }, [dispatch, selectedDate, flowId]);
  useEffect(() =>
    () => {
      dispatch(actions.clearFilter(FILTER_KEYS.RUN_HISTORY));
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <RightDrawer
      path=":flowId/runHistory"
      height="tall"
      width="full"
      onClose={handleClose}
        >
      <DrawerHeader title={`Run History: ${flow.name || flowId}`} />
      <DrawerContent className={classes.runHistoryDrawer}>
        <RunHistory
          flowId={flowId} className={classes.runHistoryPage}
            />
      </DrawerContent>
    </RightDrawer>
  );
}
