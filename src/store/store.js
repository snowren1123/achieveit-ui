import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        personId: {},
        projectBasicId: {},
        checkTimeSheetTotal: 0
    },
    mutations: {
        setUserId(state, personId) {
            state.personId = personId;
        },
        setProjectBasicId(state, projectId) {
            state.projectBasicId = projectId;
        },
        setCheckTimeSheetTotal(state, checkTimeSheetTotal) {
            state.checkTimeSheetTotal = checkTimeSheetTotal;
        }
    }
})