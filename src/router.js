import Vue from "vue";
import Router from 'vue-router'


Vue.use(Router)
export default new Router({
    mode: 'history',
    routes:[
        {
            path: '/',
            name: 'suit-statistic',
            component: () => import ('./views/suit-statistic')
        },
        {
            path: '/leverage/pol',
            name: 'leverage',
            component: () => import ('./views/ourPlatforms/OurLeverageCreatedOrdersPol')
        },
        {
            path: '/leverage/usdc',
            name: 'leverage',
            component: () => import ('./views/ourPlatforms/OurLeverageCreatedOrdersUsdc')
        },

        {
            path: '/suit-statistic',
            name: 'suit-statistic',
            component: () => import ('./views/suit-statistic')
        },
        {
            path: '/statistic/orders/:id',
            name: 'orders',
            component: () => import ('./views/statistic/orders')
        },
        {
            path: '/statistic/price/:id',
            name: 'orders',
            component: () => import ('./views/statistic/price')
        },

    ]
})