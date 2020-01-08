import { gainsightSagas } from './gainsight';
import feedbackSagas from './feedback';

export default [...gainsightSagas, ...feedbackSagas];
