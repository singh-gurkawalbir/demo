import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Button } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import DrawerTitleBar from '../../../../drawer/TitleBar';
import DynaForm from '../../..';
import DynaSubmit from '../../../DynaSubmit';
import actions from '../../../../../actions';
import getFormFieldMetadata from './util';
import { SCOPES } from '../../../../../sagas/resourceForm';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 624,
    marginTop: theme.appBarHeight,
    paddingBottom: theme.appBarHeight,
    border: 'solid 1px',
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
  },
  root: {
    padding: theme.spacing(0),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.common.white,
  },
  container: {
    display: 'flex',
    height: '100%',
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3, 3, 1, 3),
    overflowX: 'scroll',
  },
  subRecordDynaForm: {
    minHeight: 'calc(100% - 56px)',
    padding: '0px !important',
  },
}));

function SubRecordDrawer(props) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { fieldId } = match.params;
  const { resourceContext, flowId, connectionId, recordType } = props;
  const recordTypeObj = useSelector(state =>
    selectors
      .metadataOptionsAndResources(state, {
        connectionId,
        commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
        filterKey: 'suitescript-recordTypes',
      })
      .data.find(record => record.value === recordType)
  );
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const recordTypeLabel = recordTypeObj && recordTypeObj.label;
  const subrecordFields =
    recordTypeObj &&
    recordTypeObj.subRecordConfig &&
    recordTypeObj.subRecordConfig.map(f => ({
      ...f,
      value: f.id,
      label: f.name,
      subRecordJsonPathLabel:
        f.subRecordJsonPathLabel || 'Path to node that contains items data',
    }));
  const { subrecords } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'imports',
    resourceContext.resourceId
  ).merged.netsuite_da;
  const fieldMeta = getFormFieldMetadata(
    recordTypeLabel,
    subrecords,
    subrecordFields,
    fieldId,
    flowId,
    resourceContext.resourceId
  );
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);
  const handleSubmit = useCallback(
    formValues => {
      const jsonPathFieldId = `jsonPath_${formValues.fieldId.replace(
        '[*].',
        '_sublist_'
      )}`;
      const updatedFormValues = {
        fieldId: `${formValues.fieldId}`,
        jsonPath: formValues[jsonPathFieldId],
      };
      const recordType = subrecordFields.find(
        fld => fld.value === formValues.fieldId
      ).subRecordType;

      updatedFormValues.recordType = recordType;

      const updatedSubrecords = subrecords || [];

      if (fieldId) {
        const srIndex = updatedSubrecords.findIndex(
          sr => sr.fieldId === fieldId
        );

        if (srIndex > -1) {
          updatedSubrecords[srIndex] = { ...updatedFormValues, fieldId };
        }
      } else {
        updatedSubrecords.push(updatedFormValues);
      }

      dispatch(
        actions.resource.patchStaged(
          resourceContext.resourceId,
          [
            {
              op: 'replace',
              path: '/netsuite_da/subrecords',
              value: updatedSubrecords,
            },
          ],
          SCOPES.VALUE
        )
      );
      history.goBack();

      // onSubmit(updatedFormValues);
    },
    [
      dispatch,
      fieldId,
      history,
      resourceContext.resourceId,
      subrecordFields,
      subrecords,
    ]
  );

  return (
    <Drawer
      anchor="right"
      open={!!match}
      classes={{
        paper: clsx(classes.drawerPaper),
      }}
      onClose={handleClose}>
      <DrawerTitleBar
        title={fieldId ? 'Edit subrecord import' : 'Add subrecord import'}
        backToParent
      />

      <div className={classes.container}>
        <div className={classes.content}>
          {fieldMeta && (
            <DynaForm
              // disabled={disabled}
              className={classes.subRecordDynaForm}
              fieldMeta={fieldMeta}
              formState={formState}>
              <DynaSubmit
                data-test="save-subrecord"
                showCustomFormValidations={showCustomFormValidations}
                onClick={handleSubmit}>
                Save
              </DynaSubmit>
              <Button
                variant="text"
                color="primary"
                data-test="cancel-subrecord"
                onClick={handleClose}>
                Cancel
              </Button>
            </DynaForm>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default function SubRecordDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route
      exact
      path={[`${match.url}/subrecords/`, `${match.url}/subrecords/:fieldId`]}>
      <SubRecordDrawer {...props} />
    </Route>
  );
}
