// import Cookies from 'js-cookie' // 原方案是cookie技术

const TokenKey = 'Authorization' 

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

// 本地sessionStorage缓存
export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  // 记得加空格,以前是  "Bearer "
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

const Type = 'type';

// type类型
export function getType() {
  return sessionStorage.getItem(Type)
}

export function setType(type) {
  return sessionStorage.setItem(Type, type)
}

export function removeType() {
  return sessionStorage.removeItem(Type)
}
