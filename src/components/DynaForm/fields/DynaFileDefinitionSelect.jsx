import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelect from './DynaSelect';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import Spinner from '../../Spinner';

export default function DynaFileDefinitionSelect(props) {
  const { format, onFieldChange } = props;
  const dispatch = useDispatch();
  const { data: fileDefinitions = [], status } = useSelector(state =>
    selectors.getSupportedFileDefinitions(state, format)
  );

  function handleFileDefinitionChange(id, value) {
    const definitionSelected = fileDefinitions.find(def => def.value === value);

    // Definition template is saved under template inside a definition
    // { template: { generate: {}, parse: {}}}
    // Based on that we decide whether to make a call
    if (!definitionSelected.template) {
      dispatch(
        actions.fileDefinitions.definition.supported.request(format, value)
      );
    }

    onFieldChange(id, value);
  }

  useEffect(() => {
    // !status indicates no request has been made for fetching file defs
    // Else status will be 'request', 'received' or 'error'

    if (!fileDefinitions.length && !status) {
      dispatch(actions.fileDefinitions.supported.request());
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
