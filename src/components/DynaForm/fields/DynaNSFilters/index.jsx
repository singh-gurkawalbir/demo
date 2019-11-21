import { Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isString } from 'lodash';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from './FilterPanel';

export default function DynaNSFilters(props) {
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
      actions.editor.init(editorId, 'netsuiteLookup', {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filters = useSelector(
    state =>
      selectors.metadataOptionsAndResources({
        state,
        connectionId,
        commMetaPath: options.commMetaPath,
      }).data,
    (left, right) => left.length === right.length
  );

  useEffect(() => {
    if (!filters && !options.disableFetch) {
      dispatch(actions.metadata.request(connectionId, options.commMetaPath));
    }
  }, [
    dispatch,
    options.disableFetch,
    options.commMetaPath,
    connectionId,
    filters,
  ]);

  if (!filters) {
    return null;
  }

  return (
    <Fragment>
      {/* {`props ${JSON.stringify(props)}`} */}
      <FilterPanel
        editorId={editorId}
        filters={filters}
        data={data}
        id={id}
        onFieldChange={onFieldChange}
        rule={rule}
      />
    </Fragment>
  );
}
