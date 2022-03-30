import MapDataIcon from '../../../../../components/icons/MapDataIcon';
import InputFilterIcon from '../../../../../components/icons/InputFilterIcon';
import TransformIcon from '../../../../../components/icons/TransformIcon';
import OutputFilterIcon from '../../../../../components/icons/OutputFilterIcon';
import HookIcon from '../../../../../components/icons/HookIcon';
import AgentsIcon from '../../../../../components/icons/AgentsIcon';
import RoutingIcon from '../../../../../components/icons/RoutingIcon';
import CalendarIcon from '../../../../../components/icons/CalendarIcon';

export default {
  // Page Generator Actions
  // ----------------------
  as2Routing: {
    position: 'left',
    RoutingIcon,
    helpKey: 'fb.pg.exports.as2routing',
  },
  exportFilter: {
    position: 'right',
    OutputFilterIcon,
    helpKey: 'fb.pg.exports.filter',
  },
  exportHooks: {
    position: 'right',
    HookIcon,
    helpKey: 'fb.pg.exports.hooks',
  },
  exportSchedule: {
    position: 'middle',
    CalendarIcon,
    helpKey: 'fb.pg.exports.schedule',
  },
  exportTransformation: {
    position: 'right',
    TransformIcon,
    helpKey: 'fb.pg.exports.transform',
  },

  // Page Processor Actions
  // ----------------------
  inputFilter: {
    position: 'left',
    InputFilterIcon,
  },
  importMapping: {
    position: 'middle',
    MapDataIcon,
    helpKey: 'fb.pp.imports.importMapping',
  },
  lookupTransformation: {
    position: 'middle',
    TransformIcon,
    helpKey: 'fb.pp.exports.transform',
  },
  outputFilter: {
    position: 'middle',
    OutputFilterIcon,
    helpKey: 'fb.pp.exports.filter',
  },
  pageProcessorHooks: {
    position: 'middle',
    HookIcon,
  },
  responseTransformation: {
    name: '',
    position: 'middle',
    TransformIcon,
    helpKey: 'fb.pp.imports.transform',
  },
  postResponseMapHook: {
    name: '',
    position: 'right',
    HookIcon,
  },
  proceedOnFailure: {
    position: 'right',
    AgentsIcon,
  },
  responseMapping: {
    position: 'right',
    MapDataIcon,
  },
};
