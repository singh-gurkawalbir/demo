import { Fragment } from 'react';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles(theme => ({}));

export default function JobErrorPreviewDialogContent({ previewData }) {
  // const classes = useStyles();

  return (
    <Fragment>
      <div>
        {previewData.resolves} errors will be marked as resolved, and your error
        count will be decremented accordingly.
      </div>
      <div>
        {previewData.retries} errors will be retried again. Success and error
        counts will be updated based on the results of those retries.
      </div>
      <div>
        {previewData.remains} errors will remain in the error file, and no stats
        will be changed for these errors.
      </div>
      <div>
        {previewData.invalids} errors have been removed from the error file, and
        will also be marked as resolved.
      </div>
      <div>{previewData.total} errors are present in total.</div>
      <div>{previewData.adds} errors have been added to error file.</div>
      <div>
        Please note that we highly recommend you keep a copy of all error files
        downloaded. Whenever a new error file is uploaded, the job stats and
        error data will be regenerated based on the new file.
      </div>
    </Fragment>
  );
}
