import {
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import CloseIcon from '../icons/CloseIcon';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import CeligoTable from '../../components/CeligoTable';
import metadata from './metadata';

const useStyles = makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(4),
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function MappingDialog({ onClose, resource }) {
  const classes = useStyles();
  const imports = useSelector(state =>
    selectors.getAllPageProcessorImports(
      state,
      resource && resource.pageProcessors
    )
  );

  return (
    <Dialog open maxWidth={false}>
      <IconButton
        data-test="closeMappingDialog"
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.title}>
        <Typography>
          Please select which mapping you would like to edit.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <LoadResources
          required
          resources="flows, connections, exports, imports">
          <CeligoTable data={imports} {...metadata} />
        </LoadResources>
      </DialogContent>
    </Dialog>
  );
}
