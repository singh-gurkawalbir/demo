import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { getHttpConnector } from '../../../../constants/applications';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaEditable from '../DynaEditableSelect';

const useStyles = makeStyles(theme => ({
  apiType: {
    color: theme.palette.secondary.light,
    lineHeight: '14px',
  },
}));
export const OptionLabel = ({ option, connInfo = {} }) => {
  const classes = useStyles();
  const { httpConnectorId, httpConnectorApiId, httpConnectorVersionId } = connInfo;
  const connectorData = useSelector(state => selectors.connectorData(state, httpConnectorId) || {});
  const { versions = [], apis = [] } = connectorData;
  const currApi = apis?.filter(api => api._id === httpConnectorApiId)?.[0];
  let currVersion = currApi?.versions?.length ? currApi.versions : versions;

  currVersion = currVersion?.filter(ver => ver._id === httpConnectorVersionId)?.[0];

  return (
    <Typography data-value={option?.value}>{option?.label || ''}
      <Typography component="div" variant="caption" className={classes.addClass}>
        {currApi?.name && <div><span><b>API type:</b></span> <span>{currApi.name}</span></div>}
        {currVersion?.name && <div><span><b>API version:</b> </span><span>{currVersion.name}</span></div>}
      </Typography>
    </Typography>
  );
};

export default function DynaSelectConnection(props) {
  const {
    options,
    disabled,
    onCreateClick,
    onEditClick,
  } = props;
  const [isConnectorCalled, setIsConnectorCalled] = useState({});
  const dispatch = useDispatch();
  const connectorData = useSelector(selectors.httpConnectorsList);
  const hasHTTPConnectorInfo = useMemo(() => options?.some(option =>
    getHttpConnector(option.connInfo?.httpConnectorId) && (option.connInfo?.httpConnectorApiId || option.connInfo?.httpConnectorVersionId)
  ), [options]);

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
