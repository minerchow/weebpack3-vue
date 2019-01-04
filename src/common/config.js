export default {
    txMapKey:"TDABZ-POUCX-MQJ4G-7O7T2-P3UIH-7WB5O",
    appId:180401,
    env:function(){
        if(location.href.indexOf('dev-gdmind.gaodun.com')>-1 || location.href.indexOf('t-gdmind.gaodun.com')>-1 || location.href.indexOf('t2-gdmind.gaodun.com')>-1){
            return 'https://t-apigateway.gaodun.com';
        }
        else if(location.href.indexOf('pre-gdmind.gaodun.com')>-1){
            return 'https://pre-apigateway.gaodun.com';
        }
        else if(location.href.indexOf('gdmind.gaodun.com')>-1){
            return 'https://apigateway.gaodun.com';
        }
    },
    pre:function(){
        if(location.href.indexOf('dev-gdmind.gaodun.com')>-1){
            return 'dev-';
        }
        else if(location.href.indexOf('t-gdmind.gaodun.com')>-1){
            return 't-';
        }
        else if(location.href.indexOf('pre-gdmind.gaodun.com')>-1){
            return 'pre-';
        }
        else if(location.href.indexOf('gdmind.gaodun.com')>-1){
            return "";
        }
    },
    imgUrl:function(){
        if(location.href.indexOf('dev-gdmind.gaodun.com')>-1 || location.href.indexOf('t-gdmind.gaodun.com')>-1){
            return 'https://t-simg01.gaodunwangxiao.com/';
        }
        else if(location.href.indexOf('pre-gdmind.gaodun.com')>-1){
            return 'https://pre-simg01.gaodunwangxiao.com/';
        }
        else if(location.href.indexOf('gdmind.gaodun.com')>-1){
            return "https://simg01.gaodunwangxiao.com/";
        }
    },
    verityTokenApi(url){
        let arr = ['/lachesis/api/','/skr/api/','/redang/api/','/integral/api/','/vip/api/','/tools/api/'];
        for(let i in arr){
            if(url.indexOf(arr[i])>-1){
                return true;
            }
            
        }
    }
}