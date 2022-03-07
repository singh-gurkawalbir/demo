import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Help from '../../../../Help';
import { selectors } from '../../../../../reducers';
import ActionGroup from '../../../../ActionGroup';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  helpButton: {
    padding: 0,
    margin: 2,
  },
  message: {
    backgroundColor: theme.palette.secondary.lightest,
    borderRadius: 4,
    padding: theme.spacing(0.5, 2),
    color: theme.palette.secondary.darkest,
    fontFamily: 'Roboto400',
    lineHeight: 1,
  },
}));

export default function InputOutputTitle({title, helpKey}) {
  const classes = useStyles();
  const message = useSelector(state => {
    const {isGroupedSampleData, isGroupedOutput} = selectors.mapping(state) || {};

    const inputTitle = isGroupedSampleData ? 'Row-based data' : 'Record-based data';
    const outputTitle = isGroupedOutput ? 'Row-based data' : 'Record-based data';

    return title === 'Input' ? inputTitle : outputTitle;
  });

  const mappingVersion = useSelector(state => selectors.mappingVersion(state));

  // return the old title if its not mapper2 view
  if (mappingVersion !== 2) {
    return (
      <>
        {title}
        {helpKey && (
        <Help
          title={title}
          className={classes.helpButton}
          helpKey={helpKey}
        />
        )}
      </>
    );
  }

  return (
    <div className={classes.wrapper}>
      <Typography variant="body1" component="div">{title}</Typography>
      {helpKey && (
        <Help
          title={title}
          className={classes.helpButton}
          helpKey={helpKey}
        />
      )}

      <ActionGroup position="right">
        <Typography variant="caption" className={classes.message}>{message}</Typography>
      </ActionGroup>
    </div>
  );
}
