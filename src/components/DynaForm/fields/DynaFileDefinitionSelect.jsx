import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelect from './DynaSelect';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import Spinner from '../../Spinner';
import { isNewId } from '../../../utils/resource';

export default function DynaFileDefinitionSelect(props) {
  const { format, onFieldChange, resourceId } = props;
  const dispatch = useDispatch();
  // Get File definitions based on the file type format
  // Formats: edix12, fixed or edifact
  const { data: fileDefinitions = [], status } = useSelector(state =>
    selectors.getPreBuiltFileDefinitions(state, format)
  );

  /*
   * Definition template is saved under template inside a definition
   * { template: { generate: {}, parse: {}}}
   * Based on that we decide whether to make a call
   */
  function handleFileDefinitionChange(id, value) {
    const definitionSelected = fileDefinitions.find(def => def.value === value);

    if (!definitionSelected.template) {
      dispatch(
        actions.fileDefinitions.definition.preBuilt.request(format, value)
      );
    }

    onFieldChange(id, value);
  }

  useEffect(() => {
    // !status indicates no request has been made for fetching file defs
    // Else status will be 'request', 'received' or 'error'

    if (isNewId(resourceId) && !fileDefinitions.length && !status) {
      dispatch(actions.fileDefinitions.preBuilt.request());
    }
  }, [dispatch, fileDefinitions, resourceId, status]);

  // Incase of Editing an export, this field is not shown
  if (!isNewId(resourceId)) {
    return null;
  }

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
