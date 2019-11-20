import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from './FilterPanel';

export default function DynaNSFilters(props) {
  const dispatch = useDispatch();
  const { connectionId, options = {} } = props;
  const data = useSelector(
    state =>
      selectors.metadataOptionsAndResources({
        state,
        connectionId,
        commMetaPath: options.commMetaPath,
      }).data,
    (left, right) => left.length === right.length
  );

  useEffect(() => {
    if (!data && !options.disableFetch) {
      dispatch(actions.metadata.request(connectionId, options.commMetaPath));
    }
  }, [
    dispatch,
    options.disableFetch,
    options.commMetaPath,
    connectionId,
    data,
  ]);

  if (!data) {
    return null;
  }

  return (
    <Fragment>
      {/* Testing {JSON.stringify(props)} {JSON.stringify(data)} */}
      {`Rendered @ ${new Date().toISOString()}`}
      <FilterPanel data={data} />
    </Fragment>
  );
}
