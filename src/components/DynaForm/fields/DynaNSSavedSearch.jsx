import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import { selectors } from '../../../reducers';
import { isNewId } from '../../../utils/resource';
import DynaNSSavedSearchInternalID from './DynaNSSavedSearchInternalID';
import FieldHelp from '../FieldHelp';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import isLoggableAttr from '../../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  nsSavedSearch: {
    marginBottom: 12,
  },
  dynaNsInternalID: {
    width: '100%',
  },
  dynaNsSearched: {
    paddingLeft: theme.spacing(1),
    width: '100%',
    borderLeft: `3px solid ${theme.palette.secondary.lightest}`,
  },
  radioGroupWrapper: {
    display: 'flex',
    alignItems: 'center',
  },

  radioGroup: {
    '& label': {
      marginLeft: 0,
      fontSize: 14,
      marginRight: theme.spacing(3),
    },
  },
  radioGroupLabel: {
    marginBottom: 0,
    marginRight: 12,
    fontSize: 14,
    '&:last-child': {
      marginRight: theme.spacing(0.5),
    },
    '&.Mui-focused': {
      color: 'inherit',
    },
  },
  labelSpace: {
    marginRight: 0,
  },
}));

export default function DynaNSSavedSearch(props) {
  const classes = useStyles();
  const [searchType, setSearchType] = useState('public');
  // Use this state to set Search type for the first time
  const [isSearchTypeSet, setIsSearchTypeSet] = useState(false);
  const [resetSearchIdValue, setResetSearchIdValue] = useState(false);
  const {
    value,
    connectionId,
    resourceId,
    defaultValue,
    onFieldChange,
    id,
    required,
    disabled,
    commMetaPath,
    isLoggable,
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
    const newValue = evt.target.value;

    if (newValue === 'public') setResetSearchIdValue(true);
    else setResetSearchIdValue(false);

    setSearchType(newValue);
  };

  const { data } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath);

  const netSuiteSystemDomain = useSelector(state => {
    const connection = selectors.resource(state, 'connections', connectionId);

    return (
      connection &&
      connection.netsuite &&
      connection.netsuite.dataCenterURLs &&
      connection.netsuite.dataCenterURLs.systemDomain
    );
  });

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
  const savedSearchUrl = value && netSuiteSystemDomain ? `${netSuiteSystemDomain}/app/common/search/search.nl?id=${value}` : null;

  return (
    <>
      <div>
        <FormControl
          variant="standard"
          required={required}
          disabled={disabled}
          className={classes.nsSavedSearch}
          component="fieldset">
          <div className={classes.radioGroupWrapper}>
            <FormLabel component="legend" className={classes.radioGroupLabel}>
              Saved search type:
            </FormLabel>
            {/* can be loggable in all circumstances? */}
            <div className={classes.radioGroupWrapper} {...isLoggableAttr(isLoggable)}>
              <RadioGroup
                name="searchType"
                defaultValue="public"
                value={searchType}
                data-test="netsuite.restlet.searchType"
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
                  className={classes.labelSpace}
              />
              </RadioGroup>
              <FieldHelp {...props} helpKey="export.netsuite.restlet.searchType" label="Saved search type" />
            </div>
          </div>
        </FormControl>
      </div>
      <FormControl
        variant="standard"
        component="fieldset"
        className={classes.dynaNsSearched}>
        {searchType === 'public' ? (
          <div className={classes.dynaNsInternalID}>
            <DynaRefreshableSelect
              {...searchIdOptions}
              {...props}
              ignoreValueUnset
              resetValue={resetSearchIdValue}
              urlToOpen={savedSearchUrl}
              className={classes.dynaNsInternalID}
              helpKey="export.netsuite.restlet.searchId"
          />
          </div>
        ) : (
          <div className={classes.dynaNsInternalID}>
            <DynaNSSavedSearchInternalID
              {...searchInternalIdOptions}
              {...props}
              urlToOpen={savedSearchUrl}
              className={classes.dynaNsInternalID}
              helpKey="export.netsuite.restlet.searchInternalId"
          />
          </div>
        )}
      </FormControl>
    </>
  );
}
