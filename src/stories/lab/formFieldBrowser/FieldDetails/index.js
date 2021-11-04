import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Help from '../../../../components/Help';
import helpTextMap from '../../../../components/Help/helpTextMap';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../constants/resource';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    background: theme.palette.background.paper2,
  },
  titleContainer: {
    display: 'flex',
  },
  helpTextButton: {
    padding: 0,
  },

}));

// console.log(helpTextMap);

export default function FieldDetails({id, resourceType, field}) {
  const classes = useStyles();
  const helpKey = `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}.${id}`;

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography><b>{field.label}</b></Typography>
        <Help className={classes.helpTextButton} title={field.label} helpText={helpTextMap[helpKey]} />
      </div>

      {field.description && (
        <Typography variant="caption">{field.description}</Typography>
      )}

      <Typography variant="subtitle2">ID: {helpKey}</Typography>
      <Typography variant="body2">UI Component: {field.type}</Typography>
    </div>
  );
}
