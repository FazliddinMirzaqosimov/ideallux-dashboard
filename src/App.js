import React from "react";
import { Provider } from "react-redux";

import "./shared/styles/crema.less";
import {
  AppContextProvider,
  AppLayout,
  AppLocaleProvider,
  AppThemeProvider,
  AuthRoutes
} from "./@crema";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import "./@crema/services/index";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
// import FirebaseAuthProvider from './@crema/services/auth/firebase/FirebaseAuthProvider';

// const store = configureStore();
const queryClient=new QueryClient()
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContextProvider>
      <Provider store={store}>
        <AppThemeProvider>
          <AppLocaleProvider>
            <BrowserRouter>
              <AuthRoutes>
                <AppLayout />
              </AuthRoutes>
            </BrowserRouter>
          </AppLocaleProvider>
        </AppThemeProvider>
      </Provider>
    </AppContextProvider>
    <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'}/>
  </QueryClientProvider>
);

export default App;
