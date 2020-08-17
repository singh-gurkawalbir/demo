import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import { getRequestURL } from '../../../../../utils/exportPanel';

const useStyles = makeStyles(theme => ({
  wrapper: {
    border: '1px solid',
    wordBreak: 'break-all',
    borderColor: theme.palette.secondary.lightest,
    width: '100%',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    textAlign: 'left',
    marginBottom: theme.spacing(4),
  },
}));

export default function RequestUrlPanel(props) {
  const { previewStageDataList, resourceId, resourceType } = props;
  const classes = useStyles();
  const isRequestUrlAvailable = useSelector(state =>
    selectors.isRequestUrlAvailableForPreviewPanel(state, resourceId, resourceType)
  );
  const requestURL = getRequestURL(previewStageDataList?.request);

  if (!isRequestUrlAvailable || !requestURL) {
    return null;
  }

  return (
    <>
      <Typography> Request URL </Typography>
      <div className={classes.wrapper} > {requestURL} </div>
    </>
  );
}
