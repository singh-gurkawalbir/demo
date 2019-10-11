import { Dialog, Typography, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/InputFilterIcon';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function InputFilterDialog({
  flowId,
  resourceId,
  resourceType,
  open,
  onClose,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'inputFilter')
  );

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.fetchSampleData(
          flowId,
          resourceId,
          resourceType,
          'inputFilter'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.paper }}>
      <DialogTitle>Input Filter</DialogTitle>
      <Typography>flowId: {flowId}</Typography>
      <Typography>resourceId: {resourceId}</Typography>
      {sampleData && (
        <Typography> SampleData: {JSON.stringify(sampleData)}</Typography>
      )}
    </Dialog>
  );
}

function InputFilter(props) {
  const { open } = props;

  return <Fragment>{open && <InputFilterDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'inputFilter',
  left: -24,
  top: 28,
  // position: [left, right, bottom],
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: InputFilter,
};
