import React, { useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import FilterIcon from '../../../icons/FilterIcon';
// import actions from '../../../../actions';
// import { selectors } from '../../../../reducers';
// import ActionButton from '../../../ActionButton';
// import MultiSelectFilter from '../../../MultiSelectFilter';
import SourceFilter from '../SourceFilter';

// eslint-disable-next-line no-empty-pattern
export default function SelectAllErrors({
  // flowId,
  // resourceId,
  // isResolved,
  // filterKey,
  // defaultFilter,
  // actionInProgress,
}) {
  // const dispatch = useDispatch();
  const handleSave = useCallback(
    () => {
      // console.log(sourceIds);
    },
    [],
  );

  return (
    <div> Source
      <SourceFilter onSave={handleSave} />
    </div>
  );
}
