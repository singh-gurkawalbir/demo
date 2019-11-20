import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from './FilterPanel';

export default function DynaNSFilters(props) {
  const dispatch = useDispatch();
  const { connectionId, extractFields, options = {} } = props;
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
      {`props ${JSON.stringify(props)}`}
      {`Rendered @ ${new Date().toISOString()}`}
      <FilterPanel filters={filters} data={extractFields} />
    </Fragment>
  );
}
