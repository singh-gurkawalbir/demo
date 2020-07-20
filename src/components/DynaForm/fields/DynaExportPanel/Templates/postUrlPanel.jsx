import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { isPostUrlAvailableForPreviewPanel } from '../../../../../reducers';
import { getPostUrl } from '../../../../../utils/exportPanel';

const useStyles = makeStyles(theme => ({
  wrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    width: '100%',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    textAlign: 'left',
    marginBottom: theme.spacing(4),
  },
}));

export default function PostUrlPanel(props) {
  const { previewStageDataList, resourceId, resourceType } = props;
  const classes = useStyles();
  const isPostUrlAvailable = useSelector(state =>
    isPostUrlAvailableForPreviewPanel(state, resourceId, resourceType)
  );
  const postUrl = getPostUrl(previewStageDataList?.request);

  if (!isPostUrlAvailable || !postUrl) {
    return null;
  }

  return (
    <>
      <Typography> Post Url </Typography>
      <div className={classes.wrapper} > {postUrl} </div>
    </>
  );
}
