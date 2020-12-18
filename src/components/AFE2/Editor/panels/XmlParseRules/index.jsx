/* eslint-disable camelcase */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography, Radio, RadioGroup, TextField, Checkbox, FormGroup, FormControlLabel }
  from '@material-ui/core';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { getHelpTextMap } from '../../../../Help';
import TextFieldList from './TextFieldList';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 10,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflow: 'auto',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
  helpText: {
    whiteSpace: 'pre-line',
    maxWidth: 450,
  },
  formControl: {
    margin: theme.spacing(1),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
}));

export default function XmlParseRules({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const rule = useSelector(state => selectors._editorRule(state, editorId));

  const {
    V0_json = false,
    trimSpaces = false,
    stripNewLineChars = false,
    textNodeName = '',
    attributePrefix = '',
    listNodes = '',
    includeNodes = '',
    resourcePath = '',
    excludeNodes = '',
  } = rule || {};

  const patchEditor = (field, value) => {
    dispatch(actions._editor.patchRule(editorId, {...rule, [field]: value}));
  };

  return (
    <div className={classes.container}>
      <FormGroup>
        <RadioGroup
          row
          onChange={() => patchEditor('V0_json', !V0_json)}>
          {['Custom', 'Automatic'].map(label => (
            <FormControlLabel
              disabled={disabled}
              key={label}
              control={(
                <Radio
                  color="primary"
                  checked={label === 'Automatic' ? V0_json : !V0_json}
                />
              )}
              label={label}
            />
          ))}
        </RadioGroup>

        <TextField
          label="Resource path"
          placeholder="none"
          multiline
          rowsMax={4}
          disabled={disabled}
          className={classes.textField}
          value={resourcePath}
          InputLabelProps={{ shrink: true }}
          onChange={e => patchEditor('resourcePath', e.target.value)}
        />

        {V0_json && (
          <Typography variant="caption" className={classes.helpText}>
            {getHelpTextMap()['editor.xml.simple']}
          </Typography>
        )}

        {!V0_json && (
          <>
            <FormControlLabel
              control={(
                <Checkbox
                  disabled={disabled}
                  checked={trimSpaces}
                  onChange={() => patchEditor('trimSpaces', !trimSpaces)}
                  color="primary"
                />
              )}
              label="Trim spaces"
            />

            <FormControlLabel
              control={(
                <Checkbox
                  disabled={disabled}
                  checked={stripNewLineChars}
                  color="primary"
                  onChange={() => patchEditor('stripNewLineChars', !stripNewLineChars)}
                />
              )}
              label="Strip newline chars"
            />

            <TextField
              label="Text node name"
              placeholder="&txt"
              disabled={disabled}
              className={classes.textField}
              value={textNodeName}
              InputLabelProps={{ shrink: true }}
              onChange={e => patchEditor('textNodeName', e.target.value)}
            />

            <TextField
              label="Attribute prefix"
              placeholder="none"
              disabled={disabled}
              className={classes.textField}
              value={attributePrefix}
              onChange={e => patchEditor('attributePrefix', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="List nodes"
              placeholder="none"
              multiline
              rowsMax={4}
              disabled={disabled}
              className={classes.textField}
              value={listNodes}
              InputLabelProps={{ shrink: true }}
              onChange={e => patchEditor('listNodes', e.target.value)}
            />
            <TextFieldList
              label="Nodes to include"
              disabled={disabled}
              value={includeNodes}
              onChange={value => console.log(value)}
            />

            <TextField
              label="Nodes to include"
              placeholder="all"
              multiline
              rowsMax={4}
              disabled={disabled}
              className={classes.textField}
              value={includeNodes}
              InputLabelProps={{ shrink: true }}
              onChange={e => patchEditor('includeNodes', e.target.value)}
            />

            <TextField
              label="Nodes to exclude"
              placeholder="none"
              multiline
              rowsMax={4}
              disabled={disabled}
              className={classes.textField}
              value={excludeNodes}
              InputLabelProps={{ shrink: true }}
              onChange={e => patchEditor('excludeNodes', e.target.value)}
            />
          </>
        )}
      </FormGroup>
    </div>
  );
}
