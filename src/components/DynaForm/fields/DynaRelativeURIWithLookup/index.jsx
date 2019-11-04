import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import * as selectors from '../../../../reducers';
import UrlEditorDialog from '../../../../components/AFE/UrlEditor/Dialog';
import InputWithLookupHandlebars from './InputWithLookupHandlebars';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  editorButton: {
    float: 'right',
    marginLeft: 5,
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: 50,
    width: 50,
    borderRadius: 2,
    '&:hover': {
      background: theme.palette.background.paper,
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

export default function DynaRelativeURIWithLookup(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    connectionId,
    disabled,
    errorMessages,
    id,
    isValid,
    multiline,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    label,
    options,
  } = props;
  const { fieldId: lookupFieldId, data: lookupData } = options.lookups;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleLookupUpdate = lookups => {
    onFieldChange(lookupFieldId, lookups);
  };

  const handleClose = (shouldCommit, editorValues) => {
    const { template } = editorValues;

    if (shouldCommit) {
      onFieldChange(id, template);
    }

    handleEditorClick();
  };

  const handleFieldChange = val => {
    onFieldChange(id, val);
  };

  const getSampleData = () => {
    if (!connection) return '{}';

    return JSON.stringify(
      {
        connection: {
          _id: connection._id,
          name: connection.name,
        },
      },
      null,
      2
    );
  };

  let description = '';
  const { type } = connection || {};

  if (type === 'http' || type === 'rest') {
    description = `Relative to: ${connection[type].baseURI}`;
  }

  return (
    <Fragment>
      {showEditor && (
        <UrlEditorDialog
          title="Relative URI Editor"
          id={id}
          data={getSampleData()}
          rule={value}
          onClose={handleClose}
        />
      )}
      <IconButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.editorButton}>
        <OpenInNewIcon />
      </IconButton>
      <InputWithLookupHandlebars
        key={id}
        name={name}
        label={label}
        placeholder={placeholder}
        isValid={isValid}
        description={description}
        errorMessages={errorMessages}
        disabled={disabled}
        multiline={multiline}
        onFieldChange={handleFieldChange}
        lookups={lookupData}
        onLookupUpdate={handleLookupUpdate}
        required={required}
        value={value}
      />
    </Fragment>
  );
}
