// import { login, logout, getInfo } from '@/api/user'
import { LoginApi, personal } from '@/request/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // token状态管理
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, pms) {
    // type 区分入口人员分类
    const { username, password, type } = pms
    return new Promise((resolve, reject) => {
      LoginApi({ username: username.trim(), password, type }).then(response => {
        const { data } = response;
        // 保存到vuex
        commit('SET_TOKEN', data.token);

        // 保存到sessionStorage
        setToken(data.token);

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      personal().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        if (data.roles.length == 0) {
          reject('该账号还没有设置等级权限');
        }

        const { nickname, avatar, roles } = data

        commit('SET_NAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

