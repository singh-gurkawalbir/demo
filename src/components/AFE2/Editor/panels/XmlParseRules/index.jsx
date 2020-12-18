/* eslint-disable camelcase */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography, Radio, RadioGroup, Checkbox, FormGroup, FormControlLabel, Input, InputLabel }
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
  input: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(1),
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
    listNodes = [],
    includeNodes = [],
    excludeNodes = [],
    resourcePath = '',
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

        <div className={classes.textField}>
          <InputLabel>Resource path</InputLabel>
          <Input
            multiline
            fullWidth
            rowsMax={4}
            disabled={disabled}
            className={classes.input}
            value={resourcePath}
            onChange={e => patchEditor('resourcePath', e.target.value)}
          />
        </div>

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

            <div className={classes.textField}>
              <InputLabel>Text node name</InputLabel>
              <Input
                className={classes.input}
                placeholder="&txt"
                disabled={disabled}
                value={textNodeName}
                onChange={e => patchEditor('textNodeName', e.target.value)}
              />
            </div>

            <div className={classes.textField}>
              <InputLabel>Attribute prefix</InputLabel>
              <Input
                className={classes.input}
                disabled={disabled}
                value={attributePrefix}
                onChange={e => patchEditor('attributePrefix', e.target.value)}
              />
            </div>

            <TextFieldList
              className={classes.textField}
              label="List nodes"
              disabled={disabled}
              value={listNodes}
              onChange={value => patchEditor('listNodes', value)}
            />

            <TextFieldList
              className={classes.textField}
              label="Nodes to include"
              disabled={disabled}
              value={includeNodes}
              onChange={value => patchEditor('includeNodes', value)}
            />

            <TextFieldList
              className={classes.textField}
              label="Nodes to exclude"
              disabled={disabled}
              value={excludeNodes}
              onChange={value => patchEditor('excludeNodes', value)}
            />
          </>
        )}
      </FormGroup>
    </div>
  );
}
