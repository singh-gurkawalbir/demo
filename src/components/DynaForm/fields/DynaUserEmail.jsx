import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ChangeEmail from '../../../views/MyAccount/ChangeEmail';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/EditIcon';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles({
  editUserEmailWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  editUserEmailLabelWrapper: {
    alignItems: 'flex-start',
    display: 'flex',
  },
  editUserEmailField: {
    width: '100%',
  },
});

function DynaUserEmail(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    openEmailModal: false,
  });
  const dispatch = useDispatch();
  const clearComms = () => dispatch(actions.clearComms());
  const handleOpenModal = modalKey => {
    clearComms();
    setState({ ...state, [modalKey]: true });
  };

  const handleCloseModal = modalKey => {
    setState({ ...state, [modalKey]: false });
  };

  const { id, value, label } = props;

  return (
    <FormControl>
      <div className={classes.editUserEmailLabelWrapper}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <div className={classes.editUserEmailWrapper}>
        <TextField
          id={id}
          type="email"
          value={value}
          disabled
          className={classes.editUserEmailField}
          variant="filled"
        />
        <ActionButton
          data-test="editEmail"
          color="primary"
          variant="contained"
          onClick={() => handleOpenModal('openEmailModal')}>
          <EditIcon />
        </ActionButton>
      </div>
      <ChangeEmail
        show={state.openEmailModal}
        onClose={() => handleCloseModal('openEmailModal')}
      />
    </FormControl>
  );
}

export default DynaUserEmail;
