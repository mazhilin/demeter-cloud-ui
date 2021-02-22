import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  /** 会员中心*/
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'userCenter',
    meta: {
      title: '会员中心',
      icon: 'service'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'user',
        meta: {
          perms: ['GET /admin/user/list', 'POST /admin/user/create', 'POST /admin/user/read'],
          title: '会员管理',
          icon: 'customer',
          noCache: true
        }
      },
      {
        path: 'address',
        component: () => import('@/views/user/address'),
        name: 'address',
        meta: {
          perms: ['GET /admin/address/list'],
          title: '会员地址',
          icon: 'map',
          noCache: true
        }
      },
      {
        path: 'collect',
        component: () => import('@/views/user/collect'),
        name: 'collect',
        meta: {
          perms: ['GET /admin/collect/list'],
          title: '会员收藏',
          icon: 'operation',
          noCache: true
        }
      },
      {
        path: 'footprint',
        component: () => import('@/views/user/footprint'),
        name: 'footprint',
        meta: {
          perms: ['GET /admin/footprint/list'],
          title: '会员足迹',
          icon: 'browse',
          noCache: true
        }
      },
      {
        path: 'history',
        component: () => import('@/views/user/history'),
        name: 'history',
        meta: {
          perms: ['GET /admin/history/list'],
          title: '搜索历史',
          icon: 'history',
          noCache: true
        }
      },
      {
        path: 'feedback',
        component: () => import('@/views/user/feedback'),
        name: 'feedback',
        meta: {
          perms: ['GET /admin/feedback/list'],
          title: '意见反馈',
          icon: 'survey',
          noCache: true
        }
      }
    ]
  },
  /** 运营中心*/
  {
    path: '/operation',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'operationCenter',
    meta: {
      title: '运营中心',
      icon: 'operation-center'
    },
    children: [
      {
        path: 'region',
        component: () => import('@/views/operation/region'),
        name: 'region',
        meta: {
          perms: ['GET /admin/region/list', 'GET /admin/region/detail', 'POST /admin/order/region', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
          title: '行政区域',
          icon: 'region-center',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/operation/order'),
        name: 'order',
        meta: {
          perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
          title: '订单管理',
          icon: 'order-center',
          noCache: true
        }
      },
      {
        path: 'express',
        component: () => import('@/views/operation/express'),
        name: 'express',
        meta: {
          perms: ['GET /admin/express/list', 'GET /admin/express/read', 'POST /admin/express/create', 'POST /admin/express/update', 'POST /admin/express/delete'],
          title: '快递管理',
          icon: 'order-center',
          noCache: true
        }
      },
      {
        path: 'freight',
        component: () => import('@/views/operation/freight'),
        name: 'freight',
        meta: {
          perms: ['GET /admin/freight/list', 'GET /admin/freight/read', 'POST /admin/freight/create', 'POST /admin/freight/update', 'POST /admin/freight/delete'],
          title: '运费管理',
          icon: 'order-center',
          noCache: true
        }
      },
      {
        path: 'template',
        component: () => import('@/views/operation/template'),
        name: 'template',
        meta: {
          perms: ['GET /admin/template/list', 'GET /admin/template/read', 'POST /admin/template/create', 'POST /admin/template/update', 'POST /admin/template/delete'],
          title: '运费模板',
          icon: 'order-center',
          noCache: true
        }
      },
      {
        path: 'logistics',
        component: () => import('@/views/operation/logistics'),
        name: 'logistics',
        meta: {
          perms: ['GET /admin/logistics/list', 'GET /admin/logistics/detail'],
          title: '物流管理',
          icon: 'order-center',
          noCache: true
        }
      },
      {
        path: 'issue',
        component: () => import('@/views/operation/issue'),
        name: 'issue',
        meta: {
          perms: ['GET /admin/issue/list', 'POST /admin/issue/create', 'GET /admin/issue/read', 'POST /admin/issue/update', 'POST /admin/issue/delete'],
          title: '咨询管理',
          icon: 'help-center',
          noCache: true
        }
      }
    ]
  },
  /** 配置中心*/
  {
    path: '/config',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'configCenter',
    meta: {
      title: '配置中心',
      icon: 'config-center'
    },
    children: [
      {
        path: 'config',
        component: () => import('@/views/config/config'),
        name: 'config',
        meta: {
          perms: ['GET /admin/config/list', 'POST /admin/config/create', 'POST /admin/config/show', 'POST /admin/config/edit', 'POST /admin/config/update', 'POST /admin/config/delete'],
          title: '配置管理',
          icon: 'config-center',
          noCache: true
        }
      },
      {
        path: 'parameter',
        component: () => import('@/views/config/parameter'),
        name: 'parameter',
        meta: {
          perms: ['GET /admin/parameter/list', 'POST /admin/parameter/create', 'POST /admin/parameter/update', 'POST /admin/parameter/delete'],
          title: '参数管理',
          icon: 'parameter-center',
          noCache: true
        }
      },
      {
        path: 'dictionary',
        component: () => import('@/views/config/dictionary'),
        name: 'dictionary',
        meta: {
          perms: ['GET /admin/parameter/list', 'POST /admin/parameter/create', 'POST /admin/parameter/update', 'POST /admin/parameter/delete'],
          title: '数据字典',
          icon: 'dictionary-center',
          noCache: true
        }
      },
      {
        path: 'dictionaryitem',
        component: () => import('@/views/config/dictionaryitem'),
        name: 'dictionaryitem',
        meta: {
          perms: ['GET /admin/dictionary/item/list', 'POST /admin/dictionary/item/create', 'POST /admin/dictionary/item/update', 'POST /admin/dictionary/item/delete'],
          title: '字典项管理',
          icon: 'dictionary-item',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'goodsManage',
    meta: {
      title: '商品中心',
      icon: 'product-list'
    },
    children: [
      {
        path: 'brand',
        component: () => import('@/views/mall/brand'),
        name: 'brand',
        meta: {
          perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
          title: '品牌管理',
          icon: 'barand',
          noCache: true
        }
      },
      {
        path: 'list',
        component: () => import('@/views/goods/list'),
        name: 'goodsList',
        meta: {
          perms: ['GET /admin/goods/list', 'POST /admin/goods/delete'],
          title: '产品管理',
          icon: 'product',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/goods/create'),
        name: 'goodsCreate',
        meta: {
          perms: ['POST /admin/goods/create'],
          title: '商品上架',
          icon: 'goods-create',
          noCache: true
        }
      },
      {
        path: 'edit',
        component: () => import('@/views/goods/edit'),
        name: 'goodsEdit',
        meta: {
          perms: ['GET /admin/goods/detail', 'POST /admin/goods/update', 'POST /admin/goods/catAndBrand'],
          title: '商品编辑',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'category',
        component: () => import('@/views/goods/category'),
        name: 'category',
        meta: {
          perms: ['GET /admin/category/list', 'POST /admin/category/create', 'GET /admin/category/read', 'POST /admin/category/update', 'POST /admin/category/delete'],
          title: '类目管理',
          icon: 'product-category',
          noCache: true
        }
      },
      {
        path: 'keyword',
        component: () => import('@/views/goods/keyword'),
        name: 'keyword',
        meta: {
          perms: ['GET /admin/keyword/list', 'POST /admin/keyword/create', 'GET /admin/keyword/read', 'POST /admin/keyword/update', 'POST /admin/keyword/delete'],
          title: '搜索关键词',
          icon: 'keyword',
          noCache: true
        }
      },
      {
        path: 'comment',
        component: () => import('@/views/goods/comment'),
        name: 'goodsComment',
        meta: {
          perms: ['GET /admin/comment/list', 'POST /admin/comment/create', 'POST /admin/comment/delete'],
          title: '评价管理',
          icon: 'product-comment',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/promotion',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'promotionCenter',
    meta: {
      title: '活动中心',
      icon: 'guide'
    },
    children: [
      {
        path: 'articleList',
        component: () => import('@/views/promotion/articleList'),
        name: 'articleList',
        meta: {
          perms: ['GET /admin/article/list', 'POST /admin/article/delete', 'POST /admin/article/create'],
          title: '通告管理',
          icon: 'tips',
          noCache: true
        }
      },
      {
        path: 'articleCreate',
        component: () => import('@/views/promotion/articleCreate'),
        name: 'articleCreate',
        meta: {
          perms: ['POST /admin/article/create'],
          title: '发布公告',
          icon: 'tips',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'articleEdit',
        component: () => import('@/views/promotion/articleEdit'),
        name: 'articleEdit',
        meta: {
          perms: ['GET /admin/article/detail', 'POST /admin/article/update'],
          title: '广告管理',
          icon: 'chart',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'ad',
        component: () => import('@/views/promotion/ad'),
        name: 'ad',
        meta: {
          perms: ['GET /admin/ad/list', 'POST /admin/ad/create', 'GET /admin/ad/read', 'POST /admin/ad/update', 'POST /admin/ad/delete'],
          title: '广告管理',
          icon: 'ad',
          noCache: true
        }
      },
      {
        path: 'topic',
        component: () => import('@/views/promotion/topic'),
        name: 'topic',
        meta: {
          perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
          title: '专题管理',
          icon: 'libra',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'systemCenter',
    meta: {
      title: '系统中心',
      icon: 'setting'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/system/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin/user/list', 'POST /admin/user/create', 'POST /admin/user/edit', 'POST /admin/user/update', 'POST /admin/user/delete'],
          title: '用户管理',
          icon: 'user',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/show', 'POST /admin/role/update', 'POST /admin/role/edit', 'POST /console/role/delete', 'GET /admin/permission/list', 'POST /admin/permission/update'],
          title: '角色管理',
          icon: 'team',
          noCache: true
        }
      },
      {
        path: 'storage',
        component: () => import('@/views/system/storage'),
        name: 'storage',
        meta: {
          perms: ['GET /admin/storage/list', 'POST /admin/storage/create', 'POST /admin/storage/update', 'POST /admin/storage/delete'],
          title: '文件管理',
          icon: 'cloud',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/enterprise',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'enterprise-center',
    meta: {
      title: '企业中心',
      icon: 'enterprise-center'
    },
    children: [
      {
        path: 'employee',
        component: () => import('@/views/enterprise/employee'),
        name: 'employee',
        meta: {
          perms: ['GET /admin/employee/list', 'POST /admin/employee/create', 'POST /admin/employee/update', 'POST /admin/employee/delete'],
          title: '员工管理',
          icon: 'user',
          noCache: true
        }
      },
      {
        path: 'information',
        component: () => import('@/views/enterprise/information'),
        name: 'information',
        meta: {
          perms: ['GET /admin/information/list', 'POST /admin/information/create', 'POST /admin/information/update', 'POST /admin/information/delete'],
          title: '信息管理',
          icon: 'nested',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'reportCenter',
    meta: {
      title: '报表中心',
      icon: 'report-center'
    },
    children: [
      {
        path: 'achievement',
        component: () => import('@/views/report/achievement'),
        name: 'reportAchievement',
        meta: {
          perms: ['GET /admin/report/achievement'],
          title: '员工业绩',
          icon: 'achievement-list',
          noCache: true
        }
      },
      {
        path: 'distribution',
        component: () => import('@/views/report/distribution'),
        name: 'reportDistribution',
        meta: {
          perms: ['GET /admin/report/distribution'],
          title: '会员佣金',
          icon: 'distribution-list',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/stat',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'statManage',
    meta: {
      title: '数据中心',
      icon: 'data'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/stat/user'),
        name: 'statUser',
        meta: {
          perms: ['GET /admin/stat/user'],
          title: '会员统计',
          icon: 'bussiness-card',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/stat/order'),
        name: 'statOrder',
        meta: {
          perms: ['GET /admin/stat/order'],
          title: '订单统计',
          icon: 'chart',
          noCache: true
        }
      },
      {
        path: 'goods',
        component: () => import('@/views/stat/goods'),
        name: 'statGoods',
        meta: {
          perms: ['GET /admin/stat/goods'],
          title: '商品统计',
          icon: 'excel',
          noCache: true
        }
      }
    ]
  },
  /* {
    path: '/monitor',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'monitorCenter',
    meta: {
      title: '监控中心',
      icon: 'set'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/monitor/journal'),
        name: 'journal',
        meta: {
          perms: ['GET /admin/journal/list', 'POST /admin/journal/create', 'POST /admin/journal/update', 'POST /admin/journal/delete'],
          title: '日志管理',
          icon: 'user',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/monitor/interview'),
        name: 'role',
        meta: {
          perms: ['GET /admin/interview/list', 'POST /admin/interview/create', 'POST /admin/interview/update', 'POST /admin/interview/delete'],
          title: '访问管理',
          icon: 'team',
          noCache: true
        }
      }
    ]
  },*/
  /* {
    path: '/help',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'helpCenter',
    meta: {
      title: '帮助中心',
      icon: 'set'
    },
    children: [
      {
        path: 'manual',
        component: () => import('@/views/help/manual'),
        name: 'manual',
        meta: {
          perms: ['GET /admin/manual/list', 'POST /admin/manual/create', 'POST /admin/manual/update', 'POST /admin/manual/delete'],
          title: '操作手册',
          icon: 'user',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/help/manual'),
        name: 'role',
        meta: {
          perms: ['GET /admin/manual/list', 'POST /admin/manual/create', 'POST /admin/manual/update', 'POST /admin/manual/delete'],
          title: '使用手册',
          icon: 'team',
          noCache: true
        }
      }
    ]
  },*/
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '修改密码', noCache: true }
      }
    ],
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]
