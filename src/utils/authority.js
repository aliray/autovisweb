
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  var exp = 30 * 60 * 1000 ; // 1小时秒数
  if(localStorage.getItem('autoVis')) {
    var vals = localStorage.getItem('autoVis'); // 获取本地存储的值 
    var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
    // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
    console.log(new Date().getTime());
    var isTimed = (new Date().getTime() - dataObj.timer) > exp;
    if(isTimed) {
         console.log("存储已过期");
         localStorage.removeItem('autoVis');
         return null;
    } else {
         return dataObj.val;
    }
  } else {
    return null;
  }
}

// 需设置过期时间
export function setAuthority(value) {
  var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
  if(value == undefined){
    return;
  }
  var valueDate = JSON.stringify({
       val: value,
       timer: curtime
  });

  return localStorage.setItem('autoVis', valueDate);
}

// 清除缓存
export function clearCookie(){
  localStorage.clear();
}