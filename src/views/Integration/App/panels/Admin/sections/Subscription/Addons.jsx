import React, { useMemo } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import moment from 'moment';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import CeligoTable from '../../../../../../../components/CeligoTable';
import AddonInstallerButton from './AddonInstallerButton';
import InfoIconButton from '../../../../../../../components/InfoIconButton';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../../../../reducers';
import { useGetTableContext } from '../../../../../../../components/CeligoTable/TableContext';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';

const metadata = {
  useColumns: () => {
    const { supportsMultiStore, childId, storeLabel, children } = useGetTableContext();
    const dateFormat = useSelector(state => selectors.userProfilePreferencesProps(state)?.dateFormat);

    let columns = [
      {
        key: 'name',
        heading: 'Name',
        isLoggable: true,
        Value: ({rowData: r}) => (
          <>
            {r?.name}
            <InfoIconButton info={r.description} escapeUnsecuredDomains size="xs" />
          </>
        ),
      },
      {
        key: 'storeLabel',
        heading: storeLabel,
        isLoggable: true,
        Value: ({rowData: r}) => children.find(c => c.value === r.storeId)?.label || r.storeId,
      },
      {
        key: 'installedOn',
        heading: 'Installed on',
        Value: ({rowData: r}) => r.installedOn ? moment(r.installedOn).format(dateFormat || 'MMM D, YYYY') : '',
        isLoggable: true,
      },
      {
        key: 'action',
        heading: 'Action',
        isLoggable: true,
        Value: ({rowData: r}) => <AddonInstallerButton resource={r} />,
      },
    ];

    if (!supportsMultiStore || childId) {
      columns = columns.filter(c => c.heading !== storeLabel);
    }

    return columns;
  },
};

const useStyles = makeStyles(theme => ({
  header: {
    background: theme.palette.background.paper,
    textAlign: 'left',
    padding: theme.spacing(1, 2),
    borderRadius: [4, 4, 0, 0],
  },
  message: {
    paddingBottom: theme.spacing(2),
    textAlign: 'left',
    paddingLeft: theme.spacing(2),
  },
  heading: {
    paddingBottom: theme.spacing(1),
  },
  content: {
    padding: '30px 30px 30px 0',
  },
  container: {
    padding: '0 0 30px 30px',
  },
  // TODO (Azhar) : Check the type and apply the css in the respective component
  button: {
    margin: theme.spacing(1),
    '&.Mui-disabled': {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.background.paper2,
      borderColor: theme.palette.background.paper2,
    },
  },
  item: {
    float: 'left',
  },
  planContent: {
    margin: 0,
    lineHeight: '16px',
  },
  customisedBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    textAlign: 'left',
  },
  leftBlock: {
    flexBasis: '80%',
  },
}));
const emptyObject = {};

export default function AddOns({integrationId, childId}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);
  const {
    supportsMultiStore,
    children,
    storeLabel,
  } = useMemo(() => {
    if (integration) {
      return {
        supportsMultiStore: !!integration.settings?.supportsMultiStore,
        children: integration.children,
        storeLabel: integration.settings?.storeLabel,
      };
    }

    return emptyObject;
  }, [integration]);

  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const subscribedAddOns = useSelector(state =>
    selectors.subscribedAddOns(state, integrationId, supportsMultiStore, childId)
  );

  const isLicenseExpired = useSelector(state => selectors.isIntegrationAppLicenseExpired(state, integrationId));

  const hasSubscribedAddOns = subscribedAddOns?.length > 0;
  const hasAddOns = addOnState?.addOns?.addOnMetaData?.length > 0;

  return (
    <>
      {hasAddOns && !hasSubscribedAddOns && (
      <div className={classes.customisedBlock}>
        <div className={classes.leftBlock}>
          <Typography variant="h4" className={classes.heading}>
            Add-ons
          </Typography>
          <Typography className={classes.message}>
            You don’t have any add-ons yet. Add-ons let you customize
            subscription to meet your specific business requirements.
          </Typography>
        </div>
        <div>
          <FilledButton
            className={classes.button}
            component={Link}
            disabled={isLicenseExpired}
            to={match.url.replace('/admin', '/addons')}>
            Get add-ons
          </FilledButton>
        </div>
      </div>
      )}
      {hasAddOns && hasSubscribedAddOns && (
      <>
        <div className={classes.header}>
          <Typography variant="h4" className={classes.heading}>
            Add-ons
          </Typography>
          <Typography variant="body2">
            Add-ons let you customize your subscription to meet your
            specific business requirements. They will expire when your
            Integration App subscription expires.
          </Typography>
        </div>

        <CeligoTable data={subscribedAddOns} {...metadata} actionProps={{ supportsMultiStore, childId, storeLabel, children }} />
      </>
      )}
    </>
  );
}
