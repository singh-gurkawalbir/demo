import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from './FilterPanel';

export default function DynaSalesforceLookupFilters(props) {
  const dispatch = useDispatch();
  const {
    id,
    value,
    connectionId,
    data,
    options = {},
    onFieldChange,
    editorId,
  } = props;
  const { disableFetch, commMetaPath } = options;
  const handleEditorInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'salesforceLookupFilter', {
        data,
        autoEvaluate: false,
        rule: value,
      })
    );
  }, [data, dispatch, editorId, value]);

  useEffect(() => {
    if (editorId) {
      handleEditorInit();
    }
    /**
     * TODO: fix dependencies
     * If we add editorId and handleEditorInit as dependencies this is causing re-render infinitely.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filters = useSelector(
    state =>
      selectors.metadataOptionsAndResources({
        state,
        connectionId,
        commMetaPath,
        filterKey: 'salesforce-recordType',
      }).data,
    (left, right) => left.length === right.length
  );

  useEffect(() => {
    if (!filters && !disableFetch && commMetaPath) {
      dispatch(actions.metadata.request(connectionId, commMetaPath));
    }
  }, [dispatch, disableFetch, commMetaPath, connectionId, filters]);

  if (!filters) {
    return null;
  }

  return (
    <FilterPanel
      id={id}
      editorId={editorId}
      rule={value}
      data={data}
      filters={filters}
      onFieldChange={onFieldChange}
    />
  );
}
