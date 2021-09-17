import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import DynaSelect from '../DynaSelect';
import LoadResources from '../../../LoadResources';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

const FileTypeSelect = props => {
  const { userDefinitionId, onFieldChange, id, formKey } = props;
  const dispatch = useDispatch();
  const { value } = props;
  const [isDefaultValueChanged, setIsDefaultValueChanged] = useState(false);
  // Fetches the selected file definition format by userDefinitionId
  const fileDefinitionFormat = useSelector(state => {
    if (userDefinitionId) {
      const definition = selectors.resource(state, 'filedefinitions', userDefinitionId);

      return definition && definition.format;
    }
  });
  const fileFormValues = useSelector(state => {
    const formValues = selectors.formState(state, formKey)?.value;
    const fileType = formValues['/file/type'];
    let filePropValues;

    if (fileType === 'csv') {
      filePropValues = JSON.stringify(formValues['/file/csv']);
    } else if (fileType === 'json') {
      filePropValues = JSON.stringify(formValues['/file/json/resourcePath']);
    } else if (fileType === 'xlsx') {
      filePropValues = formValues['/file/xlsx/hasHeaderRow'];
    } else if (fileType === 'xml') {
      filePropValues = JSON.stringify(formValues['/parsers']);
    }
    filePropValues = `${filePropValues}${formValues['/file/groupByFields']}`;

    return filePropValues;
  });

  useEffect(() => {
    if (!isEmpty(fileFormValues)) {
      dispatch(actions.resourceFormSampleData.request(formKey));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileFormValues]);

  // Add logic to decide default value inside useEffect, so as to execute only on launch of ftp form
  useEffect(() => {
    // Incase of file definitions, format is determined by user file definition
    if (
      value === 'filedefinition' &&
      fileDefinitionFormat &&
      !isDefaultValueChanged
    ) {
      // Incase of EDI X12 format, format value is 'delimited/x12'/'delimited' but Dropdown option has file type (BE Expected) value 'filedefinition'
      // For other formats , 'format' in userFileDefinition and file type value is the same
      const newValue = ['delimited/x12', 'delimited'].includes(fileDefinitionFormat)
        ? 'filedefinition'
        : fileDefinitionFormat;

      onFieldChange(id, newValue, true);
      setIsDefaultValueChanged(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isDefaultValueChanged, fileDefinitionFormat, value]);

  return <DynaSelect {...props} />;
};

export default function DynaFileTypeSelect(props) {
  return (
    <LoadResources resources="filedefinitions">
      <FileTypeSelect {...props} />
    </LoadResources>
  );
}
