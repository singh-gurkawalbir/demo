import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import DynaSelect from '../DynaSelect';
import LoadResources from '../../../LoadResources';
import * as selectors from '../../../../reducers';

const FileTypeSelect = props => {
  const { userDefinitionId, onFieldChange, id } = props;
  const { value } = props;
  const [isDefaultValueChanged, setIsDefaultValueChanged] = useState(false);
  // Fetches the selected file definition format by userDefinitionId
  const fileDefinitionFormat = useSelector(state => {
    if (userDefinitionId) {
      const definition = selectors.resource(state, 'filedefinitions', userDefinitionId);
      return definition && definition.format;
    }
  });

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
