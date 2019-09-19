import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconButton,
  Dialog,
  SvgIcon,
  makeStyles,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ResourceForm from '../../components/ResourceFormFactory';

const useStyles = makeStyles(() => ({
  iconButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
  },
}));

export default function ConnectionModal(props) {
  const { _connectionId, onSubmitComplete, onClose } = props;
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
            <SvgIcon>
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </SvgIcon>
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent style={{ width: '60vw' }}>
        <ResourceForm
          editMode={false}
          resourceType="connections"
          resourceId={_connectionId}
          onSubmitComplete={onSubmitComplete}
          connectionType={connection.type}
        />
      </DialogContent>
    </Dialog>
  );
}
