import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Drawer } from '@material-ui/core';
import actions from '../../../actions';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import DrawerTitleBar from '../../drawer/TitleBar';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: theme.spacing(2),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
  drawerPaper: {
    width: 660,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function FormViewStep({ integrationId, formMeta }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);
  const handleSubmit = useCallback(
    formVal => {
      dispatch(
        actions.integrationApp.installer.scriptInstallStep(
          integrationId,
          '',
          '',
          formVal
        )
      );
    },
    [dispatch, integrationId]
  );
  const onClose = useCallback(() => {
    dispatch(
      actions.integrationApp.installer.updateStep(integrationId, '', 'failed')
    );
  }, [dispatch, integrationId]);

  return (
    <Drawer
      anchor="right"
      open
      classes={{
        paper: classes.drawerPaper,
      }}>
      <DrawerTitleBar title="Integration App Settings" onClose={onClose} />
      <div className={classes.form}>
        <DynaForm
          fieldMeta={formMeta}
          // resourceType="integrations"
          // resourceId={integrationId}
          formState={formState}>
          <DynaSubmit
            // resourceType="integrations"
            // resourceId={integrationId}
            onClick={handleSubmit}
            showCustomFormValidations={showCustomFormValidations}>
            Submit
          </DynaSubmit>
        </DynaForm>
      </div>
    </Drawer>
  );
}
