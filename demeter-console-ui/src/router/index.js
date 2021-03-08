import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/views/layout/Layout";

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
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/authredirect"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/errorPage/401"),
    hidden: true,
  },
  {
    path: "",
    component: Layout,
    redirect: "dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "dashboard", icon: "dashboard", noCache: true },
      },
    ],
  },
];

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});

export const asyncRouterMap = [
  /** 会员中心*/
  {
    path: "/creation",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "creation-center",
    meta: {
      title: "作品中心",
      icon: "service",
    },
    children: [
      {
        path: "customer",
        component: () => import("@/views/creation/customer"),
        name: "customer",
        meta: {
          perms: [
            "GET /admin/user/list",
            "POST /admin/user/create",
            "POST /admin/user/read",
          ],
          title: "作者管理",
          icon: "customer",
          noCache: true,
        },
      },
      {
        path: "works",
        component: () => import("@/views/creation/works"),
        name: "works",
        meta: {
          perms: ["GET /admin/address/list"],
          title: "作品管理",
          icon: "map",
          noCache: true,
        },
      },
      {
        path: "vote",
        component: () => import("@/views/creation/vote"),
        name: "vote",
        meta: {
          perms: ["GET /admin/address/list"],
          title: "投票管理",
          icon: "map",
          noCache: true,
        },
      },
    ],
  },
  /** 运营中心*/
  {
    path: "/operation",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "operationCenter",
    meta: {
      title: "运营中心",
      icon: "operation-center",
    },
    children: [
      {
        path: "comment",
        component: () => import("@/views/operation/comment"),
        name: "comment",
        meta: {
          perms: [
            "GET /admin/comment/list",
            "POST /admin/comment/add",
            "POST /admin/comment/edit",
            "GET /admin/comment/show",
            "POST /admin/order/update",
            "POST /admin/order/delete",
          ],
          title: "评论管理",
          icon: "product-comment",
          noCache: true,
        },
      },
      {
        path: "browse",
        component: () => import("@/views/operation/browse"),
        name: "browse",
        meta: {
          perms: [
            "GET /admin/browse/list",
            "GET /admin/browse/read",
            "POST /admin/browse/create",
            "POST /admin/browse/update",
            "POST /admin/browse/delete",
          ],
          title: "浏览管理",
          icon: "order-center",
          noCache: true,
        },
      },
      {
        path: "like",
        component: () => import("@/views/operation/like"),
        name: "like",
        meta: {
          perms: [
            "GET /admin/like/list",
            "GET /admin/like/read",
            "POST /admin/like/create",
            "POST /admin/like/update",
            "POST /admin/like/delete",
          ],
          title: "点赞管理",
          icon: "order-center",
          noCache: true,
        },
      },
      {
        path: "collect",
        component: () => import("@/views/user/collect"),
        name: "collect",
        meta: {
          perms: ["GET /admin/collect/list"],
          title: "收藏管理",
          icon: "operation",
          noCache: true,
        },
      },
    ],
  },
  /** 配置中心*/
  {
    path: "/config",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "config-center",
    meta: {
      title: "配置中心",
      icon: "config-center",
    },
    children: [
      {
        path: "config",
        component: () => import("@/views/config/config"),
        name: "config",
        meta: {
          perms: [
            "GET /admin/config/list",
            "POST /admin/config/create",
            "POST /admin/config/show",
            "POST /admin/config/edit",
            "POST /admin/config/update",
            "POST /admin/config/delete",
          ],
          title: "配置管理",
          icon: "config-center",
          noCache: true,
        },
      },
      {
        path: "parameter",
        component: () => import("@/views/config/parameter"),
        name: "parameter",
        meta: {
          perms: [
            "GET /admin/parameter/list",
            "POST /admin/parameter/create",
            "POST /admin/parameter/update",
            "POST /admin/parameter/delete",
          ],
          title: "参数管理",
          icon: "parameter-center",
          noCache: true,
        },
      },
      {
        path: "dictionary",
        component: () => import("@/views/config/dictionary"),
        name: "dictionary",
        meta: {
          perms: [
            "GET /admin/parameter/list",
            "POST /admin/parameter/create",
            "POST /admin/parameter/update",
            "POST /admin/parameter/delete",
          ],
          title: "数据字典",
          icon: "dictionary-center",
          noCache: true,
        },
      },
      {
        path: "dictionaryitem",
        component: () => import("@/views/config/dictionaryitem"),
        name: "dictionaryitem",
        meta: {
          perms: [
            "GET /admin/dictionary/item/list",
            "POST /admin/dictionary/item/create",
            "POST /admin/dictionary/item/update",
            "POST /admin/dictionary/item/delete",
          ],
          title: "字典项管理",
          icon: "dictionary-item",
          noCache: true,
        },
      },
    ],
  },
  /**商城中心*/
  {
    path: "/mall",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "mall-center",
    meta: {
      title: "商城中心",
      icon: "product-list",
    },
    children: [
      {
        path: "product",
        component: () => import("@/views/mall/product"),
        name: "goodsList",
        meta: {
          perms: ["GET /admin/goods/list", "POST /admin/goods/delete"],
          title: "商品管理",
          icon: "product",
          noCache: true,
        },
      },
      {
        path: "category",
        component: () => import("@/views/mall/category"),
        name: "category",
        meta: {
          perms: [
            "GET /admin/category/list",
            "POST /admin/category/create",
            "GET /admin/category/read",
            "POST /admin/category/update",
            "POST /admin/category/delete",
          ],
          title: "类目管理",
          icon: "product-category",
          noCache: true,
        },
      },
      {
        path: "comment",
        component: () => import("@/views/mall/comment"),
        name: "goodsComment",
        meta: {
          perms: [
            "GET /admin/comment/list",
            "POST /admin/comment/create",
            "POST /admin/comment/delete",
          ],
          title: "商品评价",
          icon: "product-comment",
          noCache: true,
        },
      },
      {
        path: "order",
        component: () => import("@/views/mall/order"),
        name: "order-center",
        meta: {
          perms: [
            "GET /admin/comment/list",
            "POST /admin/comment/create",
            "POST /admin/comment/delete",
          ],
          title: "订单管理",
          icon: "product-comment",
          noCache: true,
        },
      },
    ],
  },
  /**礼品中心*/
  {
    path: "/logistics",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "logistics-center",
    meta: {
      title: "礼品中心",
      icon: "guide",
    },
    children: [
      {
        path: "prize",
        component: () => import("@/views/logistics/prize"),
        name: "prize",
        meta: {
          perms: [
            "GET /admin/topic/list",
            "POST /admin/topic/create",
            "GET /admin/topic/read",
            "POST /admin/topic/update",
            "POST /admin/topic/delete",
          ],
          title: "奖项管理",
          icon: "libra",
          noCache: true,
        },
      },
      {
        path: "award",
        component: () => import("@/views/logistics/award"),
        name: "award",
        meta: {
          perms: [
            "GET /admin/topic/list",
            "POST /admin/topic/create",
            "GET /admin/topic/read",
            "POST /admin/topic/update",
            "POST /admin/topic/delete",
          ],
          title: "奖品管理",
          icon: "libra",
          noCache: true,
        },
      },
      {
        path: "lottery",
        component: () => import("@/views/logistics/lottery"),
        name: "lottery",
        meta: {
          perms: [
            "GET /admin/topic/list",
            "POST /admin/topic/create",
            "GET /admin/topic/read",
            "POST /admin/topic/update",
            "POST /admin/topic/delete",
          ],
          title: "开奖管理",
          icon: "libra",
          noCache: true,
        },
      },
      {
        path: "distribute",
        component: () => import("@/views/logistics/distribute"),
        name: "distribute",
        meta: {
          perms: [
            "GET /admin/topic/list",
            "POST /admin/topic/create",
            "GET /admin/topic/read",
            "POST /admin/topic/update",
            "POST /admin/topic/delete",
          ],
          title: "颁奖管理",
          icon: "libra",
          noCache: true,
        },
      },
    ],
  },
  /**活动中心*/
  {
    path: "/community",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "community-center",
    meta: {
      title: "活动中心",
      icon: "guide",
    },
    children: [
      {
        path: "template",
        component: () => import("@/views/community/template"),
        name: "template-center",
        meta: {
          perms: [
            "GET /admin/topic/list",
            "POST /admin/topic/create",
            "GET /admin/topic/read",
            "POST /admin/topic/update",
            "POST /admin/topic/delete",
          ],
          title: "模板管理",
          icon: "libra",
          noCache: true,
        },
      },
      {
        path: "activity",
        component: () => import("@/views/community/activity"),
        name: "activity",
        meta: {
          perms: [
            "GET /admin/topic/list",
            "POST /admin/topic/create",
            "GET /admin/topic/read",
            "POST /admin/topic/update",
            "POST /admin/topic/delete",
          ],
          title: "活动管理",
          icon: "libra",
          noCache: true,
        },
      },
      {
        path: "enroll",
        component: () => import("@/views/community/enroll"),
        name: "enroll",
        meta: {
          perms: [
            "GET /admin/topic/list",
            "POST /admin/topic/create",
            "GET /admin/topic/read",
            "POST /admin/topic/update",
            "POST /admin/topic/delete",
          ],
          title: "报名管理",
          icon: "libra",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/system",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "system-center",
    meta: {
      title: "系统中心",
      icon: "setting",
    },
    children: [
      {
        path: "admin",
        component: () => import("@/views/system/admin"),
        name: "admin",
        meta: {
          perms: [
            "GET /admin/user/list",
            "POST /admin/user/create",
            "POST /admin/user/edit",
            "POST /admin/user/update",
            "POST /admin/user/delete",
          ],
          title: "用户管理",
          icon: "user",
          noCache: true,
        },
      },
      {
        path: "role",
        component: () => import("@/views/system/role"),
        name: "role",
        meta: {
          perms: [
            "GET /admin/role/list",
            "POST /admin/role/create",
            "POST /admin/role/show",
            "POST /admin/role/update",
            "POST /admin/role/edit",
            "POST /admin/role/delete",
            "GET /admin/permission/list",
            "POST /admin/permission/update",
          ],
          title: "角色管理",
          icon: "team",
          noCache: true,
        },
      },
      {
        path: "storage",
        component: () => import("@/views/system/storage"),
        name: "storage",
        meta: {
          perms: [
            "GET /admin/storage/list",
            "POST /admin/storage/create",
            "POST /admin/storage/update",
            "POST /admin/storage/delete",
          ],
          title: "文件管理",
          icon: "cloud",
          noCache: true,
        },
      },
      {
        path: "region",
        component: () => import("@/views/system/region"),
        name: "region",
        meta: {
          perms: [
            "GET /admin/region/list",
            "GET /admin/region/detail",
            "POST /admin/order/region",
            "POST /admin/order/orderrefund",
            "POST /admin/order/orderreply",
          ],
          title: "区域管理",
          icon: "region-center",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/enterprise",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "enterprise-center",
    meta: {
      title: "企业中心",
      icon: "enterprise-center",
    },
    children: [
      {
        path: "employee",
        component: () => import("@/views/enterprise/employee"),
        name: "employee",
        meta: {
          perms: [
            "GET /admin/employee/list",
            "POST /admin/employee/create",
            "POST /admin/employee/update",
            "POST /admin/employee/delete",
          ],
          title: "员工管理",
          icon: "user",
          noCache: true,
        },
      },
      {
        path: "company",
        component: () => import("@/views/enterprise/company"),
        name: "company",
        meta: {
          perms: [
            "GET /admin/company/list",
            "POST /admin/company/create",
            "POST /admin/company/update",
            "POST /admin/company/delete",
          ],
          title: "公司管理",
          icon: "nested",
          noCache: true,
        },
      },
      {
        path: "information",
        component: () => import("@/views/enterprise/information"),
        name: "information",
        meta: {
          perms: [
            "GET /admin/information/list",
            "POST /admin/information/create",
            "POST /admin/information/update",
            "POST /admin/information/delete",
          ],
          title: "信息管理",
          icon: "nested",
          noCache: true,
        },
      },
    ],
  },
  /**数据中心*/
  {
    path: "/stat",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "analysis-center",
    meta: {
      title: "数据中心",
      icon: "data",
    },
    children: [
      {
        path: "user",
        component: () => import("@/views/stat/user"),
        name: "statUser",
        meta: {
          perms: ["GET /admin/stat/user"],
          title: "会员统计",
          icon: "bussiness-card",
          noCache: true,
        },
      },
      {
        path: "order",
        component: () => import("@/views/stat/order"),
        name: "statOrder",
        meta: {
          perms: ["GET /admin/stat/order"],
          title: "订单统计",
          icon: "chart",
          noCache: true,
        },
      },
      {
        path: "goods",
        component: () => import("@/views/stat/goods"),
        name: "statGoods",
        meta: {
          perms: ["GET /admin/stat/goods"],
          title: "商品统计",
          icon: "excel",
          noCache: true,
        },
      },
    ],
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
    path: "/profile",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    children: [
      {
        path: "password",
        component: () => import("@/views/profile/password"),
        name: "password",
        meta: { title: "修改密码", noCache: true },
      },
    ],
    hidden: true,
  },

  { path: "*", redirect: "/404", hidden: true },
];
