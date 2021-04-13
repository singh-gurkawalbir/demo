import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import editorMetadata from '../../metadata';
import Help from '../../../Help';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    marginLeft: theme.spacing(1),
  },
}));

export default function HelpIconButton({ editorId }) {
  const classes = useStyles();

  const { fieldId, editorType } = useSelector(state => selectors.editor(state, editorId));

  if (!fieldId) return null;

  const { label } = editorMetadata[editorType];

  return (
    <Help
      title={label}
      className={classes.helpTextButton}
      helpKey={fieldId}
      fieldId={fieldId}
    />
  );
}
