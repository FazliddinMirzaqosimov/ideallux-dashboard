import React from 'react';
import './index.style.less';
import AuthWrapper from '../AuthWrapper';
import AppPageMetadata from '../../../@crema/core/AppPageMetadata';
import SignInForm from './SignInForm';
// import SignInFirebase from 'y./SigninFirebase';

const Signin = () => {
  return (
    <AuthWrapper>
      <AppPageMetadata title='Login' />
      <SignInForm />
    </AuthWrapper>
  );
};

export default Signin;
