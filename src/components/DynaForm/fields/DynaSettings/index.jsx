import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, Typography, AccordionSummary, AccordionDetails, Accordion } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import FormView from './FormView';
import RawView from './RawView';
import ExpandMoreIcon from '../../../icons/ArrowDownIcon';
import useIntegration from '../../../../hooks/useIntegration';
import FormBuilderButton from '../../../FormBuilderButton';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  divider: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  summaryContainer: {
    width: '100%',
  },
  summaryLabel: {
    flexGrow: 1,
    alignSelf: 'center',
    color: theme.palette.secondary.main,
  },
  customWrapper: {
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: theme.spacing(0.5),
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
  } = props;
  const classes = useStyles();
  const match = useRouteMatch();
  const { resourceType, resourceId } = resourceContext;
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const integrationId = useIntegration(resourceType, resourceId);
  const allowFormEdit = useSelector(state =>
    selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)
  );

  const hasSettingsForm = useSelector(state =>
    selectors.hasSettingsForm(state, resourceType, resourceId, sectionId)
  );

  const handleSettingFormChange = useCallback(
    (values, isValid) => {
      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...values, __invalid: true });
      } else {
        onFieldChange(id, values);
      }
      // dispatch(
      //   action.formFieldChange(formId, fieldId, newValue, shouldTouch, isValid)
      // );
    },
    [id, onFieldChange]
  );

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

  // Only developers can see/edit raw settings!
  // thus, if there is no settings form and the user is not a dev, render nothing.
  if (!allowFormEdit && !hasSettingsForm) {
    return null;
  }

  function renderSettings() {
    if (hasSettingsForm) {
      return (
        <FormView
          onFormChange={handleSettingFormChange}
          resourceId={resourceId}
          resourceType={resourceType}
          sectionId={sectionId}
          disabled={disabled}
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
        <AccordionSummary
          data-test={label}
          className={classes.summaryContainer}
          onClick={handleExpandClick}
          expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.summaryLabel}>{label}</Typography>
          {!isCollapsed && (
          <FormBuilderButton resourceType={resourceType} resourceId={resourceId} integrationId={integrationId} />
          )}
        </AccordionSummary>
        <AccordionDetails >
          {renderSettings()}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
