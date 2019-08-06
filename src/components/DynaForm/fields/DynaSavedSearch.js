import { FieldWrapper } from 'react-forms-processor/dist';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import RefreshOptionsFactory from './DynaRefreshOptions/RefreshOptionsFactory';
import DynaText from './DynaText';
import * as selectors from '../../../reducers';

function SavedSearch(props) {
  const [searchType, setSearchType] = useState('public');
  const {
    value,
    connectionId,
    mode,
    resourceType,
    defaultValue,
    onFieldChange,
    id,
  } = props;
  const searchTypeOptions = {
    label: 'Saved Search Type',
    name: 'searchType',
    defaultValue: 'public',
    handleChange: evt => {
      setSearchType(evt.target.value);
    },
  };
  const searchInternalIdOptions = {
    label: 'Search Internal ID',
    value,
  };
  const handleChange = evt => {
    // Resets value on change of search type
    onFieldChange(id, '');
    setSearchType(evt.target.value);
  };

  const { options } = useSelector(state =>
    selectors.metadataOptionsAndResources(
      state,
      connectionId,
      mode,
      resourceType
    )
  );

  useEffect(() => {
    if (options) {
      const savedSearch = options.find(option => option.value === defaultValue);

      setSearchType(savedSearch ? 'public' : 'private');
    }
  }, [options, defaultValue, setSearchType]);

  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">Search Type</FormLabel>
        <RadioGroup
          aria-label={searchTypeOptions.label}
          name={searchTypeOptions.name}
          defaultValue={searchTypeOptions.defaultValue}
          value={searchType}
          onChange={handleChange}>
          <FormControlLabel
            value="public"
            control={<Radio />}
            key="public"
            label="Public"
          />
          <FormControlLabel
            value="private"
            control={<Radio />}
            key="private"
            label="Private"
          />
        </RadioGroup>
      </FormControl>

      {searchType === 'public' ? (
        <RefreshOptionsFactory {...props} />
      ) : (
        <DynaText {...searchInternalIdOptions} {...props} />
      )}
    </div>
  );
}

const DynaSavedSearch = props => (
  <FieldWrapper {...props}>
    <SavedSearch />
  </FieldWrapper>
);

export default DynaSavedSearch;
