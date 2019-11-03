import Link from '@material-ui/core/Link';
import Delete from '../../actions/Delete';
import TogglePublish from '../../actions/TogglePublish';
import InstallBase from '../../actions/Connectors/InstallBase';
import Licenses from '../../actions/Connectors/Licenses';
import { getResourceLink, formatLastModified } from '../../../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: (r, actionProps, location) =>
        getResourceLink('connectors', r, location),
      orderBy: 'name',
    },
    {
      heading: 'Description',
      value: r => r.description,
    },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
    {
      heading: 'Image',
      value(r) {
        return r.imageURL ? <img src={r.imageURL} alt="Loading..." /> : null;
      },
    },
    {
      heading: 'Website',
      value(r) {
        return r.websiteURL ? (
          <Link href={r.websiteURL} target="_blank">
            Website
          </Link>
        ) : null;
      },
    },
    {
      heading: 'Published',
      value: r => (r.published ? 'Yes' : 'No'),
    },
  ],
  rowActions: [InstallBase, Licenses, TogglePublish, Delete],
};
