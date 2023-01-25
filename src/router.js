import Vue from "vue";
import Router from 'vue-router'


Vue.use(Router)
export default new Router({
    mode: 'history',
    routes:[
        {
            path: '/',
            name: 'home',
            component: () => import ('./views/Home')
        },

        {
            path: '/films',
            name: 'films',
            component: () => import ('./views/FilmsPage')
        },
        {
            path: '/serials',
            name: 'serials',
            component: () => import ('./views/Serials')
        },
        {
            path: '/actors',
            name: 'actors',
            component: () => import ('./views/ActorsPage')
        },
        {
            path: '/search',
            name: 'search',
            component: () => import ('./components/SearchResult')
        },
        {
            path: '/films/:title',
            name: 'Title',
            component: () => import ('./views/AboutFilm')
        },
        {
            path: '/likedFilms',
            name: 'LikedFilms',
            component: () => import ('./views/LikedFilms')
        },

        {
            path: '/:name',
            name: 'Name',
            component: () => import ('./views/AboutActor')
        },
        {
            path: '/films/genre/:id',
            name: 'Name',
            component: () => import ('./views/GenrePage')
        },
        {
            path: '/films/user/recommendation',
            name: 'Name',
            component: () => import ('./views/RecommendationPage')
        },





    ]
})