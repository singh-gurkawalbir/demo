import Link from '@material-ui/core/Link';
import Delete from '../../components/ResourceTable/actions/Delete';
import UploadZipFile from '../../components/ResourceTable/actions/Templates/UploadZipFile';
import Download from '../../components/ResourceTable/actions/Templates/Download';
import TogglePublish from '../../components/ResourceTable/actions/Templates/TogglePublish';
import {
  getResourceLink,
  formatLastModified,
} from '../../components/CeligoTable/util';

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
  rowActions: [UploadZipFile, Download, TogglePublish, Delete],
};
