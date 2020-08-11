import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import JsonContent from '../../../../JsonContent';

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
        <JsonContent json={resourceSampleData.error} />
      </div>
    </div>
  );
}
