import React, { } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import FormGenerator from '..';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '10px 16px 0px 16px',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: 'none',
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
    minHeight: 319,
  },
}));

export default function BoxComponents(props) {
  const { containers, fieldMap} = props;
  const classes = useStyles();
  const transformedContainers =
    containers &&
    containers.map(container => {
      const {label, ...rest } = container;

      return (
        <Paper key={label} elevation={0} className={classes.root}>
          {label && <Typography>{label}</Typography>}
          <FormGenerator {...props} layout={rest} fieldMap={fieldMap} />
        </Paper>

      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}
