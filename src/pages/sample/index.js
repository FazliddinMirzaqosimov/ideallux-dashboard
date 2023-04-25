import React from 'react';

export const samplePagesConfigs = [
  {
    path: '/article',
    component: React.lazy(() => import('./Article')),
  },
  {
    path: '/article/add',
    component: React.lazy(() => import('./Article/ArticlePostEdit')),
  },
  {
    path: '/product',
    component: React.lazy(() => import('./Product')),
  },
  {
    path: '/product/add',
    component: React.lazy(() => import('./Product/ProductPostEdit')),
  },
  {
    path: '/Category',
    component: React.lazy(() => import('./Category')),
  },
];
