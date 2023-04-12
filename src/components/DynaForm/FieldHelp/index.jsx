import React from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { selectors } from '../../../reducers';
import Help from '../../Help';

const useStyles = makeStyles(theme => ({
  iconButton: {
    marginLeft: theme.spacing(0.5),
    padding: 0,
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
  escapeUnsecuredDomains,
  noApi = false,
  disablePortal,
  contentId,
}) {
  const classes = useStyles();
  const { developer } = useSelector(state => selectors.userProfile(state));

  return (
    <Help
      key={`help-${id}`}
      data-test={`help-${id}`}
      title={label || 'Field help'}
      className={classes.iconButton}
      caption={developer && !noApi && helpKey}
      helpKey={helpKey}
      helpText={helpText}
      fieldId={id}
      resourceType={resourceContext && resourceContext.resourceType}
      escapeUnsecuredDomains={escapeUnsecuredDomains}
      disablePortal={disablePortal}
      contentId={contentId}
    />
  );
}
