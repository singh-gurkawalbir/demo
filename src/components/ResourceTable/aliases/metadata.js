import React from 'react';
import { Typography } from '@material-ui/core';
import AliasResourceName from './cells/AliasResourceName';
import { getResourceFromAlias, MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import { useGetTableContext } from '../../CeligoTable/TableContext';
import EditAlias from './actions/EditAlias';
import CopyAlias from './actions/CopyAlias';
import ViewAliasDetails from './actions/ViewAliasDetails';
import DeleteAlias from './actions/DeleteAlias';
import InfoIconButton from '../../InfoIconButton';

export default {
  useColumns: () => [
    {
      key: 'aliasId',
      heading: 'Alias ID',
      Value: ({rowData: r}) => (
        <>
          <Typography component="span" >{r?.alias}</Typography>
          {r?.description && <InfoIconButton info={r?.description} placement="bottom-center" escapeUnsecuredDomains size="xs" />}
        </>
      ),
    },
    {
      key: 'name',
      heading: 'Resource Name',
      Value: ({rowData: r}) => <AliasResourceName alias={r} />,
    },
    {
      key: 'type',
      heading: 'Resource Type',
      Value: ({rowData: r}) => MODEL_PLURAL_TO_LABEL[getResourceFromAlias(r).resourceType],
      orderBy: 'type',
    },
  ],
  useRowActions: () => {
    const { isIntegrationApp, accessLevel, hasManageAccess } = useGetTableContext();
    const hasEditPermissions = !isIntegrationApp && (accessLevel !== 'monitor') && hasManageAccess;

    const actions = [];

    if (hasEditPermissions) {
      actions.push(EditAlias);
    }
    actions.push(CopyAlias);
    actions.push(ViewAliasDetails);
    if (hasEditPermissions) {
      actions.push(DeleteAlias);
    }

    return actions;
  },
};
