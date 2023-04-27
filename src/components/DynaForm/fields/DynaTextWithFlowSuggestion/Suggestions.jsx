import { deepClone } from 'fast-json-patch/lib/core';
import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import getJSONPaths, { pickFirstObject } from '../../../../utils/jsonPaths';
import { selectors } from '../../../../reducers';
import lookupUtil from '../../../../utils/lookup';
import LookupActionItem from './LookupActionItem';
import getValueAfterInsert from './util';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../../constants';
import { OutlinedButton } from '../../../Buttons';

const prefixRegexp = '.*{{((?!(}|{)).)*$';
const getMatchingText = (value = '', textInsertPosition) => {
  const inpValue = value?.substring(0, textInsertPosition) || '';
  const startIndexOfBraces = inpValue.lastIndexOf('{{');
  const matchedString = inpValue.substring(startIndexOfBraces + 2);

  return matchedString;
};

const useStyles = makeStyles(theme => ({
  suggestions: {
    width: '100%',
    marginLeft: 0,
    border: '1px solid',
    background: theme.palette.background.paper,
    borderColor: theme.palette.secondary.lightest,
    borderTop: 'none',
    position: 'absolute',
    listStyleType: 'none',
    paddingLeft: 0,
    maxHeight: 200,
    marginTop: 0,
    zIndex: 100,
    overflow: 'auto',
    boxShadow: theme.shadows[3],
    borderRadius: [[0, 0, 4, 4]],
    paddingInlineStart: theme.spacing(1),
    '& li': {
      display: 'flex',
      lineHeight: '100%',
      position: 'relative',
      cursor: 'pointer',
      wordBreak: 'break-word',
      borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
      padding: '12px 15px',
      '&:before': {
        content: '""',
        width: '3px',
        top: 0,
        height: '100%',
        position: 'absolute',
        background: 'transparent',
        left: '0px',
      },
      '&:hover': {
        background: theme.palette.background.paper2,
        '&:before': {
          background: theme.palette.primary.main,
        },
      },
      '&:empty': {
        display: 'none',
      },
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    '&:empty': {
      display: 'none',
    },
  },
  hideSuggesionContainer: {
    display: 'none',
  },
  suggestionsItem: {
    width: '100%',
  },
  suggestionsItemBtn: {
    marginLeft: -15,
    width: 'calc(100% + 30px)',
    height: 'calc(100% + 20px)',
    marginTop: -10,
    borderRadius: 0,
    padding: '0px 15px',
    fontFamily: 'Roboto400',
    '& >.MuiButton-label': {
      display: 'block',
      textAlign: 'left',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));
const ExtractItem = props => {
  const classes = useStyles();
  const { onSelect, value, label } = props;
  const handleItemSelect = useCallback(() => {
    onSelect(value);
  }, [onSelect, value]);

  return (
    <div className={classes.suggestionsItem}>
      {/* TODO:(Karthik) please have a look on this button */}
      <OutlinedButton onClick={handleItemSelect} className={classes.suggestionsItemBtn}>
        {label}
      </OutlinedButton>
    </div>
  );
};

export default function Suggestions(props) {
  const {
    id,
    flowId,
    resourceId,
    formContext,
    resourceType,
    showLookup = true,
    value = '',
    showExtract,
    textInsertPosition,
    hide,
    onValueUpdate,
    onFieldChange,
    showSuggestionsWithoutHandlebar = false,
    skipExtractWrapOnSpecialChar = false,
    options,
    showLookupModal,
    stage,
  } = props;
  const classes = useStyles();
  const sampleData = useSelector(
    state =>
      selectors.getSampleDataContext(state, {
        flowId,
        resourceId,
        resourceType,
        stage,
      }).data
  );
  const resourceData = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;

  const adaptorType = resourceData?.adaptorType;

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
  const filteredLookup = useMemo(() => {
    if (!lookups || !lookups.filter) return [];

    return lookups.filter(
      l => l.name.toLowerCase().indexOf(matchingText.toLowerCase()) > -1
    );
  }, [lookups, matchingText]);
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
        const valueToInsert = `lookup.${lookup.name}`;
        // update text field with selected lookup
        const newValue = getValueAfterInsert(
          value,
          textInsertPosition,
          valueToInsert
        );

        onValueUpdate(newValue);
      }
    },
    [textInsertPosition, onValueUpdate, showSuggestionsWithoutHandlebar, value]
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
    (newLookup = {}, oldLookup = {}) => {
      const lookupIndex = lookups.findIndex(item => item.name === oldLookup.name);

      if (lookupIndex === -1) {
        return;
      }

      const modifiedLookups = [...lookups];

      modifiedLookups.splice(lookupIndex, 1);
      modifiedLookups.splice(lookupIndex, 0, newLookup);
      const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

      onFieldChange(lookupFieldId, modifiedLookups);
    },
    [adaptorType, lookups, onFieldChange]
  );
  const handleLookupEditorShown = useCallback(
    val => {
      showLookupModal(val);
    },
    [showLookupModal],
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
            options={options}
            showLookupDialog={handleLookupEditorShown}
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
              showLookupDialog={handleLookupEditorShown}
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
