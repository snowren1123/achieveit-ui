import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Project from '../components/Project.vue'

import BasicInfo from '../components/BasicInfo.vue'
import ClientInfo from '../components/ClientInfo.vue'
import TeamInfo from '../components/TeamInfo.vue'
import BossPanel from '../components/BossPanel.vue'
import BossPending from '../components/BossPending.vue'
import EPGLeader from '../components/EPGLeader.vue'
import QALeader from '../components/QALeader.vue'
import OrgConfig from '../components/OrgConfigPanel.vue'
import OrgGitset from '../components/OrgGitset.vue'
import Device from '../components/Device.vue'

import ProjectList from '../components/ProjectList.vue'
import BasicTimeSheet from '../components/BasicTimeSheet.vue'
import CheckTimeSheet from '../components/CheckTimeSheet.vue'

Vue.use(Router)

export default new Router({
    //mode:'hash',
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
            component: Home,
            redirect: '/home/projectlist',
            children: [{
                path: 'ProjectList',
                component: ProjectList
            },
            {
                path: 'BasicTimeSheet',
                component: BasicTimeSheet
            },
            {
                path: 'CheckTimeSheet',
                component: CheckTimeSheet
            }
            ]
        },
        {
            path: '/Boss',
            redirect: '/boss/pending',
            component: BossPanel,
            children: [
                {
                    path: 'Pending',
                    component: BossPending
                }
            ]
        },
        {
            path: '/EPGLeader',
            component: EPGLeader
        },
        {
            path: '/QALeader',
            component: QALeader
        },
        {
            path: '/OrgConfig',
            redirect: '/orgconfig/gitset',
            component: OrgConfig,
            children: [
                {
                    path: 'Gitset',
                    component: OrgGitset
                }
            ]
        },
        {
            path: '/Project',
            component: Project,
            redirect: 'project/basic',
            children: [
                {
                    path: 'Basic',
                    component: BasicInfo
                },
                {
                    path: 'Client',
                    component: ClientInfo
                },
                {
                    path: 'Team',
                    component: TeamInfo
                },
                {
                    path: 'Device',
                    component: Device
                }
            ]
        }
    ]
})
