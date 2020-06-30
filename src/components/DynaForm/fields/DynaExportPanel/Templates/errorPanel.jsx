import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  sampleDataWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  sampleDataContainer: {
    minHeight: theme.spacing(20),
    position: 'relative',
    backgroundColor: 'white',
    maxHeight: 400,
    overflow: 'auto',
    maxWidth: 680,
    color: theme.palette.text.primary,
  },
}));

export default function ErrorPanel(props) {
  const { resourceSampleData } = props;
  const classes = useStyles();

  return (
    <div className={classes.sampleDataWrapper}>
      <div className={classes.sampleDataContainer}>
        <pre>{JSON.stringify(resourceSampleData.error, null, 2)}</pre>
      </div>
    </div>
  );
}
