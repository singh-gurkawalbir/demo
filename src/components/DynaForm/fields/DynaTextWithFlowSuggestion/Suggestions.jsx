import { deepClone } from 'fast-json-patch/lib/core';
import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import clsx from 'clsx';
import getJSONPaths, { pickFirstObject } from '../../../../utils/jsonPaths';
import * as selectors from '../../../../reducers';
import lookupUtil from '../../../../utils/lookup';
import LookupActionItem from './LookupActionItem';
import getValueAfterInsert from './util';

const prefixRegexp = '.*{{((?!(}|{)).)*$';
const getMatchingText = (value, textInsertPosition) => {
  const inpValue = value.substring(0, textInsertPosition);
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
  hideSuggesionContainer: {
    display: 'none',
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
    formContext,
    resourceType,
    showLookup,
    value = '',
    showExtract,
    textInsertPosition,
    hide,
    onValueUpdate,
    onFieldChange,
    showSuggestionsWithoutHandlebar = false,
    skipExtractWrapOnSpecialChar = false,
    options,
  } = props;
  const classes = useStyles();
  const sampleData = useSelector(
    state =>
      selectors.getSampleDataContext(state, {
        flowId,
        resourceId,
        resourceType,
        stage: 'flowInput',
      }).data
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
  const matchingText = useMemo(
    () => getMatchingText(value, textInsertPosition),
    [textInsertPosition, value]
  );
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
          value:
            !skipExtractWrapOnSpecialChar && field.id.indexOf(' ') > -1
              ? `[${field.id}]`
              : field.id,
        }))
        .filter(
          e => e.label.toLowerCase().indexOf(matchingText.toLowerCase()) > -1
        ),
    [extracts, matchingText, skipExtractWrapOnSpecialChar]
  );
  const handleExtractSelect = useCallback(
    _val => {
      const newValue = showSuggestionsWithoutHandlebar
        ? _val
        : getValueAfterInsert(value, textInsertPosition, _val);

      onValueUpdate(newValue);
    },
    [textInsertPosition, onValueUpdate, showSuggestionsWithoutHandlebar, value]
  );
  const handleLookupSelect = useCallback(
    lookup => {
      if (showSuggestionsWithoutHandlebar) {
        onValueUpdate(lookup.name);
      } else {
        const valueToInsert =
          adaptorType === 'HTTPImport'
            ? `lookup "${lookup.name}" this`
            : lookup.name;
        // update text field with selected lookup
        const newValue = getValueAfterInsert(
          value,
          textInsertPosition,
          valueToInsert
        );

        onValueUpdate(newValue);
      }
    },
    [
      adaptorType,
      textInsertPosition,
      onValueUpdate,
      showSuggestionsWithoutHandlebar,
      value,
    ]
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
  const showSuggestion =
    !hide &&
    (showSuggestionsWithoutHandlebar ||
      (!showSuggestionsWithoutHandlebar &&
        !!value.substring(0, textInsertPosition).match(prefixRegexp)));

  return (
    <ul
      className={clsx(classes.suggestions, {
        [classes.hideSuggesionContainer]: !showSuggestion,
      })}>
      {showLookup && (
        <li key="addLookup">
          <LookupActionItem
            id="add-lookup"
            label="New lookup"
            resourceId={resourceId}
            resourceType={resourceType}
            flowId={flowId}
            fieldId={id}
            showDynamicLookupOnly
            onSave={handleLookupAdd}
            onSavelabel="Add new lookup"
            options={options}
          />
        </li>
      )}
      {showLookup &&
        filteredLookup.map(lookup => (
          <li key={lookup.name}>
            <LookupActionItem
              id={lookup.name}
              label="Edit"
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
