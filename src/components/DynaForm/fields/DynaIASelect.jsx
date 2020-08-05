import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaSelect from './DynaSelect';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';

export default function DynaIASelect(props) {
  const {
    id: fieldName,
    _integrationId,
    autoPostBack,
    multiselect,
    onFieldChange,
  } = props;
  const dispatch = useDispatch();
  const handleFieldChange = useCallback((id, val) => {
    if (autoPostBack) {
      dispatch(
        actions.connectors.refreshMetadata(val, id, _integrationId, {
          key: 'fieldValue',
          autoPostBack: true,
        })
      );
      onFieldChange(id, val);
    } else {
      onFieldChange(id, val);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_integrationId, autoPostBack, dispatch]);
  const { options } = useSelector(state =>
    selectors.connectorFieldOptions(
      state,
      fieldName,
      null,
      _integrationId
    )
  );
  const IASelect = multiselect ? DynaMultiSelect : DynaSelect;

  return options?.length
    ? (
      <IASelect
        {...props}
        options={[{items: options}]}
        onFieldChange={handleFieldChange} />
    )
    : <IASelect {...props} />;
}
