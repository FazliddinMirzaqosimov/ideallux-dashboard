import React from 'react';
import {AppLoader} from '../index';
import PropTypes from 'prop-types';
// import {useAuthUser} from './AuthHooks';
import { useSelector } from 'react-redux';

const AuthRoutes = ({children}) => {
  const {isLoading}=useSelector(state=>state.auth)
  console.log(isLoading);
  return isLoading ? <AppLoader /> : <>{children}</>;
};

export default AuthRoutes;

AuthRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};
