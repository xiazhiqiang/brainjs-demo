import { IRouterConfig } from 'ice';
import { renderNotFound, isInIcestark } from '@ice/stark-app';
import BasicLayout from '@/layouts/BasicLayout';
import NotFound from '@/components/NotFound';
import Demo1 from './pages/Demo1';
import Demo2 from './pages/Demo2';
import Home from './pages/home';

const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/demo1',
        exact: true,
        component: Demo1,
      },
      {
        path: '/demo2',
        exact: true,
        component: Demo2,
      },
      {
        path: '/',
        component: Home,
      },
      {
        // 微应用独立运行 404 路由渲染 NotFound 组件
        component: isInIcestark() ? () => renderNotFound() : NotFound,
      },
    ],
  },
];

export default routerConfig;
