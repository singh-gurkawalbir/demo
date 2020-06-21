import React from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../reducers';
import Help from '../../Help';

const useStyles = makeStyles(theme => ({
  iconButton: {
    marginLeft: theme.spacing(0.5),
    padding: 0,
    marginTop: -1,
    color: theme.palette.text.hint,
    '&:hover': {
      background: 'none',
      color: theme.palette.primary.main,
    },
  },
}));

export default function FieldHelp({
  id,
  label,
  helpText,
  helpKey,
  resourceContext,
  noApi = false
}) {
  const classes = useStyles();
  const { developer } = useSelector(state => selectors.userProfile(state));

  return (
    <Help
      key={`help-${id}`}
      data-test={`help-${id}`}
      title={label || 'Field Help'}
      className={classes.iconButton}
      caption={developer && !noApi && helpKey}
      helpKey={helpKey}
      helpText={helpText}
      fieldId={id}
      resourceType={resourceContext && resourceContext.resourceType}
    />
  );
}
