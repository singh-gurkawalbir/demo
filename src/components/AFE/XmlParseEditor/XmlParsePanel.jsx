/* eslint-disable camelcase */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { getHelpTextMap } from '../../Help';

const useStyles = makeStyles(theme => ({
  helpText: {
    whiteSpace: 'pre-line',
  },
  container: {
    padding: 10,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflow: 'auto',
  },
  formControl: {
    margin: theme.spacing(1),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
}));

export default function XmlParsePanel({ editorId, disabled }) {
  const classes = useStyles();
  const dispatch = useDispatch();
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
  } = useSelector(state => {
    const editor = selectors.editor(state, editorId);

    // console.log(editor);
    return editor;
  });
  const patchEditor = (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  };

  return (
    <div className={classes.container}>
      <FormGroup>
        <TextField
          label="Resource path"
          placeholder="none"
          multiline
          rowsMax={4}
          disabled={disabled}
          className={classes.textField}
          value={resourcePath}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => patchEditor('resourcePath', e.target.value)}
        />
        <RadioGroup
          row
          onChange={() => {
            patchEditor('V0_json', !V0_json);
          }}>
          {['Custom', 'Automatic'].map(label => (
            <FormControlLabel
              disabled={disabled}
              key={label}
              control={
                <Radio
                  color="primary"
                  checked={label === 'Automatic' ? V0_json : !V0_json}
                />
              }
              label={label}
            />
          ))}
        </RadioGroup>

        {V0_json && (
          <Typography variant="caption" className={classes.helpText}>
            {getHelpTextMap()['editor.xml.simple']}
          </Typography>
        )}

        {!V0_json && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disabled}
                  checked={trimSpaces}
                  onChange={() => patchEditor('trimSpaces', !trimSpaces)}
                  color="primary"
                />
              }
              label="Trim spaces"
            />

            <FormControlLabel
              control={
                <Checkbox
                  disabled={disabled}
                  checked={stripNewLineChars}
                  color="primary"
                  onChange={() =>
                    patchEditor('stripNewLineChars', !stripNewLineChars)}
                />
              }
              label="Strip newline chars"
            />

            <TextField
              label="Text node name"
              placeholder="&txt"
              disabled={disabled}
              className={classes.textField}
              value={textNodeName}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={e => patchEditor('textNodeName', e.target.value)}
            />

            <TextField
              label="Attribute prefix"
              placeholder="none"
              disabled={disabled}
              className={classes.textField}
              value={attributePrefix}
              onChange={e => patchEditor('attributePrefix', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="List nodes"
              placeholder="none"
              multiline
              rowsMax={4}
              disabled={disabled}
              className={classes.textField}
              value={listNodes}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={e => patchEditor('listNodes', e.target.value)}
            />

            <TextField
              label="Nodes to include"
              placeholder="all"
              multiline
              rowsMax={4}
              disabled={disabled}
              className={classes.textField}
              value={includeNodes}
              InputLabelProps={{
                shrink: true,
              }}
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
              InputLabelProps={{
                shrink: true,
              }}
              onChange={e => patchEditor('excludeNodes', e.target.value)}
            />
          </>
        )}
      </FormGroup>
    </div>
  );
}
