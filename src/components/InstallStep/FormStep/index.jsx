import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Drawer } from '@material-ui/core';
import actions from '../../../actions';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import DrawerTitleBar from '../../drawer/TitleBar';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 660,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function FormStep({ integrationId, formMeta, title, formSubmitHandler, formCloseHandler }) {
  const classes = useStyles();
  const dispatch = useDispatch();
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
  // TODO: @ashu, this needs to be reverted to use RightDrawer,
  // once the path issue (matching store path) is fixed
  // <RightDrawer
  //   path={path || `form/${index}`}
  //   height="tall"
  //   width="large"
  //   title={title}
  //   variant="temporary"
  //   onClose={formCloseHandler || onClose}>
  //   <DynaForm fieldMeta={formMeta} formState={formState}>
  //     <DynaSubmit
  //       onClick={formSubmitHandler || handleSubmit}
  //       showCustomFormValidations={showCustomFormValidations}>
  //       Submit
  //     </DynaSubmit>
  //   </DynaForm>
  // </RightDrawer>

    <Drawer
      anchor="right"
      open
      classes={{
        paper: classes.drawerPaper,
      }}
      >
      <DrawerTitleBar title={title} onClose={formCloseHandler || onClose} />
      <DynaForm fieldMeta={formMeta} formState={formState}>
        <DynaSubmit
          onClick={formSubmitHandler || handleSubmit}
          showCustomFormValidations={showCustomFormValidations}>
          Submit
        </DynaSubmit>
      </DynaForm>
    </Drawer>
  );
}
