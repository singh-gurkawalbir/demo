import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../../forms/formFactory/utils';
import LoadResources from '../../../../../../../components/LoadResources';
import { IAFormStateManager } from '../../../Flows';
import { SavingMask } from '../../../../../../SuiteScript/Integration/App/panels/Settings/sections/ConfigureSettings';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import { FORM_SAVE_STATUS } from '../../../../../../../constants';
import IsLoggableContextProvider from '../../../../../../../components/IsLoggableContextProvider';

const useStyles = makeStyles(theme => ({
  configureform: {
    minHeight: 300,
    overflow: 'visible',
    padding: theme.spacing(2, 3),
    '& + div': {
      padding: theme.spacing(2, 0),
      margin: theme.spacing(0, 3),
    },
    '& > * div.MuiTabs-horizontal': {
      marginTop: theme.spacing(-2),
      marginLeft: theme.spacing(-3),
    },
  },
  configureCamForm: {
    minHeight: 300,
  },
}));

export default function ConfigureSettings({ integrationId, childId, sectionId }) {
  const classes = useStyles();
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId);
  const section = useMemo(() => flowSections.find(s => s.titleId === sectionId), [flowSections, sectionId]);
  const flowSettingsMeta = useSelectorMemo(selectors.mkIntegrationAppSectionMetadata,
    integrationId,
    sectionId,
    childId);

  const translatedMeta = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        flowSettingsMeta,
        integrationId,
        true,
        {childId}
      ),
    [flowSettingsMeta, childId, integrationId]
  );
  const formState = useSelector(
    state =>
      selectors.integrationAppSettingsFormState(
        state,
        integrationId,
        null,
        sectionId
      ),
    shallowEqual
  );

  return (
    <LoadResources
      required
      integrationId={integrationId}
      resources={['connections', 'flows', 'exports', 'imports']}>
      {formState?.formSaveStatus === FORM_SAVE_STATUS.LOADING && <SavingMask />}
      <IsLoggableContextProvider isLoggable>
        <IAFormStateManager
          key={childId}
          formState={formState}
          className={clsx(classes.configureform, {
            [classes.configureCamForm]: section.sections,
          })}
          isIAForm
          integrationId={integrationId}
          childId={childId}
          sectionId={sectionId}
          fieldMeta={translatedMeta}
          orientation="horizontal"
        />
      </IsLoggableContextProvider>
    </LoadResources>
  );
}
