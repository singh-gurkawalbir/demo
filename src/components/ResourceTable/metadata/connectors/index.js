import Link from '@material-ui/core/Link';
import Delete from '../../actions/Delete';
import { getResourceLink, formatLastModified } from '../../../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('connectors', r),
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
  rowActions: [Delete],
};
