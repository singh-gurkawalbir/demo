import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AuditLogs from '../../actions/AuditLogs';
import StackShares from '../../actions/StackShares';
import StackSystemToken from '../../../../components/StackSystemToken';
import { getResourceLink, formatLastModified } from '../../../CeligoTable/util';

const getSystemToken = stack => <StackSystemToken stackId={stack._id} />;

export default {
  columns: [
    {
      heading: 'Name',
      value: (r, actionProps, location) =>
        getResourceLink('stacks', r, location),
      orderBy: 'name',
    },
    {
      heading: 'Type',
      value: r => r.type,
      orderBy: 'type',
    },
    {
      heading: 'Host',
      value: r => r.server && r.server.hostURI,
    },
    {
      heading: 'Function Name',
      value: r => r.lambda && r.lambda.functionName,
    },
    {
      heading: 'System Token',
      width: '250px',
      value: r => !r.shared && r.server && getSystemToken(r),
    },
    {
      heading: 'Access Key Id',
      value: r => r.lambda && r.lambda.accessKeyId,
    },
    {
      heading: `Updated on`,
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: [StackShares, AuditLogs, References, Delete],
};
