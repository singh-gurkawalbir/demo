import { Dialog, Typography, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MapDataIcon from '../../../components/icons/MapDataIcon';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function ImportMappingDialog({ flowId, resourceId, open, onClose }) {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.paper }}>
      <DialogTitle>Import Mapping</DialogTitle>
      <Typography>flowId: {flowId}</Typography>
      <Typography>resourceId: {resourceId}</Typography>
    </Dialog>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'importMapping',
  Icon: MapDataIcon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: ImportMappingDialog,
};
