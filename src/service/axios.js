import {getItem} from '@crema/utility/helper/persistence-storage';
import axios from 'axios';

axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}/api/v1`;

axios.interceptors.request.use((config) => {
  const jwt = getItem('jwt');
  const authorization = jwt ? `Bearer ${jwt}` : '';
  config.headers.authorization = authorization;
  return config;
});

export default axios;
