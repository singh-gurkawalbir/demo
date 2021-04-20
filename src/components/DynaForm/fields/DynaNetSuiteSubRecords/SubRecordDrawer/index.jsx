import { Button, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import DynaForm from '../../..';
import actions from '../../../../../actions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../../reducers';
import { SCOPES } from '../../../../../sagas/resourceForm';
import DrawerTitleBar from '../../../../drawer/TitleBar';
import DynaSubmit from '../../../DynaSubmit';
import getFormFieldMetadata from './util';

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
    overflowX: 'auto',
  },
  subRecordDynaForm: {
    minHeight: 'calc(100% - 56px)',
    padding: '0px !important',
  },
  dynaSubmit: {
    marginRight: theme.spacing(1),
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
  // eslint-disable-next-line camelcase
  )?.merged?.netsuite_da;
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
  const formKey = useFormInitWithPermissions({
    fieldMeta,
  });

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
            <>
              <DynaForm
                formKey={formKey}
                className={classes.subRecordDynaForm}
              />
              <DynaSubmit
                formKey={formKey}
                data-test="save-subrecord"
                className={classes.dynaSubmit}
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
            </>
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
