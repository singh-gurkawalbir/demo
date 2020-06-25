import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';
import LoadResources from '../../../../../../components/LoadResources';
import { IAFormStateManager } from '..';
import useIASettingsStateWithHandleClose from '../../../../../../hooks/useIASettingsStateWithHandleClose';

const useStyles = makeStyles(theme => ({
  configureform: {
    padding: theme.spacing(2, 3),
    '& + div': {
      padding: theme.spacing(2, 0),
      margin: theme.spacing(0, 3),
    },
    '& > * div.MuiTabs-horizontal': {
      marginTop: theme.spacing(-2),
      marginLeft: theme.spacing(-3),
    },
    '& > div[class*= "fieldsContainer"]': {
      height: '100%',
      '& > div[class*= "makeStyles-root"]': {
        paddingTop: theme.spacing(5),
        height: '100%',
        '& > div[class*= "panelContainer"]': {
          paddingBottom: theme.spacing(5),
        },
      },
    },
  },
  configureCamForm: {
    minHeight: '100%',
  },
}));

export default function Configure({ integrationId, storeId, sectionId, parentUrl }) {
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

  return (
    <LoadResources
      required
      resources={['flows', 'exports', 'imports', 'connections']}>
      <IAFormStateManager
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
