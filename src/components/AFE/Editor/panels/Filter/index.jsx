import React from 'react';
import { useSelector } from 'react-redux';
import FilterPanel from './FilterPanel';
import { selectors } from '../../../../../reducers';
import Spinner from '../../../../Spinner';

export default function FilterPanelWrapper({editorId}) {
  const sampleDataStatus = useSelector(state => selectors.editor(state, editorId).sampleDataStatus);
  const rule = useSelector(state => selectors.editorRule(state, editorId));

  // we dont want the filter UI to render and calculate paths until the sample data has been loaded
  // this avoids any discrepancy b/w data and rule structure
  return (
    <>
      {sampleDataStatus === 'requested' ? (
        <Spinner centerAll />
      ) : (
        <FilterPanel
          editorId={editorId}
          key={rule} // to force remount when rules change as querybuilder is not being updated in render phase
        />
      )}
    </>
  );
}
