import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers';
import actions from '../../../actions';

export default function DynaFileDefinitionSelect(props) {
  const { format, onFieldChange } = props;
  const dispatch = useDispatch();
  // Get File definitions based on the file type format
  // Formats: edix12, fixed or edifact
  const { data: fileDefinitions = [], status } = useSelector(state =>
    selectors.preBuiltFileDefinitions(state, format),
  shallowEqual);

  /*
   * Definition template is saved under template inside a definition
   * { template: { generate: {}, parse: {}}}
   * Based on that we decide whether to make a call
   */
  function handleFileDefinitionChange(id, value) {
    const definitionSelected = fileDefinitions.find(def => def.value === value);

    if (definitionSelected && !definitionSelected.template) {
      dispatch(
        actions.fileDefinitions.definition.preBuilt.request(format, value)
      );
    }

    onFieldChange(id, value);
  }

  useEffect(() => {
    // !status indicates no request has been made for fetching file defs
    // Else status will be 'request', 'received' or 'error'

    if (!fileDefinitions.length && !status) {
      dispatch(actions.fileDefinitions.preBuilt.request());
    }
  }, [dispatch, fileDefinitions, status]);

  if (status === 'requested') {
    return <Spinner />;
  }

  return (
    <DynaSelect
      {...props}
      onFieldChange={handleFileDefinitionChange}
      options={[{ items: [...fileDefinitions] }]}
    />
  );
}
