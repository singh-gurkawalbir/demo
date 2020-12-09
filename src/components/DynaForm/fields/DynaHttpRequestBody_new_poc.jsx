/* eslint-disable react/jsx-pascal-case */
import { FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { /* useMemo, */ Fragment, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { /* useSelector, */ useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
// import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
// import usePushRightDrawer from '../../../hooks/usePushRightDrawer';
// import { selectors } from '../../../reducers';
// import lookupUtil from '../../../utils/lookup';
// import useFormContext from '../../Form/FormContext';
import FieldHelp from '../FieldHelp';
// should be in AFE2/Drawer/actions + AFE2/metadata/[editor]
// import DynaLookupEditor from './DynaLookupEditor';
import ErroredMessageComponent from './ErroredMessageComponent';
import actions from '../../../actions';
// import _AFE2EditorDrawer_ from '../../AFE/AFE2Editor/new';
// unless we want to embed an editor in a page, we dont ned to
// reference it diretly. We jsut ned to open the drawer.
// import Editor from '../../AFE2/Editor';

const useStyles = makeStyles({
  dynaHttpRequestBodyWrapper: {
    width: '100%',
  },
  dynaHttpRequestlabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaReqBodyBtn: {
    maxWidth: 100,
  },
  dynaHttpReqLabel: {
    marginBottom: 6,
  },
});

export default function _DynaHttpRequestBody_(props) {
  const {
    id,
    onFieldChange,
    // options = {},
    value,
    label,
    resourceId,
    resourceType,
    flowId,
    arrayIndex,

    // Is supportLookup really necessary in our metadata? Can't we determine
    // this in the proposed new /AFE2/Drawer/actions/LookupEditor component?
    // or even calculated during the init of this editor?
    // supportLookup = true,

    // is this really field metdata? or is this really editor metadata?
    // disableEditorV2 = false,
    // enableEditorV2 = false,

    formKey,
    // disabled,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  // const formContext = useFormContext(formKey);
  // const handleOpenDrawer = usePushRightDrawer();
  // const { merged: resourceData = {} } = useSelectorMemo(
  //   selectors.makeResourceDataSelector,
  //   resourceType,
  //   resourceId
  // );

  // unnecessary to have this in the Dyna fields...
  // const isEditorV2Supported = useSelector(state => {
  //   if (disableEditorV2) {
  //     return false;
  //   }
  //
  //   return selectors.isEditorV2Supported(state, resourceId, resourceType, flowId, enableEditorV2);
  // });

  // This is not needed... it was simply used to pass a value to the drawer from the state.
  // the drawer itself can use this selector
  //  const editorDataVersion = useSelector(state => selectors._editorDataVersion(state, id));

  // const { /* adaptorType, */ _connectionId: connectionId } = resourceData;
  // const connectionMediaType = useSelector(state => {
  //   const connection =
  //     selectors.resource(state, 'connections', connectionId) || {};
  //
  //   return connection.type === 'http' ? connection.http?.mediaType : connection.rest?.mediaType;
  // });

  // const contentType = options.contentType || props.contentType || connectionMediaType;

  const formattedRule = Array.isArray(value) ? value[arrayIndex] : value;

  // This should moved to /AFE2/Drawer/actions/LookupEditor
  // const lookups =
  //   useMemo(() => supportLookup &&
  //   resourceType === 'imports' &&
  //   lookupUtil.getLookupFromFormContext(formContext, adaptorType), [adaptorType, formContext, resourceType, supportLookup]);

  // This seems like it belongs as a drawer action under the new pattern in AFE2/Drawer/action
  // folder.
  // const action = useMemo(() => {
  //   if (!supportLookup || resourceType !== 'imports') {
  //     return;
  //   }
  //
  //   const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);
  //
  //   if (!lookupFieldId) return;
  //
  //   return (
  //     <DynaLookupEditor
  //       id={lookupFieldId}
  //       label="Manage lookups"
  //       value={lookups}
  //       onFieldChange={onFieldChange}
  //       flowId={flowId}
  //       resourceType={resourceType}
  //       resourceId={resourceId}
  // />
  //   );
  // }, [adaptorType, flowId, lookups, onFieldChange, resourceId, resourceType, supportLookup]);

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    // TODO: Give better name for arrayIndex
    if (typeof arrayIndex === 'number' && Array.isArray(value)) {
      // save to array at position arrayIndex
      const valueTmp = value;

      valueTmp[arrayIndex] = rule;
      onFieldChange(id, valueTmp);
    } else {
      // save to field
      onFieldChange(id, rule);
    }
  }, [arrayIndex, id, onFieldChange, value]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(id, 'handlebars', {
      rule: typeof formattedRule === 'string' ? formattedRule : JSON.stringify(formattedRule, null, 2),

      // This seems like another candidate to calculate during the
      // data-layer init process.
      // resultMode: contentType === 'json' ? 'json' : 'xml',

      // interesting. How do we use formKey?
      formKey,

      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',

      // This field seems like it could be calculated in the data-layer?
      // isEditorV2Supported,

      // Propose to push the save callback into the editor state so that
      // we have a single implementation of save button in all editors...
      // If this callback exists, we call it, otherwise we default to the
      // foreground/background save logic in the processor logic.
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${id}`);

    // handleOpenDrawer(id);
  }, [dispatch, id, formattedRule, formKey, flowId, resourceId, resourceType, handleSave, history, match.url]);

  return (
    <Fragment key={`${resourceId}-${id}`}>
      {/* The editor drawer is universal and each dyna field should not need to
        include it within its JSX. Think of all the extra drawers being rendered
        in a single form if there are many fields with editors... and only 1 can
        be open at a time, so its wasteful to have multiple components in the
        tree.

      <_AFE2EditorDrawer_
        flowId={flowId}
        title={label}
        onSave={handleSave}
        action={action}
        path={id}
        id={id}
        disabled={disabled}
        editorVersion={editorDataVersion}>
        <Editor
          lookups={lookups}
          disabled={disabled}
        />
      </_AFE2EditorDrawer_>
      */}

      <div className={classes.dynaHttpRequestBodyWrapper}>
        <div className={classes.dynaHttpRequestlabelWrapper}>
          <FormLabel className={classes.dynaHttpReqLabel}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaReqBodyBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>
      </div>
      <ErroredMessageComponent {...props} />
    </Fragment>
  );
}
