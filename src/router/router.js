import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)
const indexPage = resolve => {
    require.ensure([], () => resolve(require('../container/index.vue')), '/index')
}
const suitPage = resolve => {
    require.ensure([], () => resolve(require('../container/suit.vue')), '/suit')
}
const router = new VueRouter({
    base: __dirname,
    linkExactActiveClass:"actived",
    routes: [
        {path:'/index',name:'indexPage',components:{indexPage:indexPage}},
        {path:'/suit',name:'suitPage',components:{suitPage:suitPage}}
    ]
})

export default router;