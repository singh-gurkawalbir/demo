import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import CeligoTable from '../../../CeligoTable';
import Spinner from '../../../Spinner';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: `calc(100vh - ${theme.appBarHeight + 200}px)`,
    overflowY: 'auto',
  },
}));
const columns = [
  {
    heading: 'Name',
    value: r => r.doc.name,
    orderBy: 'name',
  },
  { heading: 'Type', value: r => r.model },
  { heading: 'Description', value: r => r.doc.description },
];

export default function PreviewTable({ templateId }) {
  const classes = useStyles();
  const components = useSelector(state =>
    selectors.previewTemplate(state, templateId)
  );
  const { objects = [] } = components;

  if (!objects.length) {
    return (
      <div>
        <Typography variant="h4">Loading preview...</Typography>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={classes.tableContainer}>
      <CeligoTable
        data={objects.map((obj, index) => ({
          ...obj,
          _id: index,
        }))}
        columns={columns}
      />
    </div>
  );
}
