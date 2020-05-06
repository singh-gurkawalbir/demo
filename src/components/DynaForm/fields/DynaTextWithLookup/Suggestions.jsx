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

const insertSuggestionInValue = ({
  value,
  cursorPosition,
  valueToInsert,
  isLookup,
}) => {
  const tmpStr = value.substring(0, cursorPosition);
  const lastIndexOfBracesBeforeCursor = tmpStr.lastIndexOf('{');
  let handlebarExp = '';

  if (isLookup) {
    handlebarExp = `{lookup "${valueToInsert}" this}`;
  } else {
    handlebarExp = `{${valueToInsert}}`;
  }

  const closeBraceIndexAfterCursor = value.indexOf(
    '}',
    lastIndexOfBracesBeforeCursor + 1
  );
  const openBraceIndexAfterCursor = value.indexOf(
    '{',
    lastIndexOfBracesBeforeCursor + 1
  );
  let newValue = '';
  const preText = `${value.substring(0, lastIndexOfBracesBeforeCursor + 1)}`;

  if (
    closeBraceIndexAfterCursor === -1 ||
    (openBraceIndexAfterCursor !== -1 &&
      openBraceIndexAfterCursor < closeBraceIndexAfterCursor)
  ) {
    const postText = `${value.substring(lastIndexOfBracesBeforeCursor + 1)}`;

    newValue = `${preText}${handlebarExp}}}${postText}`;
  } else {
    const postText = `${value.substring(closeBraceIndexAfterCursor)}`;

    newValue = `${preText}${handlebarExp}${postText}`;
  }

  return newValue;
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
  const { merged: resourceData } = useSelector(state =>
    selectors.resourceData(state, 'imports', resourceId)
  );
  const { adaptorType } = resourceData || {};
  const extracts = useMemo(() => {
    const extractPaths = getJSONPaths(pickFirstObject(sampleData));

    return (
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      []
    );
  }, [sampleData]);
  const lookups = lookupUtil.getLookupFromFormContext(formContext, adaptorType);
  const handleExtractSelect = useCallback(
    value => {
      const newValue = insertSuggestionInValue({
        value,
        cursorPosition,
        valueToInsert: value,
      });

      onValueUpdate(newValue);
    },
    [cursorPosition, onValueUpdate]
  );
  const matchingText = getMatchingText(value, cursorPosition);
  const filteredLookup = lookups.filter(
    l => l.name.toLowerCase().indexOf(matchingText.toLowerCase()) > -1
  );
  const handleLookupSelect = useCallback(
    lookup => {
      // update text field with selected lookup
      const newValue = insertSuggestionInValue({
        value,
        cursorPosition,
        valueToInsert: lookup.name,
        isLookup: true,
      });

      onValueUpdate(newValue);
    },
    [cursorPosition, onValueUpdate, value]
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
