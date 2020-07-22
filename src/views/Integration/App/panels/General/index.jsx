import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../forms/utils';
import PanelHeader from '../../../../../components/PanelHeader';
import { IAFormStateManager } from '../Flows';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    paddingBottom: theme.spacing(1),
  },
  formContent: {
    padding: theme.spacing(0, 2),
  },
  formGeneralPanel: {
    minHeight: 250,
  },
}));

export default function GeneralPanel({ integrationId, storeId }) {
  const classes = useStyles();
  // TODO: rethink our data-layer just as we would an API. Currently we
  // have selectors that do too much and as such, they are wasteful and
  // hard to understand and reuse. In this example, this component doesn't
  // need the flows returned by the selector.
  const generalSectionMetadata = useSelector(state =>
    selectors.integrationAppGeneralSettings(state, integrationId, storeId)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationId, storeId]
  );
  const formState = useSelector(
    state => selectors.integrationAppSettingsFormState(state, integrationId),
    shallowEqual
  );

  return (
    <div className={classes.root}>
      <PanelHeader title="General" />

      <div className={classes.formContent}>
        {hasGeneralSettings && (
          <IAFormStateManager
            key={storeId}
            fieldMeta={translatedMeta}
            integrationId={integrationId}
            isIAForm
            className={classes.formGeneralPanel}
            storeId={storeId}
            formState={formState}
          />
        )}
      </div>
    </div>
  );
}
