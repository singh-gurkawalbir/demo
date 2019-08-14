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

export default function DynaNSSavedSearch(props) {
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
        <FormLabel component="legend">Saved search type</FormLabel>
        <RadioGroup
          name="searchType"
          defaultValue="public"
          value={searchType}
          onChange={handleChange}>
          <FormControlLabel value="public" control={<Radio />} label="Public" />
          <FormControlLabel
            value="private"
            control={<Radio />}
            label="Private"
          />
        </RadioGroup>
      </FormControl>

      {searchType === 'public' ? (
        <RefreshOptionsFactory {...searchIdOptions} {...props} />
      ) : (
        <DynaText {...searchInternalIdOptions} {...props} />
      )}
    </div>
  );
}
