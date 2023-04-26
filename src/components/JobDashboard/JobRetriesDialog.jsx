import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography, IconButton } from '@mui/material';
import { reverse } from 'lodash';
import CeligoTable from '../CeligoTable';
import { JOB_STATUS } from '../../constants';
import DateTimeDisplay from '../DateTimeDisplay';
import CloseIcon from '../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  title: {
    minWidth: '640px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

const useColumns = () => [
  {
    key: 'retry',
    heading: 'Retry #',
    isLoggable: true,
    Value: ({rowData: r}) => r.index + 1,
  },
  {
    key: 'duration',
    heading: 'Duration',
    isLoggable: true,
    Value: ({rowData: r}) => r.duration },
  {
    key: 'completed',
    heading: 'Completed',
    isLoggable: true,
    // eslint-disable-next-line react/display-name
    Value: ({rowData: r}) => <DateTimeDisplay dateTime={r.endedAt} />,
  },
];

export default function JobRetriesDialog({
  job,
  integrationName,
  onCloseClick,
}) {
  const classes = useStyles();
  let { retries } = job;

  retries = reverse(
    retries?.filter(r =>
      [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED, JOB_STATUS.CANCELED].includes(
        r.status
      )).map((r, index) => ({ ...r, index }))
  );

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle className={classes.title}>
        <Typography variant="h6">
          {`${integrationName} > ${job && job.name}`}
        </Typography>
        <Typography>
          Success: {job.numSuccess} Ignore: {job.numIgnore} Error:{' '}
          {job.numError}
        </Typography>
        <IconButton
          className={classes.closeButton}
          data-test="closeJobRetriesDialog"
          onClick={onCloseClick}
          size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CeligoTable
          data={retries}
          useColumns={useColumns}
        />
      </DialogContent>
    </Dialog>
  );
}
