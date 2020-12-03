import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import editorMetadata from '../../Editor/metadata';
import Help from '../../../Help';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    marginLeft: theme.spacing(1),
  },
}));

export default function HelpIconButton({ editorId }) {
  const classes = useStyles();

  // TODO: Remove this hardcoded default after 1/1/2021. Used only for test purposes.
  const { fieldId = 'settingsForm', processor: type } = useSelector(state => selectors._editor(state, editorId));

  if (!fieldId) return null;

  const { label } = editorMetadata[type];

  return (
    <Help
      title={label}
      className={classes.helpTextButton}
      helpKey={fieldId}
      fieldId={fieldId}
    />
  );
}
