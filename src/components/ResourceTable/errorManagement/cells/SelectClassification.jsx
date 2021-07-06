import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import actions from '../../../../actions';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

export default function SelectClassification({ flowId, resourceId, isResolved }) {
  const dispatch = useDispatch();
  const classificationOptions = useSelector(state => selectors.classificationOptions(state));

  const handleSave = useCallback(
    () => {
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          isResolved,
        })
      );
    },
    [dispatch, flowId, isResolved, resourceId],
  );
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  return (
    useMemo(() => (
      <MultiSelectColumnFilter
        filterKey={filterKey}
        helpKey="classification"
        title="Classification"
        filterBy="classifications"
        handleSave={handleSave}
        options={classificationOptions} />
    ),
    [filterKey, handleSave, classificationOptions])
  );
}
