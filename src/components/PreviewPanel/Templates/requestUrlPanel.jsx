import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { selectors } from '../../../reducers';
import { getRequestURL, getDecodedURL } from '../../../utils/exportPanel';

const useStyles = makeStyles(theme => ({
  wrapper: {
    border: '1px solid',
    wordBreak: 'break-all',
    borderColor: theme.palette.secondary.lightest,
    width: '100%',
    minHeight: theme.spacing(6),
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    textAlign: 'left',
    marginBottom: theme.spacing(4),
  },
}));

export default function RequestUrlPanel(props) {
  const { previewStageDataList, resourceId, resourceType, showEmptyPanel = false } = props;
  const classes = useStyles();
  const isRequestUrlAvailable = useSelector(state =>
    selectors.isRequestUrlAvailableForPreviewPanel(state, resourceId, resourceType)
  );
  const requestURL = getDecodedURL(getRequestURL(previewStageDataList));

  if (!isRequestUrlAvailable || (!showEmptyPanel && !requestURL)) {
    return null;
  }

  return (
    <>
      <Typography> Request URL </Typography>
      <div className={classes.wrapper} data-private > {requestURL} </div>
    </>
  );
}
