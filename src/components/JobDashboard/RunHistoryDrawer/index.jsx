import React, { useCallback, useEffect } from 'react';
import { useRouteMatch, useHistory, matchPath, useLocation } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../reducers';
import LoadResources from '../../LoadResources';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../utils/constants';
import RunHistory from '../RunHistory';
import {FILTER_KEYS_AD, DEFAULT_RANGE} from '../../../utils/accountDashboard';
import {FILTER_KEYS} from '../../../utils/errorManagement';
import actions from '../../../actions';

export default function RunHistoryDrawer() {
  const match = useRouteMatch();
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
  const filter = useSelector(state =>
    selectors.filter(state, FILTER_KEYS_AD.COMPLETED),
  shallowEqual
  );
  let selectedDate;

  if (filter?.range) {
    selectedDate = {
      startDate: new Date(filter.range.startDate),
      endDate: new Date(filter.range.endDate),
      preset: filter.range.preset,
    };
  } else {
    selectedDate = DEFAULT_RANGE;
  }

  useEffect(() => {
    dispatch(
      actions.patchFilter(FILTER_KEYS.RUN_HISTORY, {
        ...filter,
        range: selectedDate,
      })
    );
  }, [dispatch, filter, selectedDate]);

  return (
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        path=":flowId/runHistory"
        height="tall"
        width="full"
        variant="permanent"
        onClose={handleClose}
        >

        <DrawerHeader title={`Run History: ${flow.name || flowId}`} />

        <DrawerContent>
          <RunHistory flowId={flowId} />
        </DrawerContent>
      </RightDrawer>
    </LoadResources>
  );
}
