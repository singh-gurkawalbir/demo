import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import DynaText from './DynaText';
import * as selectors from '../../../reducers';
import { isNewId } from '../../../utils/resource';

export default function DynaNSSavedSearch(props) {
  const [searchType, setSearchType] = useState('public');
  // Use this state to set Search type for the first time
  const [isSearchTypeSet, setIsSearchTypeSet] = useState(false);
  const {
    value,
    connectionId,
    resourceId,
    defaultValue,
    onFieldChange,
    id,
    isValid,
    required,
    disabled,
    commMetaPath,
  } = props;
  const searchIdOptions = {
    placeholder: 'Please select a saved search',
    label: 'Saved searches',
  };
  const searchInternalIdOptions = {
    label: 'Search internal ID',
    value,
  };
  const handleChange = evt => {
    // Resets value on change of search type
    onFieldChange(id, '');
    setSearchType(evt.target.value);
  };

  const { data } = useSelector(state =>
    selectors.metadataOptionsAndResources({ state, connectionId, commMetaPath })
  );

  useEffect(() => {
    // check for isSearchTypeSet to avoid changing search types on refresh
    // If editing an export, show public types if searchTypeId matches any in the list
    // Else show private type
    if (!isNewId(resourceId) && data && !isSearchTypeSet) {
      const savedSearch = data.find(option => option.value === defaultValue);

      setSearchType(savedSearch ? 'public' : 'private');
      setIsSearchTypeSet(true);
    }
  }, [data, defaultValue, isSearchTypeSet, resourceId, setSearchType]);

  return (
    <div>
      <FormControl
        error={!isValid}
        required={required}
        disabled={disabled}
        component="fieldset">
        <FormLabel component="legend">Saved search type</FormLabel>
        <RadioGroup
          name="searchType"
          defaultValue="public"
          value={searchType}
          data-test={id}
          onChange={handleChange}>
          <FormControlLabel
            value="public"
            control={<Radio color="primary" />}
            label="Public"
          />
          <FormControlLabel
            value="private"
            control={<Radio color="primary" />}
            label="Private"
          />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset">
        {searchType === 'public' ? (
          <DynaRefreshableSelect {...searchIdOptions} {...props} />
        ) : (
          <DynaText {...searchInternalIdOptions} {...props} />
        )}
      </FormControl>
    </div>
  );
}
