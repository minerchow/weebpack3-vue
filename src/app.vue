<template>
<div id="app">
     <router-view name="indexPage"></router-view>
     <router-view name="suitPage"></router-view>
</div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';



// import ELEMENT from 'element-ui';
// if (!window.ELEMENT) Vue.use(ELEMENT)

export default {
    mounted(){
    }
};
</script>
