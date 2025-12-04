// @ts-ignore
import Cookies from 'js-cookie'

export function getToken() {
    return Cookies.get('Authorization') || localStorage.getItem("Authorization")
}

export function setToken(token: any) {
    localStorage.setItem("Authorization", token)
    Cookies.set('Authorization', token)
}

export function removeToken() {
    localStorage.removeItem("Authorization")
    Cookies.remove('Authorization')
}