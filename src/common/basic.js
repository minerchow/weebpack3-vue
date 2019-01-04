import axios from 'axios';
import config from '../common/config';
import Util from '../common/util';
import jsonp from 'jsonp';
import util from '../common/util';
var base64url = require('base64-url');
var qs = require('qs');
let getTokenInterval;
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.status == 553649434) {
        location.href = "/#/login";
        localStorage.removeItem('gdmindNavgations');
        localStorage.removeItem('gdmindUserId');
        localStorage.removeItem('gdmindUserName');
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default {
    accesstimeUrl: '',
    accesstime: '',
    refreshtimrUrl: '',
    refreshtime: '',
    nowTime: '',
    diffTime: '',
    setTime: '',
    getToken() {
        let that = this;
        let instance = axios.create({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        let formData = qs.stringify({
            appid: config.appId,
            refreshtoken: Util.getCookie('refreshToken')
        })

        if (Util.getCookie('refreshToken')) {
            instance.post(config.env() + '/api/v1/token/refreshtoken', formData).then((result) => {
                if (result.data.status == 0) {
                    Util.setCookie('accessToken', result.data.result);
                    // window.location.reload();
                    that.accesstimeUrl = Util.getCookie('accessToken').split('.')[1];
                    that.accesstime = JSON.parse(base64url.decode(that.accesstimeUrl)).exp;
                    that.refreshtimrUrl = Util.getCookie('refreshToken').split('.')[1];
                    that.refreshtime = JSON.parse(base64url.decode(that.refreshtimrUrl)).exp;
                    that.nowTime = Math.floor(new Date().getTime() / 1000);
                    that.diffTime = that.accesstime - that.nowTime;
                    that.setTime = that.diffTime - 1800;

                    if (that.nowTime > that.refreshtime) {

                        // that.$router.push({path:'/login'});
                        window.location.href = '/#/login';
                        Util.delCookie('accessToken');
                        Util.delCookie('refreshToken');
                        window.location.reload();
                    }
                } else {

                    window.location.href = '/#/login';
                    Util.delCookie('accessToken');
                    Util.delCookie('refreshToken');
                    window.location.reload();
                }
                that.setTime < 0 && (that.setTime = 60);
                getTokenInterval = setTimeout(() => {
                    that.getToken()
                }, that.setTime * 1000)


            })
        } else {

            window.location.href = '/#/login';
            window.location.reload();
        }

    },
    clearTimeToken() {
        clearTimeout(getTokenInterval)
    },
    getsession() {
        if (Util.getCookie(config.pre() + 'GDSID')) {
            let GDSSID = Util.getCookie(config.pre() + 'GDSID');
            let instance2 = axios.create({
                headers: {
                    'Authentication': 'Basic ' + Util.getCookie('accessToken')
                }
            });
            instance2.get(config.env() + '/vigo/api/v1/getsession?GDSID=' + GDSSID + "&appId=" + config.appId).then((result) => {
                if (result.data.status == 0) {
                    localStorage.setItem('gdmindUserId', JSON.stringify(result.data.result.Tpo_Aliyun_MQ[0].UserId));
                    localStorage.setItem('gdmindNavgations', JSON.stringify(result.data.result.Tpo_Sys_Navigations))
                    localStorage.setItem('gdmindUserName', JSON.stringify(result.data.result.Tpo_Sys_Users.UserName))
                    // if(window.location.href.indexOf('/index/livelist')==-1){
                    //     location.href="/#/index/livelist";
                    // }
                } else {

                    if (window.location.href.indexOf('/#/login') == -1) {
                        // this.$message.error(result.data.info);
                        location.href = "/#/login";
                    }
                }
            })
        }
    },
   
    gdAjax(obj) {
        return new Promise((resolve,reject)=>{
            var param;
            obj.methodType = obj.methodType.toUpperCase();
            param = obj.param;
            
            if(obj.headers){
                if(obj.headers['Content-Type'] == 'application/x-www-form-urlencoded' && !obj.upload){
                    param = qs.stringify(obj.param)
                }
            }
            if(obj.methodType=='JSONP'){
                jsonp(obj.url,null,(err,data)=>{
                    if (err) {
                        reject(err);
                    }else{
                        resolve(data);
                    }
                })
            }else{
              if(obj.url.indexOf('?token=')==-1 && (config.verityTokenApi(obj.url)) ){
                    obj.url = obj.url + "?token=" + Util.getCookie('accessToken')
                }
                //query直接用字符串拼接
                if(obj.query){
                    obj.url = obj.url + obj.query
                }
                axios({
                    method:obj.methodType ? obj.methodType : "GET",
                    url:obj.url,
                    headers:obj.headers,
                    data:(obj.methodType == "POST" || obj.methodType == "PUT" || obj.methodType == "PATCH") ? param : {},
                    params:(obj.methodType=="GET" || obj.methodType=="DELETE") ? param : {},
                    timeout:obj.timeout?obj.timeout:6000,
                }).then((response)=>{
                    if(response.data.status == 0){
                       if(response.data.data){
                            resolve(response.data.data)
                        }else{
                            resolve(response.data)
                        }
                    }else{
						if(response.data.status==553649434){
                            location.href = '/#/login'
                        }
                        
                        if(response.data.status == 1){
                            resolve(response.data)
                        }else{
                            reject(response.data)
                        }
                        
                    }
                },(error)=>{
                   reject(error)
                })
            }
            
        })

    },
    uploadFile(obj) {
        return new Promise((resolve, reject) => {
            let fd = new FormData();
            if (!obj.fileType) {
                obj.fileType = 'img'
            }
            fd.append("file", obj.fileObj);
            fd.append("file_name", obj.fileObj.name);
            fd.append("item_name", obj.itemName);
            fd.append("file_type", obj.fileType);
            if (!obj.uploadUrl) {
                obj.uploadUrl = "/base/v1/upload/upload";
            }
            this.gdAjax({
                methodType: "POST",
                url: config.env() + obj.uploadUrl,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                upload: true,
                param: fd
            }).then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
        })
    }
}