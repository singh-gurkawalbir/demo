import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import getJSONPaths, { pickFirstObject } from '../../../../utils/jsonPaths';
import * as selectors from '../../../../reducers';
import DynaAddEditLookup from '../DynaAddEditLookup';
import lookupUtil from '../../../../utils/lookup';

const useStyles = makeStyles(() => ({}));
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

export default function Suggestions(props) {
  const {
    flowId,
    resourceId,
    formContext,
    resourceType,
    showLookup,
    value = '',
    showExtract,
    cursorPosition,
    onValueUpdate,
  } = props;

  console.log('formContext', formContext);
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

  console.log('lookups', lookups);
  console.log('extracts', extracts);
  const handleExtractClick = useCallback(
    (event = {}) => {
      const newValue = insertSuggestionInValue({
        value,
        cursorPosition,
        valueToInsert: event.value,
      });

      onValueUpdate(newValue);
    },
    [cursorPosition, onValueUpdate, value]
  );
  const matchingText = getMatchingText(value, cursorPosition);
  const filteredLookup = lookups.filter(
    l => l.name.toLowerCase().indexOf(matchingText.toLowerCase()) > -1
  );
  const handleLookupSelect = useCallback(
    lookup => {
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

  console.log('filteredExtracts', filteredExtracts);
  const showSuggestion = !!value
    .substring(0, cursorPosition)
    .match(prefixRegexp);

  // TODO: check if needed
  if (!showSuggestion) return null;

  return (
    <ul className={classes.suggestions}>
      {showLookup && (
        <DynaAddEditLookup
          showDynamicLookupOnly
          id="add-lookup"
          label="New Lookup"
          onSavelabel="Add New Lookup"
        />
      )}
      {showLookup &&
        filteredLookup.map(lookup => (
          <li key={lookup.name}>
            <DynaAddEditLookup
              id={lookup.name}
              label="Edit"
              isEdit
              onSelect={handleLookupSelect}
              showDynamicLookupOnly
              value={lookup}
            />
          </li>
        ))}

      {showExtract &&
        filteredExtracts.map(e => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <li key={e.label} onClick={handleExtractClick}>
            {e.label}
          </li>
        ))}
    </ul>
  );
}
