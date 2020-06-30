import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import * as selectors from '../../../reducers';
import { isNewId } from '../../../utils/resource';
import DynaNSSavedSearchInternalID from './DynaNSSavedSearchInternalID';
import FieldHelp from '../FieldHelp';

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
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
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
}));

export default function DynaNSSavedSearch(props) {
  const classes = useStyles();
  const [searchType, setSearchType] = useState('public');
  // Use this state to set Search type for the first time
  const [isSearchTypeSet, setIsSearchTypeSet] = useState(false);
  const [savedSearchUrl, setSavedSearchUrl] = useState();
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

  useEffect(() => {
    if (value && netSuiteSystemDomain) {
      setSavedSearchUrl(
        `${netSuiteSystemDomain}/app/common/search/search.nl?id=${value}`
      );
    } else {
      setSavedSearchUrl();
    }
  }, [value, netSuiteSystemDomain]);

  return (
    <>
      <div>
        <FormControl
          required={required}
          disabled={disabled}
          className={classes.nsSavedSearch}
          component="fieldset">
          <div className={classes.radioGroupWrapper}>
            <FormLabel component="legend" className={classes.radioGroupLabel}>
              Saved search type:
            </FormLabel>
            <div className={classes.radioGroupWrapper}>
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
              <FieldHelp {...props} />
            </div>
          </div>
        </FormControl>
      </div>
      <FormControl component="fieldset" className={classes.dynaNsSearched}>
        {searchType === 'public' ? (
          <div className={classes.dynaNsInternalID}>
            <DynaRefreshableSelect
              {...searchIdOptions}
              {...props}
              urlToOpen={savedSearchUrl}
              className={classes.dynaNsInternalID}
            />
          </div>
        ) : (
          <div className={classes.dynaNsInternalID}>
            <DynaNSSavedSearchInternalID
              {...searchInternalIdOptions}
              {...props}
              urlToOpen={savedSearchUrl}
              className={classes.dynaNsInternalID}
            />
          </div>
        )}
      </FormControl>
    </>
  );
}
