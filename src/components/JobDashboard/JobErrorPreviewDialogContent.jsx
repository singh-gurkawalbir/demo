import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  boldText: {
    fontWeight: 'bold',
  },
  boldErrorText: {
    fontWeight: 'bold',
    color: theme.palette.error.main,
  },
  note: {
    marginTop: 20,
  },
}));

export default function JobErrorPreviewDialogContent({ previewData }) {
  const classes = useStyles();

  return (
    <div>
      <div>
        <span className={classes.boldText}>{previewData.resolves}</span> errors
        will be marked as resolved, and your error count will be decremented
        accordingly.
      </div>
      <div>
        <span className={classes.boldText}>{previewData.retries}</span> errors
        will be retried again. Success and error counts will be updated based on
        the results of those retries.
      </div>
      <div>
        <span className={classes.boldText}>{previewData.remains}</span> errors
        will remain in the error file, and no stats will be changed for these
        errors.
      </div>
      <div>
        <span className={classes.boldText}>{previewData.invalids}</span> errors
        have been removed from the error file, and will also be marked as
        resolved.
      </div>
      <div>
        <span className={classes.boldText}>{previewData.total}</span> errors are
        present in total.
      </div>
      <div>
        <span className={classes.boldErrorText}>{previewData.adds}</span> errors
        have been added to error file.
      </div>
      <div className={classes.note}>
        Please note that we highly recommend you keep a copy of all error files
        downloaded. Whenever a new error file is uploaded, the job stats and
        error data will be regenerated based on the new file.
      </div>
    </div>
  );
}
