import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import ExpandWindowIcon from '../../../../icons/ExpandWindowIcon';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import Spinner from '../../../../Spinner';

export default function ReviewHeaderActions({ numConflicts, integrationId, revId }) {
  const dispatch = useDispatch();
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));

  const handleRefresh = () => {
    dispatch(actions.integrationLCM.compare.revertRequest(integrationId, revId));
  };

  const handleToggleExpand = () => {
    dispatch(actions.integrationLCM.compare.toggleExpandAll(integrationId));
  };

  return (
    <>
      <div> {numConflicts} conflicts</div>
      {
          isResourceComparisonInProgress
            ? <Spinner />
            : <RefreshIcon onClick={handleRefresh} />
      }
      <ExpandWindowIcon onClick={handleToggleExpand} />
      {isDiffExpanded ? 'Collapse' : 'Expand'} all
    </>
  );
}
