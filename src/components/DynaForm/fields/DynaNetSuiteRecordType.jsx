/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import { SCOPES } from '../../../sagas/resourceForm';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

export default function DynaNetSuiteRecordType(props) {
  const { resourceId, value } = props;
  const dispatch = useDispatch();
  const hasNetsuiteDa = !!(useSelectorMemo(
    selectors.makeResourceDataSelector,
    'imports',
    resourceId
  )?.merged?.netsuite_da);

  // remove the subrecords patch when record type is changed
  useEffect(() => {
    if (!hasNetsuiteDa) return;

    dispatch(
      actions.resource.patchStaged(resourceId, [
        {
          op: 'remove',
          path: '/netsuite_da/subrecords',
        },
      ], SCOPES.VALUE)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, resourceId, value]);

  return (
    <DynaRefreshableSelect {...props} />
  );
}
