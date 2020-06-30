import React, { } from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import FormGenerator from '..';
// import ColorPalette from '../../../../styleguide/ColorPalette';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: 'none',
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
    // backgroundColor: theme.palette.background.paper2
  },
}));

export default function BoxComponents(props) {
  const { containers, fieldMap} = props;
  const classes = useStyles();
  const transformedContainers =
    containers &&
    containers.map((container) => {
      const {label, ...rest } = container;


      return (
        <Paper key={label} elevation={0} className={classes.root}>
          <FormGenerator {...props} layout={rest} fieldMap={fieldMap} />
        </Paper>

      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}
