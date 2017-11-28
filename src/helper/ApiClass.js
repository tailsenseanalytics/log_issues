import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueSession from 'vue-session'
import BootstrapVue from 'bootstrap-vue'

Vue.use(Vuex)
Vue.use(VueSession)
Vue.use(BootstrapVue)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    url: 'http://tailsensesvc-env.izvbyfxjqn.us-east-2.elasticbeanstalk.com',
    version: 'v1',
    url2: 'http://ec2-18-217-69-135.us-east-2.compute.amazonaws.com:8080/Javemonitor/webresources/',
    currentLog: '',
    logpath: '',
    enablesavelogs: false,
    socketCollection: [],
    currentSocket: '',
    baseSocket: 'ws://ec2-18-217-69-135.us-east-2.compute.amazonaws.com:8080/Javemonitor/datachannel/'
  },
  actions: {
    addSocket ({context, state}, socketurl) {
      state.socketCollection[socketurl] = new WebSocket(socketurl)
      state.socketCollection[socketurl].onopen = function (event) {
        console.log('Connection opened successfully with the server')
      }
      state.socketCollection[socketurl].onclose = function (event) {
        console.log('Connection close successfully with the server')
      }
    },
    deleteSocket ({context, state}) {
      state.socketCollection[state.currentSocket].close()
      console.log('Socket deleted')
      delete state.socketCollection[state.currentSocket]
    },
    getSocket ({context, state}, socketurl) {
      return this.socketCollection[socketurl]
    },
    attachListToSocket ({context, state}, params) {
      state.socketCollection[params.socketurl].onmessage = function (event) {
        var dataObject = JSON.parse(event.data)
        if (params.dataArray.length <= params.length) {
          params.dataArray.push(dataObject)
        } else {
          params.dataArray.shift()
          params.dataArray.push(dataObject)
        }
        console.log(dataObject.toString())
        console.log(dataObject.classification_info)
      }
    },
    authenticate ({context, state}, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'authenticate'
          var url = state.url + '/' + state.version + '/' + link
          http.open('POST', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json; version=1')
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send(JSON.stringify({'email': params.email, 'password': params.password}))
        }, 1)
      })
    },
    get_dummy_logs: ({context, state}, oauthkey) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'get_dummy_logs'
          var url = state.url + '/' + state.version + '/' + link
          // var params = 'lorem=ipsum&name=binny'
          http.open('POST', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.setRequestHeader('Authorization', oauthkey)
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send()
        }, 10)
      })
    },
    get_random_issues ({context, state}, oauthkey) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'show_random_issues'
          var url = state.url + '/' + state.version + '/' + link
          http.open('POST', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.setRequestHeader('Authorization', oauthkey)
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send()
        }, 10)
      })
    },
    get_user_info ({context, state}, userparams) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'get_user_info'
          var url = state.url + '/' + state.version + '/' + link
          http.open('POST', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.setRequestHeader('Authorization', userparams.oauth)
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send(JSON.stringify({email: userparams.email}))
        }, 10)
      })
    },
    get_sources_for_user ({context, state}, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'get_sources_for_user'
          var url = state.url + '/' + state.version + '/' + link
          http.open('POST', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.setRequestHeader('Authorization', params.oauth)
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send(JSON.stringify({user_id: params.user_id}))
        }, 10)
      })
    },
    get_logs_for_source ({context, state}, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'get_logs_for_source'
          var url = state.url + '/' + state.version + '/' + link
          http.open('POST', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.setRequestHeader('Authorization', params.oauth)
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send(JSON.stringify({source_id: params.source_id}))
        }, 10)
      })
    },
    get_patterns_for_logs ({context, state}, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'get_patterns_for_log'
          var url = state.url + '/' + state.version + '/' + link
          http.open('POST', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.setRequestHeader('Authorization', params.oauth)
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send(JSON.stringify({log_id: params.log_id}))
        }, 10)
      })
    },
    save_log ({context, state}, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'save_and_classify_logs'
          var url = state.url2 + link
          http.open('PUT', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          console.log(JSON.stringify({'request': params}))
          http.send(JSON.stringify({'request': params}))
        }, 10)
      })
    },
    get_related_issues ({context, state}, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'get_issues_related_log'
          var url = state.url2 + link
          http.open('PUT', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send(JSON.stringify({'log_id': 213, 'log_text': '[Fri Dec 16 01:46:23 2005] [error] [client 1.2.3.4] Directory index forbidden by rule: /home/test/'}
          ))
        }, 10)
      })
    },
    link_logs_to_issue ({context, state}, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var returndata = ''
          var http = new XMLHttpRequest()
          var link = 'link_issue_with_logs'
          var url = state.url2 + link
          http.open('PUT', url, true)
          http.setRequestHeader('content-type', 'application/json')
          http.setRequestHeader('accept', 'application/json')
          http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
              returndata = http.responseText
              resolve(JSON.parse(returndata))
            }
          }
          http.send(JSON.stringify(
            {'request': {'issue_id': 2, 'log_id': 213, 'logInfoList': [{'classification_id': -1, 'message_text': '04-May-2012 08:38:47 com.sun.enterprise.admin.servermgmt.launch.ASLauncher buildCommand INFO: C:/Dev/jdk/1.6/1.6.0_19\binjava'}, {'classification_id': -1, 'message_text': '[Fri Dec 16 01:46:23 2005] [error] [client 1.2.3.4] Directory index forbidden by rule: /home/test/'}]}}
          ))
        }, 10)
      })
    }
  }
})
