import { useSelector } from 'react-redux';
import React, { useState, useCallback } from 'react';
import * as selectors from '../../../reducers';
import DynaCheckbox from './checkbox/DynaCheckbox';

export default function DynaSkipRetries(props) {
  let pageGenerator;
  const { flowId, resourceId, onFieldChange } = props;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));

  if (flow && flow.pageGenerators && flow.pageGenerators.length) {
    pageGenerator = flow.pageGenerators.find(pg => pg._exportId === resourceId);
  }

  const [value, setValue] = useState(
    !!(pageGenerator && pageGenerator.skipRetries)
  );
  const handleValueChange = useCallback(
    (id, value) => {
      setValue(value);
      onFieldChange(id, value);
    },
    [onFieldChange]
  );

  if (!flowId) {
    return null;
  }

  return (
    <DynaCheckbox {...props} value={value} onFieldChange={handleValueChange} />
  );
}
