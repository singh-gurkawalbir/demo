import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import useTraceUpdate from 'use-trace-update';
import { selectors } from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';
import PanelHeader from '../../../../../../components/PanelHeader';
import { IAFormStateManager, useActiveTab } from '../../Flows';
import { SavingMask } from '../../../../../SuiteScript/Integration/App/panels/Settings/sections/ConfigureSettings';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  configureform: {
    padding: theme.spacing(2, 3),
    overflow: 'visible',
    minHeight: 250,
    '& + div': {
      padding: theme.spacing(2, 0),
      margin: theme.spacing(0, 3),
    },
    '& > * div.MuiTabs-horizontal': {
      marginTop: theme.spacing(-2),
      marginLeft: theme.spacing(-3),
    },
  },
}));

export default function GeneralPanel({ integrationId, storeId }) {
  const classes = useStyles();
  // TODO: rethink our data-layer just as we would an API. Currently we
  // have selectors that do too much and as such, they are wasteful and
  // hard to understand and reuse. In this example, this component doesn't
  // need the flows returned by the selector.
  const generalSectionMetadata = useSelectorMemo(
    selectors.mkIntegrationAppGeneralSettings, integrationId, storeId
  );
  const hasGeneralSettings = useSelector(state =>
    selectors.hasGeneralSettings(state, integrationId, storeId)
  );
  const translatedMeta = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        generalSectionMetadata,
        integrationId,
        true
      ),
    [generalSectionMetadata, integrationId]
  );
  const formState = useSelector(
    state => selectors.integrationAppSettingsFormState(state, integrationId),
    shallowEqual
  );
  const activeTabProps = useActiveTab();

  useTraceUpdate({generalSectionMetadata});

  console.log('check rerernder', generalSectionMetadata);

  return (
    <div>
      <PanelHeader title="General" />
      {hasGeneralSettings && (
      <>
        {formState?.saveStatus && <SavingMask />}

        <IAFormStateManager
          {...activeTabProps}
          key={storeId}
          fieldMeta={translatedMeta}
          integrationId={integrationId}
          isIAForm
          className={classes.configureform}
          storeId={storeId}
          formState={formState}
          orientation="horizontal"
          />
      </>
      )}
    </div>
  );
}
