import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AuditLogs from '../../actions/AuditLogs';
import StackShares from '../../actions/StackShares';
import StackSystemToken from '../../../../components/StackSystemToken';
import { formatLastModified } from '../../../CeligoTable/util';
import GenerateToken from '../../actions/GenerateToken';

const getSystemToken = stack => <StackSystemToken stackId={stack._id} />;

export default {
  columns: [
    {
      heading: 'Name',
      value: function StacksDrawerLink(r) {
        return <ResourceDrawerLink resourceType="stacks" resource={r} />;
      },
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
      heading: 'Function name',
      value: r => r.lambda && r.lambda.functionName,
    },
    {
      heading: `Updated On`,
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
    {
      heading: 'Access Key Id',
      value: r => r.lambda && r.lambda.accessKeyId,
    },
    {
      heading: 'System Token',
      width: '285px',
      value: r => !r.shared && r.server && getSystemToken(r),
    },
  ],
  rowActions: [GenerateToken, StackShares, AuditLogs, References, Delete],
};
