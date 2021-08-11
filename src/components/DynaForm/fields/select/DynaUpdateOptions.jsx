
import React, { useEffect, useMemo } from 'react';

import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';

import DynaSelect from '../DynaSelect';

export default function DynaUpdateOptions(props) {
  const { optionsMap, onFieldChange, id, listeningFieldId, formKey} = props;

  const listenerFieldValue = useSelector(state => selectors.fieldState(state, formKey, listeningFieldId)?.value);
  const finalOptions = useMemo(() => [{items: optionsMap?.[listenerFieldValue] || [{}]}], [listenerFieldValue, optionsMap]);

  useEffect(() => {
    // reset it when listenerFieldValue changes
    onFieldChange(id, '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listenerFieldValue]);

  return <DynaSelect {...props} options={finalOptions} />;
}
