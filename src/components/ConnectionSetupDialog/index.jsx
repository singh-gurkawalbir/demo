import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconButton,
  Dialog,
  makeStyles,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ResourceForm from '../../components/ResourceFormFactory';
import CloseIcon from '../icons/CloseIcon';
import AddOrSelect from './AddOrSelect';

const useStyles = makeStyles(() => ({
  iconButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
  },
}));

export default function ConnectionModal(props) {
  const { _connectionId, onSubmitComplete, onClose, addOrSelect } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', _connectionId)
  );

  useEffect(() => {
    if (!connection) {
      dispatch(actions.resource.requestCollection('connections'));
    }
  }, [connection, dispatch]);

  if (!connection) {
    return null;
  }

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>
        Setup Connection
        {onClose && (
          <IconButton
            onClick={onClose}
            className={classes.iconButton}
            autoFocus>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent style={{ width: '60vw' }}>
        {!addOrSelect && (
          <ResourceForm
            editMode={false}
            resourceType="connections"
            resourceId={_connectionId}
            onSubmitComplete={onSubmitComplete}
            connectionType={connection.type}
          />
        )}
        {addOrSelect && <AddOrSelect {...props} />}
      </DialogContent>
    </Dialog>
  );
}
