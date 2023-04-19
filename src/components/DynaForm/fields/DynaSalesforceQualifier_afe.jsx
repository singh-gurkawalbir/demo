/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { TextField, FormControl, FormLabel } from '@mui/material';
import { isEmpty } from 'lodash';
import ActionButton from '../../ActionButton';
import FilterIcon from '../../icons/FilterIcon';
import FieldMessage from './FieldMessage';
import FieldHelp from '../FieldHelp';
import { getValidRelativePath } from '../../../utils/routePaths';
import actions from '../../../actions';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  salesforceFormControl: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  exitButtonSalesforceQualifier: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
  dynaSalesforceQualifierWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  textField: {
    width: '100%',
  },
  salesforceQualifierLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

export default function DynaSalesforceQualifier_afe(props) {
  const classes = useStyles();
  const {
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    resourceId,
    flowId,
    label,
    options: propsOptions,
    formKey,
    resourceType,
    connectionId,
    sObjectTypeFieldId = 'salesforce.sObjectType',
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const sObjectTypeField = useSelector(state => selectors.formState(state, formKey)?.fields?.[sObjectTypeFieldId]);
  const options = !isEmpty(propsOptions) ? propsOptions : {
    sObjectType: sObjectTypeField?.value,
    hasSObjectType: !!sObjectTypeField?.value,
    commMetaPath: sObjectTypeField
      ? `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectTypeField.value}`
      : '',
    resetValue:
      sObjectTypeField &&
      sObjectTypeField.value !== sObjectTypeField.defaultValue,
  };

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    onFieldChange(id, rule);
  }, [id, onFieldChange]);
  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'salesforceQualificationCriteria', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      onSave: handleSave,
      // we don't need sample data here,
      // hence adding dummy data to stop the saga from requesting the same
      data: 'dummy data',
      customOptions: options,
      connectionId,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, flowId, formKey, handleSave, history, id, match.url, resourceId, resourceType, options, connectionId]);

  return (
    <div className={classes.dynaSalesforceQualifierWrapper}>
      <div className={classes.textField}>
        <div className={classes.salesforceQualifierLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <FormControl variant="standard" className={classes.salesforceFormControl}>
          <TextField
            key={id}
            name={name}
            fullWidth
            placeholder={placeholder}
            disabled
            required={required}
            error={!isValid}
            value={value || ''}
            variant="filled"
          />
          <FieldMessage
            isValid={isValid}
            errorMessages={errorMessages}
          />
        </FormControl>
      </div>
      <ActionButton
        disabled={!options?.hasSObjectType}
        data-test={id}
        onClick={handleEditorClick}
        className={classes.exitButtonSalesforceQualifier}>
        <FilterIcon />
      </ActionButton>
    </div>
  );
}
