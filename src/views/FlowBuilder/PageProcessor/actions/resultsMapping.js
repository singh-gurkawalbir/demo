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

function ResultsMappingDialog({
  flowId,
  resource,
  resourceType,
  open,
  onClose,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const resourceId = resource._id;
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

function ResultsMapping(props) {
  const { open } = props;

  return <Fragment>{open && <ResultsMappingDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'resultsMapping',
  position: 'right',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: ResultsMapping,
};
