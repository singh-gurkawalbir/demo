
import React, { useEffect, useMemo } from 'react';

import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import DynaMultiSelect from '../DynaMultiSelect';

export default function DynaUpdateOptions(props) {
  const { optionsMap, onFieldChange, id, listeningFieldId, formKey} = props;

  const listenerFieldValue = useSelector(state => selectors.fieldState(state, formKey, listeningFieldId)?.value);
  const finalOptions = useMemo(() => [{items: optionsMap?.[listenerFieldValue] || [{}]}], [listenerFieldValue, optionsMap]);

  useEffect(() => {
    // reset it when listenerFieldValue changes
    onFieldChange(id, '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listenerFieldValue]);

  return <DynaMultiSelect {...props} options={finalOptions} />;
}
