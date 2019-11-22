import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isString } from 'lodash';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from './FilterPanel';

export default function DynaNetSuiteLookupFilters(props) {
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
  let rule = [];

  if (isString(value)) {
    try {
      rule = JSON.parse(value);
    } catch (ex) {
      // nothing
    }
  } else {
    rule = value;
  }

  const handleEditorInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'netsuiteLookupFilter', {
        data,
        autoEvaluate: false,
        rule,
      })
    );
  }, [data, dispatch, editorId, rule]);

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
      rule={rule}
      data={data}
      filters={filters}
      onFieldChange={onFieldChange}
    />
  );
}
