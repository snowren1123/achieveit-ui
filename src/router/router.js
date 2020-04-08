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
import OrgArchives from '../components/OrgArchives.vue'
import ProjectDevice from '../components/ProjectDevice.vue'
import MyDevice from '../components/MyDevice.vue'

import ProjectList from '../components/ProjectList.vue'
import BasicTimeSheet from '../components/BasicTimeSheet.vue'
import CheckTimeSheet from '../components/CheckTimeSheet.vue'

import BasicReviewInfo from '../components/BasicReviewInfo.vue'
import MyReportReview from '../components/MyReportReview.vue'
import MyProcessReview from '../components/MyProcessReview.vue'

import RiskOwn from '../components/RiskOwn.vue'
import RiskRelated from '../components/RiskRelated.vue'

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
            },
            {
                path: 'MyReportReview',
                component: MyReportReview
            },
            {
                path: 'MyProcessReview',
                component: MyProcessReview
            },
            {
                path: 'MyDevice',
                component: MyDevice
            },
            {
                path: 'RiskOwn',
                component: RiskOwn
            },
            {
                path: 'RiskRelated',
                component: RiskRelated
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
                },
                {
                    path: 'OrgArchives',
                    component: OrgArchives
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
                    path: 'ProjectDevice',
                    component: ProjectDevice
                },
                {
                    path: 'ReviewList',
                    component: BasicReviewInfo
                }
            ]
        }
    ]
})
