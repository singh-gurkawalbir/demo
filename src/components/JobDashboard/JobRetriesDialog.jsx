import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { reverse } from 'lodash';
import CeligoTable from '../../components/CeligoTable';
import { JOB_STATUS } from '../../utils/constants';

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

export default function JobRetriesDialog({
  job,
  integrationName,
  onCloseClick,
}) {
  const classes = useStyles();
  let { retries } = job;

  retries = reverse(
    retries
      .filter(r =>
        [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED, JOB_STATUS.CANCELED].includes(
          r.status
        )
      )
      .map((r, index) => ({ ...r, index }))
  );

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle className={classes.title} disableTypography>
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
          onClick={onCloseClick}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CeligoTable
          data={retries}
          columns={[
            { heading: 'Retry #', value: r => r.index + 1 },
            { heading: 'Duration', value: r => r.duration },
            { heading: 'Completed', value: r => r.endedAtAsString },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
