import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Drawer } from '@material-ui/core';
import actions from '../../../actions';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import DrawerTitleBar from '../../drawer/TitleBar';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
  },
  formStep: {
    padding: 24,
  },
}));

export default function FormStep({ integrationId, installerFunction, formMeta, title, formSubmitHandler, formCloseHandler }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    formVal => {
      installerFunction
        ? dispatch(
          actions.integrationApp.installer.installStep(
            integrationId,
            installerFunction,
            undefined,
            undefined,
            formVal
          )
        )
        : dispatch(
          actions.integrationApp.installer.scriptInstallStep(
            integrationId,
            '',
            '',
            formVal
          )
        );
    },
    [dispatch, installerFunction, integrationId]
  );
  const onClose = useCallback(() => {
    dispatch(
      actions.integrationApp.installer.updateStep(integrationId, '', 'failed')
    );
  }, [dispatch, integrationId]);

  const formKey = useFormInitWithPermissions({ fieldMeta: formMeta });

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
  //      >
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
      <div className={classes.formStep} >

        <DynaForm formKey={formKey} />
        <DynaSubmit
          formKey={formKey}
          onClick={formSubmitHandler || handleSubmit}>
          Submit
        </DynaSubmit>
      </div>
    </Drawer>
  );
}
