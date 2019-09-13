import Link from '@material-ui/core/Link';
import Delete from '../../actions/Delete';
import Edit from '../../actions/Edit';
import UploadZipFile from '../../actions/Templates/UploadZipFile';
import Download from '../../actions/Templates/Download';
import TogglePublish from '../../actions/Templates/TogglePublish';
import { getResourceLink, formatLastModified } from '../util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('templates', r),
      orderBy: 'name',
    },
    {
      heading: 'Description',
      value: r => r.description,
      orderBy: 'description',
    },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
    {
      heading: 'Image',
      value(r) {
        return <img src={r.imageURL} alt="Loading..." />;
      },
    },
    {
      heading: 'Website',
      value(r) {
        return (
          <Link href={r.websiteURL} target="_blank">
            Website
          </Link>
        );
      },
    },
    {
      heading: 'Published',
      value: r => (r.published ? 'Yes' : 'No'),
    },
  ],
  actions: [Edit, UploadZipFile, Download, TogglePublish, Delete],
};
