import React from 'react';
import {BiAlignLeft} from 'react-icons/bi';

const routesConfig = [
  {
    id: 'app',
    title: 'Sample',
    messageId: 'sidebar.sample',
    type: 'group',
    children: [
      {
        id: 'article',
        title: 'Article',
        messageId: 'sidebar.sample.article',
        type: 'item',
        icon: <BiAlignLeft />,
        path: '/article',
      },
      {
        id: 'product',
        title: 'Product',
        messageId: 'sidebar.sample.product',
        type: 'item',
        icon: <BiAlignLeft />,
        path: '/product',
      },
      {
        id: 'category',
        title: 'Category',
        messageId: 'sidebar.sample.category',
        type: 'item',
        icon: <BiAlignLeft />,
        path: '/category',
      },
    ],
  },
];
export default routesConfig;
