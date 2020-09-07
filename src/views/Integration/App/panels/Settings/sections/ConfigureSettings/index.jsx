import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../../forms/utils';
import LoadResources from '../../../../../../../components/LoadResources';
import { IAFormStateManager, useActiveTab } from '../../../Flows';
import useIASettingsStateWithHandleClose from '../../../../../../../hooks/useIASettingsStateWithHandleClose';
import { SavingMask } from '../../../../../../SuiteScript/Integration/App/panels/Settings/sections/ConfigureSettings';

const useStyles = makeStyles(theme => ({
  configureform: {
    minHeight: 300,
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

export default function ConfigureSettings({ integrationId, storeId, sectionId, parentUrl }) {
  const classes = useStyles();
  const section = useSelector(state => {
    const flowSections = selectors.integrationAppFlowSections(
      state,
      integrationId,
      storeId
    );

    return flowSections.find(s => s.titleId === sectionId);
  }, shallowEqual);

  const flowSettingsMeta = useSelector(
    state =>
      selectors.integrationAppSectionMetadata(
        state,
        integrationId,
        sectionId,
        storeId
      ),
    shallowEqual
  );
  const translatedMeta = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        flowSettingsMeta,
        integrationId,
        true
      ),
    [flowSettingsMeta, integrationId]
  );
  const { formState } = useIASettingsStateWithHandleClose(
    integrationId,
    null,
    sectionId,
    parentUrl
  );
  const activeTabProps = useActiveTab();

  return (
    <LoadResources
      required
      resources={['flows', 'exports', 'imports', 'connections']}>
      {formState?.saveStatus && <SavingMask />}
      <IAFormStateManager
        {...activeTabProps}
        key={storeId}
        formState={formState}
        className={clsx(classes.configureform, {
          [classes.configureCamForm]: section.sections,
        })}
        isIAForm
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
        fieldMeta={translatedMeta}
        orientation="horizontal"
        />
    </LoadResources>
  );
}
