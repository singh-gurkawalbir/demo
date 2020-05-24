import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Drawer, makeStyles, Button } from '@material-ui/core';
import actions from '../../actions';
import DrawerTitleBar from '../drawer/TitleBar';
import DynaSubmit from '../DynaForm/DynaSubmit';
import DynaForm from '../../components/DynaForm';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 824,
    padding: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: 'transparent',
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
  fieldContainer: {
    height: `calc(100vh - 202px)`,
  },
}));
const fieldMeta = {
  fieldMap: {
    email: {
      id: 'email',
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
    },
  },
  layout: {
    fields: ['email'],
  },
};

export default function InviteUser(props) {
  const { show, title = 'Invite user', stackId, onClose } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleInviteUser = useCallback(
    formVal => {
      const shareWithUserEmail = formVal.email;

      if (!shareWithUserEmail) {
        return;
      }

      dispatch(actions.stack.inviteStackShareUser(shareWithUserEmail, stackId));
      onClose();
    },
    [dispatch, onClose, stackId]
  );

  return (
    <Drawer
      anchor="right"
      open={show}
      classes={{
        paper: classes.drawerPaper,
      }}>
      <DrawerTitleBar onClose={onClose} title={title} backToParent />
      <div className={classes.content}>
        <DynaForm fieldMeta={fieldMeta} className={classes.fieldContainer}>
          <DynaSubmit
            data-test="saveInviteUser"
            id="saveInviteUser"
            onClick={handleInviteUser}>
            {`Invite user & close`}
          </DynaSubmit>
          <Button
            variant="text"
            color="primary"
            data-test="cancelInviteUser"
            label="Cancel"
            onClick={onClose}>
            Cancel
          </Button>
        </DynaForm>
      </div>
    </Drawer>
  );
}
