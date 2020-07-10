import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../reducers';
import Loader from '../Loader';
import Spinner from '../Spinner';
import SuccessIcon from '../icons/SuccessIcon';


export default function LoadResources({ children, resources, required }) {
  const dispatch = useDispatch();
  const resourceStatus = useSelectorMemo(
    selectors.makeAllResourceStatusSelector,
    resources
  );
  const isAllDataReady = useMemo(
    () =>
      resourceStatus.reduce((acc, resourceStatus) => {
        if (!resourceStatus.isReady) {
          return false;
        }

        return acc;
      }, true),
    [resourceStatus]
  );

  useEffect(() => {
    if (!isAllDataReady) {
      resourceStatus.forEach(resource => {
        if (!resource.hasData) {
          dispatch(actions.resource.requestCollection(resource.resourceType));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAllDataReady]);

  if (isAllDataReady || !required) {
    return children || null;
  }

  return (
    <Loader open >
      {resourceStatus.map(r => (
        <div key={r.resourceType}>
          {r.isLoading ?
            (
              <>
                <Spinner size={16} /><span>{` Loading ${r.resourceType}`}</span>
              </>
            ) :
            (
              <>
                <SuccessIcon /><span>{` Loaded ${r.resourceType}`}</span>
              </>
            )}
        </div>)
      )}
    </Loader>);
}
