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

    let columns = [
      {
        key: 'name',
        heading: 'Name',
        Value: ({rowData: r}) => (
          <>
            {r?.name}
            <InfoIconButton info={r.description} size="xs" />
          </>
        ),
      },
      {
        key: 'storeLabel',
        heading: storeLabel,
        Value: ({rowData: r}) => children.find(c => c.value === r.storeId)?.label || r.storeId,
      },
      {
        key: 'installedOn',
        heading: 'Installed on',
        Value: ({rowData: r}) => r.installedOn ? moment(r.installedOn).format('MMM D, YYYY') : '',
      },
      {
        key: 'action',
        heading: 'Action',
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
  button: {
    margin: theme.spacing(1),
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
  const subscribedAddOns = addOnState?.addOns?.addOnLicenses?.filter(model => {
    if (supportsMultiStore) {
      return childId ? model.storeId === childId : true;
    }

    return true;
  });

  if (subscribedAddOns) {
    subscribedAddOns.forEach((f, i) => {
      const addon = addOnState?.addOns?.addOnMetaData?.find(addOn => addOn.id === f.id);

      subscribedAddOns[i]._id = i;
      subscribedAddOns[i].integrationId = integrationId;
      subscribedAddOns[i].name = addon ? addon.name : f.id;
      subscribedAddOns[i].description = addon ? addon.description : '';
      subscribedAddOns[i].uninstallerFunction = addon
        ? addon.uninstallerFunction
        : '';
      subscribedAddOns[i].installerFunction = addon
        ? addon.installerFunction
        : '';
    });
  }

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
            You don`t have any add-ons yet. Add-ons let you customize
            subscription to meet your specific business requirements.
          </Typography>
        </div>
        <div>
          <FilledButton
            className={classes.button}
            component={Link}
            to={match.url.replace('admin/subscription', 'addons')}>
            GET ADD-ONS
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
