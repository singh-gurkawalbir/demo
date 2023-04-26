import React, { useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Drawer, Button } from '@mui/material';
import { selectors } from '../../../../../../reducers';
import DrawerTitleBar from '../../../../../drawer/TitleBar';
import DynaForm from '../../../..';
import DynaSubmit from '../../../../DynaSubmit';
import actions from '../../../../../../actions';
import { getFormFieldMetadata } from './util';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import EditorDrawer from '../../../../../AFE/Drawer';
import customCloneDeep from '../../../../../../utils/customCloneDeep';

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
    backgroundColor: theme.palette.background.paper,
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
}));

function SubRecordDrawer(props) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { referenceFieldId } = match.params;
  const { resourceContext, flowId, connectionId, recordType } = props;
  const recordTypeObj = useSelector(state =>
    selectors
      .metadataOptionsAndResources(state, {
        connectionId,
        commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
        filterKey: 'suitescript-recordTypes',
      })
      .data?.find(record => record.value === recordType)
  );
  const referenceFields = useSelector(state =>
    selectors
      .metadataOptionsAndResources(state, {
        connectionId,
        commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`,
        filterKey: 'suitescript-subrecord-referenceFields',
      }).data
  );

  useEffect(() => {
    if (!referenceFields || referenceFields.length === 0) {
      dispatch(actions.metadata.request(connectionId, `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`));
    }
  }, [connectionId, dispatch, recordType, referenceFields]);

  const recordTypeLabel = recordTypeObj && recordTypeObj.label;
  const flow = useSelector(state =>
    selectors.suiteScriptResourceData(state,
      {
        resourceType: 'flows',
        id: resourceContext.resourceId,
        ssLinkedConnectionId: connectionId,
      }
    ).merged
  );
  const {fieldMeta, optionsHandler} = getFormFieldMetadata(
    recordTypeLabel,
    flow.import.netsuite.subRecordImports,
    referenceFields || [],
    referenceFieldId,
    flowId,
    connectionId,
    flow._integrationId
  );
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmit = useCallback(
    formValues => {
      const updatedFormValues = { ...formValues };

      updatedFormValues.internalIdLookup = {
        expression: updatedFormValues.internalIdLookupExpression && JSON.parse(updatedFormValues.internalIdLookupExpression),
      };
      delete updatedFormValues.internalIdLookupExpression;
      const updatedSubrecords = customCloneDeep(flow?.import?.netsuite?.subRecordImports || []);

      if (referenceFieldId) {
        const srIndex = updatedSubrecords.findIndex(
          sr => sr.referenceFieldId === referenceFieldId
        );

        if (srIndex > -1) {
          updatedSubrecords[srIndex] = { ...updatedSubrecords[srIndex], ...updatedFormValues, referenceFieldId };
        }
      } else {
        updatedSubrecords.push({...updatedFormValues, mapping: {}});
      }

      dispatch(
        actions.suiteScript.resource.patchStaged(
          connectionId,
          'flows',
          resourceContext.resourceId,
          [
            {
              op: 'replace',
              path: '/import/netsuite/subRecordImports',
              value: updatedSubrecords,
            },
          ],
        )
      );
      history.goBack();
    },
    [flow?.import?.netsuite?.subRecordImports, referenceFieldId, dispatch, connectionId, resourceContext.resourceId, history]
  );
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    optionsHandler,
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
        title={referenceFieldId ? 'Edit subrecord import' : 'Add subrecord import'}
        backToParent />
      <div className={classes.container}>
        <div className={classes.content}>
          {fieldMeta && (
            <>
              <DynaForm
                formKey={formKey}
                className={classes.subRecordDynaForm} />

              <DynaSubmit
                formKey={formKey}
                data-test="save-subrecord"
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
      <EditorDrawer />
    </Drawer>
  );
}

export default function SubRecordDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route
      // exact
      path={[`${match.url}/subrecords/`, `${match.url}/subrecords/:referenceFieldId`]}>
      <SubRecordDrawer {...props} />
    </Route>
  );
}
