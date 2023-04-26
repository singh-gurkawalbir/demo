import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, Typography, AccordionSummary, AccordionDetails, Accordion } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import { isDisplayRefSupportedType } from '../../../../utils/httpConnector';
import actions from '../../../../actions';
import FormView from './FormView';
import RawView from './RawView';
import ExpandMoreIcon from '../../../icons/ArrowDownIcon';
import useIntegration from '../../../../hooks/useIntegration';
import FormBuilderButton, { getSettingsEditorId } from '../../../FormBuilderButton';
import useSetSubFormShowValidations from '../../../../hooks/useSetSubFormShowValidations';
import { useUpdateParentForm } from '../DynaCsvGenerate_afe';
import useFormContext from '../../../Form/FormContext';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  divider: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  summaryLabel: {
    flexGrow: 1,
    alignSelf: 'center',
    color: theme.palette.secondary.main,
  },
  customWrapper: {
    boxShadow: 'none',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: theme.spacing(0.5),
  },
  accordianSummaryWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  renderErrorSettings: {
    marginBottom: theme.spacing(2),
    wordBreak: 'break-all',
  },
}));

export default function DynaSettings(props) {
  const {
    id,
    resourceContext,
    disabled,
    onFieldChange,
    sectionId,
    label = 'Custom settings',
    collapsed = true,
    fieldsOnly = false,
    formKey: parentFormKey,
    flowId,
  } = props;
  const classes = useStyles();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { resourceType, resourceId } = resourceContext;
  const settingsFormKey = `settingsForm-${resourceId}`;
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const integrationId = useIntegration(resourceType, resourceId);
  const formContext = useFormContext(parentFormKey);

  const isHttpConnectorResource = useSelector(state => selectors.isHttpConnector(state, resourceId, resourceType));

  const allowFormEdit = useSelector(state =>
    selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)
  );

  const hasSettingsForm = useSelector(state => {
    if (['exports', 'imports'].includes(resourceType)) {
      const settingsForm = selectors.resourceData(state, resourceType, resourceId)?.merged?.settingsForm;
      // TODO : need to include in the existing selector
      const hasFormData = !!(settingsForm && (settingsForm.form || settingsForm.init));

      return hasFormData;
    }

    return selectors.hasSettingsForm(state, resourceType, resourceId, sectionId);
  });

  const handleResourceFormRemount = useCallback(() => {
    if (!isDisplayRefSupportedType(resourceType) || !isHttpConnectorResource) {
      return;
    }
    // Do this change only for http connector simple view as display after effects only there
    const allTouchedFields = Object.values(formContext.fields)
      .filter(field => !!field.touched)
      .map(field => ({ id: field.id, value: field.value }));

    //  TODO: Even previous end point's fields are being shown when passed allTouchedFields - check with ashok
    dispatch(
      actions.resourceForm.init(
        resourceType,
        resourceId,
        false,
        false,
        flowId,
        allTouchedFields
      )
    );
  }, [dispatch, formContext.fields, resourceId, resourceType, isHttpConnectorResource, flowId]);

  const handleSettingFormChange = useCallback(
    (values, isValid, skipFieldTouched) => {
      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...values, __invalid: true }, skipFieldTouched);
      } else {
        onFieldChange(id, values, skipFieldTouched);
      }
      // dispatch(
      //   action.formFieldChange(formId, fieldId, newValue, shouldTouch, isValid)
      // );
    },
    [id, onFieldChange]
  );

  useUpdateParentForm(hasSettingsForm ? settingsFormKey : '', handleSettingFormChange);

  useSetSubFormShowValidations(parentFormKey, hasSettingsForm ? settingsFormKey : '');
  // TODO: @Surya revisit this implementation of settings form
  // directly register field states

  const handleExpandClick = useCallback(() => {
    // HACK! to overcome event bubbling.
    // We don't want child views affecting the panel state.
    // TODO: Our mistake here is that the formBuilder drawer
    // is a child of the summary panel.
    if (match.isExact) {
      setIsCollapsed(!isCollapsed);
    }
  }, [isCollapsed, match]);
  const customSettingsEditorId = getSettingsEditorId(resourceId, sectionId);
  const editorSaveStatus = useSelector(state => selectors.editor(state, customSettingsEditorId)?.saveStatus);
  const [remountFormView, setRemountFormView] = useState(0);

  useEffect(() => {
    // when you a settings through the editor after it completes u perform a remount
    if (editorSaveStatus === 'success') {
      handleResourceFormRemount();
      setRemountFormView(count => count + 1);
    }
  }, [editorSaveStatus, handleResourceFormRemount]);
  // Only developers can see/edit raw settings!
  // thus, if there is no settings form and the user is not a dev, render nothing.
  if (!allowFormEdit && !hasSettingsForm) {
    return null;
  }

  function renderSettings() {
    if (hasSettingsForm) {
      return (
        <FormView
          key={remountFormView}
          resourceId={resourceId}
          resourceType={resourceType}
          sectionId={sectionId}
          disabled={disabled}
          className={classes.renderErrorSettings}
      />
      );
    }

    return <RawView {...props} />;
  }

  if (fieldsOnly) return renderSettings();

  // We are not in edit mode, devs and non-devs alike should see the settings form if it exists.
  return (
    <div className={classes.customWrapper}>
      <Accordion expanded={!isCollapsed} elevation={0}>
        <div className={classes.accordianSummaryWrapper}>
          <AccordionSummary
            data-test={label}
            onClick={handleExpandClick}
            expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.summaryLabel}>{label}</Typography>
          </AccordionSummary>
          {!isCollapsed && (
          <FormBuilderButton resourceType={resourceType} resourceId={resourceId} integrationId={integrationId} />
          )}
        </div>
        <AccordionDetails >
          {renderSettings()}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
