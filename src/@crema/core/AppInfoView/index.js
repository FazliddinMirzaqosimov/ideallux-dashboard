import React, {useEffect} from 'react';
import {message} from 'antd';

import {AppLoader} from '../../../@crema';
import {useDispatch, useSelector} from 'react-redux';
import {hideMessage} from '../../../redux/actions';

const AppInfoView = () => {
  const {isLoading, error, displayMessage} = useSelector(state=>state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(hideMessage());
    }
  }, [error]);

  useEffect(() => {
    if (displayMessage) {
      message.success(displayMessage);
      dispatch(hideMessage());
    }
  }, [displayMessage]);

  return <>{isLoading ? <AppLoader /> : null}</>;
};

export default AppInfoView;
