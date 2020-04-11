import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        personId: {},
        personTitle: {},
        projectBasicId: {},
        roleInProject: {},
        checkTimeSheetTotal: 0
    },
    mutations: {
        setUserId(state, personId) {
            state.personId = personId;
        },
        setUserTitle(state, personTitle){
            state.personTitle = personTitle;
        },
        setProjectBasicId(state, projectId) {
            state.projectBasicId = projectId;
        },
        setRoleInProject(state, projectRole){
            state.roleInProject = projectRole;
        },
        setCheckTimeSheetTotal(state, checkTimeSheetTotal) {
            state.checkTimeSheetTotal = checkTimeSheetTotal;
        }
    }
})