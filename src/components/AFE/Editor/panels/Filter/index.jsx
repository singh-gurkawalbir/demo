import React from 'react';
import { useSelector } from 'react-redux';
import FilterPanel from './FilterPanel';
import { selectors } from '../../../../../reducers';
import Spinner from '../../../../Spinner';

export default function FilterPanelWrapper({editorId}) {
  const sampleDataStatus = useSelector(state => selectors.editor(state, editorId).sampleDataStatus);

  // we dont want the filter UI to render and calculate paths until the sample data has been loaded
  // this avoids any discrepancy b/w data and rule structure
  return (
    <>
      {sampleDataStatus === 'requested' ? (
        <Spinner centerAll />
      ) : (
        <FilterPanel
          editorId={editorId}
        />
      )}
    </>
  );
}
