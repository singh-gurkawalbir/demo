import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, fade } from '@material-ui/core/styles';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { KeyValueComponent } from '../../../../DynaForm/fields/DynaKeyValue';
import {
  getUnionObject,
  getJSONPathArrayWithSpecialCharactersWrapped,
} from '../../../../../utils/jsonPaths';
import { isJsonString } from '../../../../../utils/string';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: props => props.hasError ? `${fade(theme.palette.error.light, 0.06)} !important` : theme.palette.background.default,
    border: props => props.hasError && '1px solid',
    borderColor: props => props.hasError && theme.palette.error.dark,
    height: '100%',
    overflowY: 'auto',
    width: '100%',
    paddingTop: theme.spacing(1),
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing(1),
  },
  rowContainer: {
    display: 'flex',
    marginBottom: 6,
    minHeight: 42,
    paddingRight: theme.spacing(1),
  },
}));

export default function TransformPanel({ editorId }) {
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const data = useSelector(state => selectors.editorData(state, editorId));
  const rule = useSelector(state => selectors.editorRule(state, editorId));
  const hasError =
  useSelector(state => selectors.editorPreviewError(state, editorId).errSourceProcessor) === 'transform';
  const classes = useStyles({hasError});

  const patchEditor = useCallback(value => {
    dispatch(actions.editor.patchRule(editorId, value));
  }, [dispatch, editorId]);

  const dataFields = useMemo(() => {
    let parsedData;

    // We are supporting passing of string and json to editor. Check if we want to have a consistency.
    // The change to be made in other editors too
    if (data && typeof data === 'string' && isJsonString(data)) {
      parsedData = JSON.parse(data);
    } else if (data && typeof data === 'object') {
      parsedData = data;
    }

    let isGroupedData = false;

    if (Array.isArray(parsedData) && parsedData.length) {
      parsedData = getUnionObject(parsedData);
      isGroupedData = true;
    }

    const extractOptions =
      getJSONPathArrayWithSpecialCharactersWrapped(
        parsedData || {},
        null,
        true
      ) || [];

    return extractOptions.map(e => ({
      id: isGroupedData ? `*.${e}` : e,
    }));
  }, [data]);
  const suggestionConfig = useMemo(() => ({
    keyConfig: {
      suggestions: dataFields,
      labelName: 'id',
      valueName: 'id',
    },
  }), [dataFields]);

  return (
    <KeyValueComponent
      disabled={disabled}
      suggestionConfig={suggestionConfig}
      dataTest="transformRule"
      onUpdate={patchEditor}
      showDelete
      // TODO: This is not a good pattern! All we should do
      // is pass a 'hasError' prop, and let the keyValue
      // component be responsible for the style. This parent
      // component shoudl not concern itself with what a child looks like.
      classes={classes}
      value={rule}
      keyName="extract"
      valueName="generate"
      enableSorting
    />
  );
}
