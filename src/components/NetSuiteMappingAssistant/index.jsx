import Iframe from 'react-iframe';
import { useEffect, useCallback, useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { getDomain } from '../../utils/resource';
import Spinner from '../Spinner';
import * as selectors from '../../reducers';

export default function NetSuiteMappingAssistant({
  width = '100%',
  height = '100%',
  netSuiteConnectionId,
  netSuiteRecordLabel,
  netSuiteRecordUrl,
  data,
  onFieldClick,
}) {
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', netSuiteConnectionId)
  );
  const [netSuiteFormIsLoading, setNetSuiteFormIsLoading] = useState(false);
  const [showNetSuiteForm, setShowNetSuiteForm] = useState(false);
  const [suiteletUrl, setSuiteletUrl] = useState();
  const handleSuiteletFrameLoad = () => {
    setNetSuiteFormIsLoading(false);
  };

  const handleMessageReceived = useCallback(
    e => {
      if (
        !e.data ||
        !e.data.op ||
        !['loadCompleted', 'clicked'].includes(e.data.op)
      ) {
        return true;
      }

      if (e.data.op === 'loadCompleted') {
        setShowNetSuiteForm(true);
        document
          .getElementById('netsuiteFormFrame')
          .contentWindow.postMessage(
            'okay!',
            connection.netsuite.dataCenterURLs.systemDomain
          );

        if (data) {
          document
            .getElementById('netsuiteFormFrame')
            .contentWindow.postMessage(
              { op: 'populatePreviewData', data },
              connection.netsuite.dataCenterURLs.systemDomain
            );
        }
      } else if (e.data.op === 'clicked') {
        if (!e.data.field.sublistName && e.data.sublistId) {
          // eslint-disable-next-line no-param-reassign
          e.data.field.sublistName = e.data.sublistId;
        }

        onFieldClick && onFieldClick(e.data.field);
      }
    },
    [connection.netsuite.dataCenterURLs.systemDomain, data, onFieldClick]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessageReceived);

    return () => {
      window.removeEventListener('message', handleMessageReceived);
    };
  }, [connection, handleMessageReceived]);

  const handleLaunchAssistantClick = () => {
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
      u: encodeURIComponent(netSuiteRecordUrl),
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
    !connection.netsuite.environment ||
    !connection.netsuite.dataCenterURLs ||
    !connection.netsuite.dataCenterURLs.systemDomain
  ) {
    return <Typography>Missing connection configuration.</Typography>;
  }

  return (
    <Fragment>
      {netSuiteFormIsLoading && (
        <Typography>
          Loading {netSuiteRecordLabel} form...
          {/** TODO Azhar to fix the Spinner to show as an overlay/mask. */}
          <Spinner />
        </Typography>
      )}
      {suiteletUrl && (
        <Iframe
          title="NetSuite Mapping Assistant"
          id="netsuiteFormFrame"
          width={width}
          height={height}
          url={suiteletUrl}
          onLoad={handleSuiteletFrameLoad}
          display={showNetSuiteForm ? 'block' : 'none'}
          frameBorder={0}
        />
      )}

      {!showNetSuiteForm && (
        <Fragment>
          <div>
            <Button onClick={handleLaunchAssistantClick}>
              Launch NetSuite Assistant
            </Button>
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
                Assistant&quot; button.
              </li>
            </ol>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
