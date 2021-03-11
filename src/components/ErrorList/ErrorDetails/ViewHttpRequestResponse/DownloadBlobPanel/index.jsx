import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../../../actions';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    height: '100%',
    '&>button': {
      margin: 'auto',
    },
  },
}));

export default function DownloadBlobPanel({flowId, resourceId, s3BlobKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleDownloadBlob = useCallback(
    () => {
      dispatch(actions.errorManager.errorHttpDoc.downloadBlobDoc(flowId, resourceId, s3BlobKey));
    },
    [flowId, resourceId, s3BlobKey, dispatch],
  );

  return (
    <div className={classes.container}>
      <Button variant="outlined" color="primary" onClick={handleDownloadBlob}>
        Download
      </Button>
    </div>
  );
}
