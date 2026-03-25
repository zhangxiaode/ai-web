import loading from './loading'
import { App } from 'vue-demi';

// 添加全局指令
const directives = [ loading ]

export default {
    install(app: App){
        directives.map(item => {
            app.directive(item.key, item.value)
        })
    }
}