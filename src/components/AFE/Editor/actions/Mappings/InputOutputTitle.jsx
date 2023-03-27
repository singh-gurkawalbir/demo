import React from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import Help from '../../../../Help';
import { selectors } from '../../../../../reducers';
import ActionGroup from '../../../../ActionGroup';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
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
  const mappingVersion = useSelector(state => selectors.mappingVersion(state));
  const message = useSelector(state => {
    const {isGroupedSampleData, isGroupedOutput} = selectors.mapping(state) || {};

    const inputTitle = isGroupedSampleData ? 'Source rows [ ]' : 'Source record { }';
    const outputTitle = isGroupedOutput ? 'Destination rows [ ]' : 'Destination record { }';

    return title === 'Input' ? inputTitle : outputTitle;
  });

  // return the old title if its not mapper2 view
  if (mappingVersion !== 2) {
    return (
      <>
        {title}
        {helpKey && (
        <Help
          title={title}
          helpKey={helpKey}
          sx={{margin: 0.5}}
        />
        )}
      </>
    );
  }

  return (
    <div className={classes.wrapper}>
      <Typography variant="body1" component="div">{title}</Typography>
      <Help
        title={title}
        helpKey={title === 'Input' ? 'afe.mappings.v2.input' : 'afe.mappings.v2.output'}
        sx={{margin: 0.5}}
        />

      <ActionGroup position="right">
        <Typography variant="caption" className={classes.message}>{message}</Typography>
      </ActionGroup>
    </div>
  );
}
