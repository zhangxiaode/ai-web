// @ts-ignore
import Cookies from 'js-cookie'
import { getUserDetail } from "@/apis/index";

export function setToken(token: any) {
    localStorage.setItem("Authorization", token)
    Cookies.set('Authorization', token)
}

export function getToken() {
    return Cookies.get('Authorization') || localStorage.getItem("Authorization")
}

export function removeToken() {
    localStorage.removeItem("Authorization")
    Cookies.remove('Authorization')
}

export function setUser(user: any) {
    localStorage.setItem("user", JSON.stringify(user))
    Cookies.set('user', JSON.stringify(user))
}

export async function getUser() {
    const user: string = Cookies.get('user') || localStorage.getItem("user") as string
    if(user) {
        return JSON.parse(user)
    } else {
        const user_info: any = await getUserDetail()
        setUser(user_info.data)
        return user_info.data
    }
}

export function removeUser() {
    localStorage.removeItem("user")
    Cookies.remove('user')
}