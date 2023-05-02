import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import { Typography } from '@material-ui/core';
import { getHttpConnector } from '../../../../constants/applications';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaEditable from '../DynaEditable';

export const OptionLabel = ({ option, connInfo = {} }) => {
  const classes = useStyles();
  const { httpConnectorId, httpConnectorApiId, httpConnectorVersionId } = connInfo;
  const connectorData = useSelector(state => selectors.connectorData(state, httpConnectorId) || {});
  const { versions = [], apis = [] } = connectorData;
  const currApi = apis?.filter(api => api._id === httpConnectorApiId)?.[0];
  let currVersion = currApi?.versions?.length ? currApi.versions : versions;

  currVersion = currVersion?.filter(ver => ver._id === httpConnectorVersionId)?.[0];

  if (!httpConnectorId) {
    return null;
  }

  return (
    <Typography>{option?.label || ''}
      <Typography component="div" variant="caption" className={classes.addClass}>
        {currApi?.name && <div><span><b>API type:</b></span> <span>{currApi.name}</span></div>}
        {currVersion?.name && <div><span><b>API version:</b> </span><span>{currVersion.name}</span></div>}
      </Typography>
    </Typography>
  );
};

export default function DynaSelectConnection(props) {
  const {id,
    options,
    disabled,
    onCreateClick,
    onEditClick,
  } = props;
  const [isConnectorCalled, setIsConnectorCalled] = useState({});
  const dispatch = useDispatch();
  const connectorData = useSelector(selectors.httpConnectorsList);
  const hasHTTPConnectorInfo = useMemo(() => id !== '_borrowConcurrencyFromConnectionId' && options?.some(option =>
    option.items?.some(item =>
      getHttpConnector(item.connInfo?.httpConnectorId) && (item.connInfo?.httpConnectorApiId || item.connInfo?.httpConnectorVersionId)
    )
  ), [id, options]);

  useEffect(() => {
    if (options.length && hasHTTPConnectorInfo) {
      const connectorIds = options.reduce((connSet, item) => {
        if (item.connInfo?.httpConnectorId && getHttpConnector(item.connInfo?.httpConnectorId)) {
          connSet.add(item.connInfo.httpConnectorId);
        }

        return connSet;
      }, new Set());

      connectorIds?.forEach(httpConnectorId => {
        if (!connectorData?.[httpConnectorId] && !isConnectorCalled?.[httpConnectorId]) {
          setIsConnectorCalled(connIds => ({ ...connIds, [httpConnectorId]: true }));
          dispatch(actions.httpConnectors.requestConnector({ httpConnectorId }));
        }
      });
    }
  }, [options, dispatch, connectorData, hasHTTPConnectorInfo, isConnectorCalled]);

  return (
    <DynaEditable
      {...props}
      disabled={disabled}
      onCreateClick={onCreateClick}
      onEditClick={onEditClick}
      options={options} />
  );
}
