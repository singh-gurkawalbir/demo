import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';
import GenerateTemplateZip from '../../components/GenerateTemplateZip';
import * as selectors from '../../reducers';

const styles = theme => ({
  generateZip: {
    position: 'absolute',
    right: theme.spacing(25),
    top: theme.spacing(10),
  },
});

function Templates(props) {
  const { classes } = props;
  const [showGenerateZipDialog, setShowGenerateZipDialog] = useState(false);
  const resourceList = useSelector(state =>
    selectors.resourceList(state, { type: 'integrations' })
  );
  const handleGenerateZipDialogClose = () => {
    setShowGenerateZipDialog(false);
  };

  return (
    <LoadResources resources={['templates', 'integrations']}>
      {showGenerateZipDialog && (
        <GenerateTemplateZip
          onClose={handleGenerateZipDialogClose}
          integrations={resourceList.resources}
        />
      )}
      <Button
        color="primary"
        onClick={() => setShowGenerateZipDialog(true)}
        className={classes.generateZip}>
        Generate Template Zip
      </Button>
      <ResourceList resourceType="templates" displayName="Templates">
        <RowDetail />
      </ResourceList>
    </LoadResources>
  );
}

export default withStyles(styles)(Templates);
