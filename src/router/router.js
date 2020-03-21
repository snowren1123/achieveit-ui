import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Project from '../components/Project.vue'

import BasicInfo from '../components/BasicInfo.vue'
import Two from '../components/two.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',       
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            path: '/Login',
            component: Login
        },
        {
            path: '/Home',
            component: Home
        },
        {
            path: '/Project',
            component: Project,
            children:[
                {
                    path: 'Info',
                    component: BasicInfo
                },
                {
                    path: 'Two',
                    component: Two
                }
            ]
        }
    ]
})
