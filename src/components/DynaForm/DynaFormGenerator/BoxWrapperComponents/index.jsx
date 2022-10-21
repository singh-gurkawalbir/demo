import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import FormGenerator from '..';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '10px 16px 0px 16px',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(2),
    minHeight: 319,
  },
}));

export default function BoxWrapperComponents(props) {
  const { containers, fieldMap} = props;
  const classes = useStyles();
  const transformedContainers =
    containers && containers.map(container => {
      const {label, ...rest } = container;

      return <FormGenerator key={label} {...props} layout={rest} fieldMap={fieldMap} />;
    });

  return <Paper elevation={0} className={classes.root}>{transformedContainers}</Paper>;
}
