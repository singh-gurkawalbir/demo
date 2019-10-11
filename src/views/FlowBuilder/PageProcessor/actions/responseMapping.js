import { Dialog, Typography, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/MapDataIcon';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function ResponseMappingDialog({
  flowId,
  resourceId,
  resourceType,
  open,
  onClose,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'outputFilter')
  );

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.fetchSampleData(
          flowId,
          resourceId,
          resourceType,
          'outputFilter'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.paper }}>
      <DialogTitle>Response Mapping</DialogTitle>
      <Typography>flowId: {flowId}</Typography>
      <Typography>resourceId: {resourceId}</Typography>
      {sampleData && (
        <Typography> SampleData: {JSON.stringify(sampleData)}</Typography>
      )}
    </Dialog>
  );
}

function ResponseMapping(props) {
  const { open } = props;

  return <Fragment>{open && <ResponseMappingDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseMapping',
  left: 166,
  top: 28,
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: ResponseMapping,
};
