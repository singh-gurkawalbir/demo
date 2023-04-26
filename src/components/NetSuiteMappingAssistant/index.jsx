import Iframe from 'react-iframe';
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { getDomain } from '../../utils/resource';
import { message } from '../../utils/messageStore';
import nsMappingUtils from '../../utils/mapping/application/netsuite';
import { selectors } from '../../reducers';
import actions from '../../actions';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { FilledButton } from '../Buttons';

const useStyles = makeStyles({
  NetsuiteRules: {
    padding: [[10, 10]],
  },
});

export default function NetSuiteMappingAssistant({
  netSuiteConnectionId,
  netSuiteRecordType,
  data,
  onFieldClick,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', netSuiteConnectionId)
  );
  const isNSAssistantFormLoaded = useSelector(state => {
    const { isNSAssistantFormLoaded } = selectors.mapping(state);

    return !!isNSAssistantFormLoaded;
  });

  const recordTypes = useSelectorMemo(selectors.makeOptionsFromMetadata, netSuiteConnectionId, `netsuite/metadata/suitescript/connections/${netSuiteConnectionId}/recordTypes`, 'suitescript-recordTypes')?.data;

  const netSuiteRecordMetadata = useMemo(() => {
    if (recordTypes) {
      // although componentinventorydetail is a valid sub-record type,
      // it is not valid from BE Apis and has same metadata as inventorydetail
      if (netSuiteRecordType === 'componentinventorydetail') {
        return recordTypes.find(r => r.value === 'inventorydetail');
      }

      return recordTypes.find(r => r.value === netSuiteRecordType);
    }
  }, [netSuiteRecordType, recordTypes]);

  useEffect(() => {
    if (!netSuiteRecordMetadata) {
      dispatch(
        actions.metadata.request(
          netSuiteConnectionId,
          `netsuite/metadata/suitescript/connections/${netSuiteConnectionId}/recordTypes`
        )
      );
    }
  }, [dispatch, netSuiteConnectionId, netSuiteRecordMetadata]);
  const [netSuiteFormIsLoading, setNetSuiteFormIsLoading] = useState(false);
  const [suiteletUrl, setSuiteletUrl] = useState();
  const handleSuiteletFrameLoad = () => {
    setNetSuiteFormIsLoading(false);
  };

  const setNSAssistantFormLoaded = useCallback(
    value => {
      dispatch(actions.mapping.setNSAssistantFormLoaded(value));
    },
    [dispatch]
  );
  const handleMessageReceived = useCallback(
    e => {
      if (
        !e.data ||
        !e.data.op ||
        !['loadCompleted', 'clicked', 'loadError'].includes(e.data.op)
      ) {
        return true;
      }
      if (e.data.op === 'loadError') {
        enquesnackbar({ message: message.NETSUITE_ASSISTANT_LAUNCH_ERROR, variant: 'error' });
      } else if (e.data.op === 'loadCompleted') {
        setNSAssistantFormLoaded(true);
        document
          .getElementById('netsuiteFormFrame')
          .contentWindow.postMessage(
            'okay!',
            connection &&
              connection.netsuite &&
              connection.netsuite.dataCenterURLs &&
              connection.netsuite.dataCenterURLs.systemDomain
          );
      } else if (e.data.op === 'clicked') {
        if (!e.data.field.sublistName && e.data.sublistId) {
          // eslint-disable-next-line no-param-reassign
          e.data.field.sublistName = e.data.sublistId;
        }

        onFieldClick && onFieldClick(e.data.field);
      }
    },
    [connection, onFieldClick, setNSAssistantFormLoaded, enquesnackbar]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessageReceived);

    return () => {
      window.removeEventListener('message', handleMessageReceived);

      if (isNSAssistantFormLoaded) setNSAssistantFormLoaded(false);
    };
  }, [
    connection,
    handleMessageReceived,
    isNSAssistantFormLoaded,
    setNSAssistantFormLoaded,
  ]);

  useEffect(() => {
    if (isNSAssistantFormLoaded) {
      if (
        data &&
        data.data &&
        data.data.returnedObjects &&
        data.data.returnedObjects.jsObjects &&
        data.data.returnedObjects.jsObjects.data &&
        data.data.returnedObjects.jsObjects.data[0] &&
        data.data.returnedObjects.jsObjects.data[0].data
      ) {
        document.getElementById('netsuiteFormFrame').contentWindow.postMessage(
          {
            op: 'populatePreviewData',
            data: data.data.returnedObjects.jsObjects.data[0].data,
          },
          connection &&
            connection.netsuite &&
            connection.netsuite.dataCenterURLs &&
            connection.netsuite.dataCenterURLs.systemDomain
        );
      }
    }
  }, [connection, data, isNSAssistantFormLoaded]);

  const handleLaunchAssistantClick = () => {
    if (!nsMappingUtils.isNSMappingAssistantSupported()) {
      return enquesnackbar({ message: message.NETSUITE_ASSISTANT_LAUNCH_ERROR, variant: 'error' });
    }
    setNetSuiteFormIsLoading(true);
    const ioDomain = getDomain();
    let ioEnvironment = 'production';

    if (ioDomain.includes('staging.integrator.io')) {
      ioEnvironment = 'staging';
    } else if (ioDomain.includes('localhost')) {
      ioEnvironment = 'development';
    }

    const config = {
      a: connection.netsuite.account,
      e: connection.netsuite.environment,
      id: ioDomain,
      ie: ioEnvironment,
      u: encodeURIComponent(netSuiteRecordMetadata.url),
    };

    if (config.u.indexOf('?url=') > -1) {
      config.u = config.u.substr(config.u.indexOf('?url=') + 5);
    }

    setSuiteletUrl(
      `${
        connection.netsuite.dataCenterURLs.systemDomain
      }/app/site/hosting/scriptlet.nl?script=customscript_celigo_io_mapping_form&deploy=customdeploy_celigo_io_mapping_form&compid=${
        config.a
      }&config=${JSON.stringify(config)}&_dc=${new Date().getTime()}`
    );
  };

  if (
    !connection ||
    !connection.netsuite ||
    !connection.netsuite.account ||
    !connection.netsuite.dataCenterURLs ||
    !connection.netsuite.dataCenterURLs.systemDomain
  ) {
    return <Typography>Missing connection configuration.</Typography>;
  }

  if (!netSuiteRecordMetadata) {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <>
      {netSuiteFormIsLoading && (
      <Spinner center="screen" />
      )}
      {suiteletUrl && (
        <Iframe
          title="NetSuite Mapping Assistant"
          id="netsuiteFormFrame"
          width="100%"
          height="100%"
          url={suiteletUrl}
          onLoad={handleSuiteletFrameLoad}
          display={isNSAssistantFormLoaded ? 'block' : 'none'}
          frameBorder={0}
        />
      )}

      {!isNSAssistantFormLoaded && (
        <>
          <div className={classes.NetsuiteRules}>
            <FilledButton onClick={handleLaunchAssistantClick}>
              Launch NetSuite assistant
            </FilledButton>
            <ol>
              <li>
                Please make sure that you have &quot;Celigo integrator.io&quot;
                bundle (ID: 20038) version 1.7.4.5 or higher.
              </li>
              <li>
                Please click{' '}
                <a
                  target="blank"
                  href={`${connection.netsuite.dataCenterURLs.systemDomain}/app/login/secure/enterpriselogin.nl?c=${connection.netsuite.account}&whence=`}>
                  here
                </a>{' '}
                to login to your NetSuite account {connection.netsuite.account}.
              </li>
              <li>
                After login, please click the &quot;Launch NetSuite
                assistant&quot; button.
              </li>
            </ol>
          </div>
        </>
      )}
    </>
  );
}
