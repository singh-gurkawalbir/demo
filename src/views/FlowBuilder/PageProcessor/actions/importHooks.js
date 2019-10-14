import { Dialog, Typography, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function HooksDialog({ flowId, resource, resourceType, open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'hooks')
  );

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.fetchSampleData(
          flowId,
          resourceId,
          resourceType,
          'hooks'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.paper }}>
      <DialogTitle>Hooks</DialogTitle>
      <Typography>flowId: {flowId}</Typography>
      <Typography>resourceId: {resourceId}</Typography>
      {sampleData && (
        <Typography> SampleData: {JSON.stringify(sampleData)}</Typography>
      )}
    </Dialog>
  );
}

function Hooks(props) {
  const { open } = props;

  return <Fragment>{open && <HooksDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'importHooks',
  position: 'middle',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: Hooks,
};
