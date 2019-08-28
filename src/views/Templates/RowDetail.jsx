import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { confirmDialog } from '../../components/ConfirmDialog';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';

const styles = theme => ({
  templateActions: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  templateDetails: {
    flexBasis: '66.66%',
    flexShrink: 0,
  },
});

function TemplatesData(props) {
  const { classes, item } = props;
  const dispatch = useDispatch();
  const handleDeleteClick = () => {
    confirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to delete this template?',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.resource.delete('templates', item._id));
          },
        },
      ],
    });
  };

  const handleUploadZipFileClick = () => {};
  const handleDownloadClick = () => {};
  const handlePublishClick = () => {};

  return (
    <Fragment>
      <Typography className={classes.templateDetails}>
        Description: {item.description}
        <br />
        Image: <img src={item.imageURL} alt="Loading..." />
        <br />
        Website:
        <Link href={item.websiteURL} className={classes.link} target="_blank">
          Website
        </Link>
        <br />
        Published: {item.published ? 'Yes' : 'No'}
      </Typography>

      <Typography className={classes.templateActions}>
        <Button
          component={RouterLink}
          to={getRoutePath(`scripts/edit/${item._id}`)}>
          Edit
        </Button>
        <br />
        <Button onClick={handleUploadZipFileClick}>Upload Zip File</Button>
        <br />
        <Button onClick={handleDownloadClick}>Download</Button>
        <br />
        <Button onClick={handlePublishClick}>
          {item.published ? 'Unpublish' : 'Publish'}
        </Button>
        <br />
        <Button onClick={handleDeleteClick}>Delete</Button>
      </Typography>
    </Fragment>
  );
}

export default withStyles(styles)(TemplatesData);
