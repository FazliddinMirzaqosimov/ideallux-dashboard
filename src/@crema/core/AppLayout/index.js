import React, {useEffect} from 'react';
import {Layout} from 'antd';
import {useUrlSearchParams} from 'use-url-search-params';
import './layout.style.less';
import {AppContentView} from '../../index';
import Layouts from './Layouts';
import {LayoutType} from '../../../shared/constants/AppEnums';
import AppScrollbar from '../AppScrollbar';
import {
  useLayoutActionsContext,
  useLayoutContext,
} from '../../utility/AppContextProvider/LayoutContextProvider';
// import {useAuthUser} from '../../utility/AuthHooks';
import {useSidebarActionsContext} from '../../utility/AppContextProvider/SidebarContextProvider';
import {useSelector} from 'react-redux';
import {getItem} from '@crema/utility/helper/persistence-storage';
import {useDispatch} from 'react-redux';
import {checkToken} from 'redux/slice/authSlice';


const AppLayout = () => {
  // const {isAuthenticated} = useAuthUser();
  const {loggedIn} = useSelector((state) => state.auth);
  const {navStyle, layoutType} = useLayoutContext();
  const {updateNavStyle} = useLayoutActionsContext();
  const {updateMenuStyle, setSidebarBgImage} = useSidebarActionsContext();
  const [params] = useUrlSearchParams();
  const AppLayout = Layouts[navStyle];

  const dispatch = useDispatch();

  const getUser = () => {
    const token = getItem('jwt');
    if (token) {
      dispatch(checkToken());
    }
  };


  useEffect(() => {
    if (layoutType === LayoutType.BOXED) {
      document.body.classList.add('boxedLayout');
      document.body.classList.remove('framedLayout');
    } else if (layoutType === LayoutType.FRAMED) {
      document.body.classList.remove('boxedLayout');
      document.body.classList.add('framedLayout');
    } else {
      document.body.classList.remove('boxedLayout');
      document.body.classList.remove('framedLayout');
    }
  }, [layoutType]);

  useEffect(() => {
    if (params.layout) updateNavStyle(params.layout);
    if (params.menuStyle) updateMenuStyle(params.menuStyle);
    if (params.sidebarImage) setSidebarBgImage(true);
    getUser();
  }, []);

  return (
    <React.Fragment>
      {loggedIn ? (
        <AppLayout />
      ) : (
        <Layout className='auth'>
          <AppScrollbar className='main-auth-scrollbar'>
            <AppContentView />
          </AppScrollbar>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default React.memo(AppLayout);
