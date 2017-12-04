
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('user.sqlite3');

 
var rolling = null,
    step = 0,
    table_data = '';
var ltindex = 0;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('user.sqlite3');
var result_html = '', 
    ids='', 
    result_user_id  = [],
    result_user_ids = [];

var province = {"11":"\u5317\u4eac","12":"\u5929\u6d25","13":"\u6cb3\u5317\u7701","14":"\u5c71\u897f\u7701","15":"\u5185\u8499\u53e4\u81ea\u6cbb\u533a","21":"\u8fbd\u5b81\u7701","22":"\u5409\u6797\u7701","23":"\u9ed1\u9f99\u6c5f\u7701","31":"\u4e0a\u6d77","32":"\u6c5f\u82cf\u7701","33":"\u6d59\u6c5f\u7701","34":"\u5b89\u5fbd\u7701","35":"\u798f\u5efa\u7701","36":"\u6c5f\u897f\u7701","37":"\u5c71\u4e1c\u7701","41":"\u6cb3\u5357\u7701","42":"\u6e56\u5317\u7701","43":"\u6e56\u5357\u7701","44":"\u5e7f\u4e1c\u7701","45":"\u5e7f\u897f\u58ee\u65cf\u81ea\u6cbb\u533a","46":"\u6d77\u5357\u7701","50":"\u91cd\u5e86","51":"\u56db\u5ddd\u7701","52":"\u8d35\u5dde\u7701","53":"\u4e91\u5357\u7701","54":"\u897f\u85cf\u81ea\u6cbb\u533a","61":"\u9655\u897f\u7701","62":"\u7518\u8083\u7701","63":"\u9752\u6d77\u7701","64":"\u5b81\u590f\u56de\u65cf\u81ea\u6cbb\u533a","65":"\u65b0\u7586\u7ef4\u543e\u5c14\u81ea\u6cbb\u533a","71":"\u53f0\u6e7e\u7701","81":"\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a","82":"\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a","99":"\u6d77\u5916"};


var oneRoll = {
    do_action: function(act) {
            
            if (act == 'start') {
                result_html = '';
                result_user_id = []
                db.serialize(function() {
                    db.each("SELECT username,province,mobile,id FROM user where id in (select id from user where id not in ("+ids+") order by RANDOM() limit 9) ", function(err, row) {
                        result_user_id.push(row.id)
                        result_html += '<tr><td width=110>'+row.username+'</td><td width=120>'+province[row.province]+'</td><td width>'+row.mobile+'</td></tr>';
                    },function() {
                        document.getElementById('table').innerHTML = result_html;
                    });
                });
            }
            else if (act == 'stop') {
                result_user_ids = result_user_ids.concat(result_user_id);
                ids = result_user_ids.join(',');
            }
            else {}
        }
    }

function buttonClicked(){
    step += 1;
    index = parseInt(step/2);
    next_index = index + 1;
    pre_index = index - 1;
    if (step > 10) {
        document.getElementById('button').removeEventListener('click', buttonClicked, false);
        return false;
    }
    if(step%2 == 1){
        data_html = document.getElementById('table').innerHTML;
        if (data_html != '') { 
            document.getElementById('user-area-' + index).innerHTML 
                = "<table>"+data_html+"</table>";
        }
        rolling = setInterval(()=>{oneRoll.do_action('start')}, 50);
    
    }
    else {
        
        clearTimeout(rolling);
        oneRoll.do_action('stop');
        oldClassName = document.getElementById('info-'+index).className;
        document.getElementById('info-'+index).className = oldClassName + " acitved";
    }
    return false;
}

function screen_zoom_by(num) {
    page_zoom = document.getElementById("page").style.zoom;
    if (page_zoom == '') { page_zoom = 1; }
    document.getElementById("page").style.zoom = parseFloat(page_zoom) + num;
}

document.onkeydown = function(event){ 
    e = event ? event :(window.event ? window.event : null); 
    if(e.keyCode == 13){ 
    buttonClicked();
    } 
    else if(e.keyCode == 187){ 
    screen_zoom_by(0.05);
    } 
    else if(e.keyCode == 189){ 
    screen_zoom_by(-0.05);
    } 
} 
document.getElementById('button').addEventListener('click', buttonClicked);
