import { Fragment } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import CeligoPageBar from '../../components/CeligoPageBar';
// import * as selectors from '../../reducers';
// import actions from '../../actions';
// import LoadResources from '../../components/LoadResources';
import CeligoTable from '../../components/CeligoTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import AddIcon from '../../components/icons/AddIcon';
import metadata from './metadata';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function RecycleBin(props) {
  const classes = useStyles();
  // const dispatch = useDispatch();
  // const [selected, setSelected] = useState({});
  const list = [
    { _id: 123, name: 'ABC' },
    { _id: 456, name: 'DEF' },
    { _id: 789, name: 'GHI' },
  ];
  const handleSelectChange = () => {
    // setSelected(connections);
  };

  return (
    <Fragment>
      <ResourceDrawer {...props} />

      <CeligoPageBar title="Recycle Bin" infoText="Info text for recycle bin">
        <div className={classes.actions}>
          <IconButton>
            <AddIcon />
          </IconButton>
          <IconButton>
            <AddIcon />
          </IconButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <CeligoTable
          data={list}
          onSelectChange={handleSelectChange}
          {...metadata}
          selectableRows
        />
      </div>
      <ShowMoreDrawer filterKey="recycleBin" count={10} maxCount={15} />
    </Fragment>
  );
}
