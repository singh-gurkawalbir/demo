import { deepClone } from 'fast-json-patch/lib/core';
import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import getJSONPaths, { pickFirstObject } from '../../../../utils/jsonPaths';
import * as selectors from '../../../../reducers';
import DynaManageLookup from '../DynaManageLookup';
import lookupUtil from '../../../../utils/lookup';

const prefixRegexp = '.*{{((?!(}|{)).)*$';
const getMatchingText = (value, cursorPosition) => {
  const inpValue = value.substring(0, cursorPosition);
  const startIndexOfBraces = inpValue.lastIndexOf('{{');
  const matchedString = inpValue.substring(startIndexOfBraces + 2);

  return matchedString;
};

const useStyles = makeStyles(theme => ({
  suggestions: {
    width: '100%',
    marginLeft: 0,
    listStyleType: 'none',
    paddingLeft: 0,
    marginTop: theme.spacing(1),
    maxHeight: 200,
    overflow: 'auto',
    paddingInlineStart: theme.spacing(1),
    '& li': {
      height: 40,
      display: 'flex',
      padding: 4,
    },
  },
}));
const ExtractItem = props => {
  const { onSelect, value, label } = props;
  const handleItemSelect = useCallback(() => {
    onSelect(value);
  }, [onSelect, value]);

  return <Button onClick={handleItemSelect}>{label}</Button>;
};

const getValueAfterInsert = (value, cursorPosition, insertedVal) =>
  `${value.substring(0, cursorPosition)}${insertedVal}}}${value.substring(
    cursorPosition
  )}`;

export default function Suggestions(props) {
  const {
    id,
    flowId,
    resourceId,
    connectionId,
    formContext,
    resourceType,
    showLookup,
    value = '',
    showExtract,
    cursorPosition,
    onValueUpdate,
    onFieldChange,
    options,
  } = props;
  const classes = useStyles();
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    })
  );
  const adaptorType = useSelector(state => {
    const { merged: resourceData = {} } = selectors.resourceData(
      state,
      'imports',
      resourceId
    );

    return resourceData && resourceData.adaptorType;
  });
  const lookups = lookupUtil.getLookupFromFormContext(formContext, adaptorType);
  const extracts = useMemo(() => {
    const extractPaths = getJSONPaths(pickFirstObject(sampleData));

    return (
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      []
    );
  }, [sampleData]);
  const matchingText = useMemo(() => getMatchingText(value, cursorPosition), [
    cursorPosition,
    value,
  ]);
  const filteredLookup = useMemo(
    () =>
      lookups.filter(
        l => l.name.toLowerCase().indexOf(matchingText.toLowerCase()) > -1
      ),
    [lookups, matchingText]
  );
  const filteredExtracts = useMemo(
    () =>
      extracts
        .map(field => ({
          label: field.name,
          value: field.id.indexOf(' ') > -1 ? `[${field.id}]` : field.id,
        }))
        .filter(
          e => e.label.toLowerCase().indexOf(matchingText.toLowerCase()) > -1
        ),
    [extracts, matchingText]
  );
  const handleExtractSelect = useCallback(
    _val => {
      const newValue = getValueAfterInsert(value, cursorPosition, _val);

      onValueUpdate(newValue);
    },
    [cursorPosition, onValueUpdate, value]
  );
  const handleLookupSelect = useCallback(
    lookup => {
      const valueToInsert =
        adaptorType === 'HTTPImport'
          ? `lookup "${lookup.name}" this`
          : lookup.name;
      // update text field with selected lookup
      const newValue = getValueAfterInsert(
        value,
        cursorPosition,
        valueToInsert
      );

      onValueUpdate(newValue);
    },
    [adaptorType, cursorPosition, onValueUpdate, value]
  );
  const handleLookupAdd = useCallback(
    lookup => {
      handleLookupSelect(lookup);
      // update lookup in resouce doc
      const modifiedLookup = deepClone(lookups);

      modifiedLookup.push(lookup);
      const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

      onFieldChange(lookupFieldId, modifiedLookup);
    },
    [adaptorType, handleLookupSelect, lookups, onFieldChange]
  );
  const handleLookupEdit = useCallback(
    (lookup = {}) => {
      const lookupIndex = lookups.findIndex(item => item.name === lookup.name);

      if (lookupIndex !== -1) {
        return;
      }

      const modifiedLookups = [...lookups];

      modifiedLookups.splice(lookupIndex, 1);
      modifiedLookups.splice(lookupIndex, 0, lookup);
      const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

      onFieldChange(lookupFieldId, modifiedLookups);
    },
    [adaptorType, lookups, onFieldChange]
  );
  const showSuggestion = !!value
    .substring(0, cursorPosition)
    .match(prefixRegexp);

  if (!showSuggestion) return null;

  return (
    <ul className={classes.suggestions}>
      {showLookup && (
        <DynaManageLookup
          id="add-lookup"
          label="New Lookup"
          connectionId={connectionId}
          resourceId={resourceId}
          resourceType={resourceType}
          flowId={flowId}
          fieldId={id}
          showDynamicLookupOnly
          onSave={handleLookupAdd}
          onSavelabel="Add New Lookup"
          options={options}
        />
      )}
      {showLookup &&
        filteredLookup.map(lookup => (
          <li key={lookup.name}>
            <DynaManageLookup
              id={lookup.name}
              label="Edit"
              connectionId={connectionId}
              resourceId={resourceId}
              resourceType={resourceType}
              flowId={flowId}
              fieldId={id}
              isEdit
              onSave={handleLookupEdit}
              onSelect={handleLookupSelect}
              showDynamicLookupOnly
              value={lookup}
              options={options}
            />
          </li>
        ))}

      {showExtract &&
        filteredExtracts.map(e => (
          <li key={e.label}>
            <ExtractItem
              value={e.value}
              label={e.label}
              onSelect={handleExtractSelect}
            />
          </li>
        ))}
    </ul>
  );
}
