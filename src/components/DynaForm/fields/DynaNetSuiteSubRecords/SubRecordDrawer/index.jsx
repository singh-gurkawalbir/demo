import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Button } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import DrawerTitleBar from '../../../../drawer/TitleBar';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import actions from '../../../../../actions';
import getFormFieldMetadata from './util';
import { SCOPES } from '../../../../../sagas/resourceForm';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 624,
    marginTop: theme.appBarHeight,
    border: 'solid 1px',
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
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
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 3, 3, 0),
    overflowX: 'scroll',
  },
}));

function SubRecordDrawer(props) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { fieldId } = match.params;
  const { resourceContext, flowId, connectionId, recordType } = props;
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const recordTypeLabel = useSelector(
    state =>
      selectors
        .metadataOptionsAndResources({
          state,
          connectionId,
          commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
          filterKey: 'suitescript-recordTypes',
        })
        .data.find(record => record.value === recordType).label
  );
  const subrecords = useSelector(
    state =>
      selectors.resourceData(state, 'imports', resourceContext.resourceId)
        .merged.netsuite_da.subrecords,
    (left, right) => left && right && left.length === right.length
  );
  const subrecordFields = useSelector(
    state =>
      selectors.metadataOptionsAndResources({
        state,
        connectionId,
        commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`,
        filterKey: 'suitescript-subrecord-fields',
      }).data,
    (left, right) => left.length === right.length
  );

  useEffect(() => {
    if (connectionId && recordType) {
      dispatch(
        actions.metadata.request(
          connectionId,
          `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`
        )
      );
    }
  }, [connectionId, dispatch, recordType]);

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
              path: `/netsuite_da/subrecords`,
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
      />

      <div className={classes.container}>
        <div className={classes.content}>
          {fieldMeta && (
            <DynaForm
              // disabled={disabled}
              fieldMeta={fieldMeta}
              formState={formState}>
              <Button data-test="cancel-subrecord" onClick={handleClose}>
                Cancel
              </Button>
              <DynaSubmit
                data-test="save-subrecord"
                showCustomFormValidations={showCustomFormValidations}
                onClick={handleSubmit}>
                Save
              </DynaSubmit>
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
