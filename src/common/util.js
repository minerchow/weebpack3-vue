///日期时间格式化
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
Date.prototype.format = function (time) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(time)) {
        time = time.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(time)) {
            time = time.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return time;
};
export default {
    base64Url:'',
    setCookie: function (key, value, time) {
        if (!time) {
            time = 1.5 * 3600 * 1000;
        }
        var exp = new Date();
        exp.setTime(exp.getTime() + time);
        value = encodeURIComponent(value);
        var hostname = location.hostname;
        if (hostname.indexOf('gaodun.com') > -1) {
            hostname = '.gaodun.com';
        }
        document.cookie = key + "=" + value + "; domain=" + hostname + ";expires=" + exp.toString();

    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        }
        else {
            return null;
        }
    },
    delCookie: function (name) {
        this.setCookie(name, "", -1);
    },
    //传入时间 2018-04-23 16：00
    convertStamp: function (time) {
        var date = new Date(time);
        return date.getTime();
    },
    convertTime: function (day, time) {
        return new Date(day).getFullYear() + "-" + parseInt(new Date(day).getMonth() + 1) + "-" +
            new Date(day).getDate() + " " + time;

    },
    convertWeek(time) {
        let week;
        let timedat = (new Date(time * 1000))

        if (timedat.getDay() == 0) week = "日";
        if (timedat.getDay() == 1) week = "一";
        if (timedat.getDay() == 2) week = "二";
        if (timedat.getDay() == 3) week = "三";
        if (timedat.getDay() == 4) week = "四";
        if (timedat.getDay() == 5) week = "五";
        if (timedat.getDay() == 6) week = "六";

        return week;
    },
    scrollTo(id) {
        var _id = document.getElementById(id);
        window.scrollTo(0, _id.offsetTop);
    },

    //focus到表单输入框
    focusInput(id) {
        document.getElementById(id).focus();
        document.getElementById(id).blur();
        document.getElementById(id).focus();
    },
    //导出excel
    exportExcel(JSONData, FileName,title,filter) {
        if(!JSONData)
        return;
    //转化json为object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;  

    var excel = "<table>";      

    //设置表头  
    var row = "<tr>";  

    if(title)
    {
        //使用标题项
        for (var i in title) {  
            row += "<th align='center'>" + title[i] + '</th>';
        }  

    }
    else{
        //不使用标题项
        for (var i in arrData[0]) {  
            row += "<th align='center'>" + i + '</th>';
        } 
     }

        excel += row + "</tr>";  

    //设置数据  
    for (var i = 0; i < arrData.length; i++) {  
        var row = "<tr>";  

        for (var index in arrData[i]) {
            //判断是否有过滤行
            if(filter)
            {
                if(filter.indexOf(index)==-1)
                {
                     var value = arrData[i][index] == null ? "" : arrData[i][index];  
                     row += '<td>' + value + '</td>'; 
                } 
            }
            else
            {
                 var value = arrData[i][index] == null ? "" : arrData[i][index];  
                 row += "<td align='center'>" + value + "</td>"; 
            }    
        }  

        excel += row + "</tr>";  
            }  

            excel += "</table>";  

            var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";  
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';  
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';  
    excelFile += '; charset=UTF-8">';  
    excelFile += "<head>";  
    excelFile += "<!--[if gte mso 9]>";  
    excelFile += "<xml>";  
    excelFile += "<x:ExcelWorkbook>";  
    excelFile += "<x:ExcelWorksheets>";  
    excelFile += "<x:ExcelWorksheet>";  
    excelFile += "<x:Name>";  
    excelFile += "{worksheet}";  
    excelFile += "</x:Name>";  
    excelFile += "<x:WorksheetOptions>";  
    excelFile += "<x:DisplayGridlines/>";  
    excelFile += "</x:WorksheetOptions>";  
    excelFile += "</x:ExcelWorksheet>";  
    excelFile += "</x:ExcelWorksheets>";  
    excelFile += "</x:ExcelWorkbook>";  
    excelFile += "</xml>";  
    excelFile += "<![endif]-->";  
    excelFile += "</head>";  
    excelFile += "<body>";  
    excelFile += excel;  
    excelFile += "</body>";  
    excelFile += "</html>";  


    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);  

    var link = document.createElement("a");      
    link.href = uri;  

    link.style = "visibility:hidden";  
    link.download = FileName + ".xls";  

    document.body.appendChild(link);  
    link.click();  
    document.body.removeChild(link); 

},

//验证是否数字
checkNumber(theObj){
    return /^[0-9]+.?[0-9]*$/.test(theObj);
},
compressImage (url) {
   return new Promise((resolve,reject)=>{
        let cvs = document.createElement('canvas')
        let ctx = cvs.getContext('2d')
        let img = new window.Image()
        img.src = url;
        img.onload = () => {
        cvs.width = img.width
        cvs.height = img.height
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
        this.base64uRL = cvs.toDataURL('image/jpeg', 0.1)
        if(this.base64uRL){
                resolve(this.base64uRL)
            }else{
                reject('error')
            }
        }
    })
 },
 convertToBinary (dataURI) {
    let byteString = window.atob(dataURI.split(',')[1])
    let ab = new ArrayBuffer(byteString.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    let bb = new window.Blob([ ab ])
    return bb
  }
}