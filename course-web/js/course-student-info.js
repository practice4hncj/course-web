/**
 * 课程 - 学生情况页面
 */

let cid = '';
let sign = '';

// 入口函数
$(function () {
    cid = getQuery('cid');
    sign = getQuery('sign');

    checkLogin();

    (async () => {
        let url = API.STUDENT_API.STATISTIC;
        let param = {
            courseid: cid
        };
        let [err, data] = await awaitWrap(post(url, param));
        if (err) {
            toastr.error(err);
        } else {
            console.log(data);
            let infos = data.data;
            let html = '';
            infos.forEach(info => {
               html += `
                <tr>
                    <td>${info['sno']}</td>
                    <td>${info['sname']}</td>
                    <td>${info['finpapernum']}/${info['totalpapernum']}</td>
                    <td>${info['commentnum']}</td>
                    <td>0</td>
                </tr>
               `;
            });
            $('#studentInfoTableBody').html(html);
        }
    })();

    loadEvents();
});


// 检查登录
function checkLogin() {
    if (sign !== md5(localStorage['course-web-curr-teacher-username'] + localStorage['course-web-curr-teacher-password'])) {
        window.location.href = 'user-login.html';
    }

    // // 更改头像和id
    $('#tid').text(localStorage['course-web-curr-teacher-username']);
    $('#headAvatar').attr('src', localStorage['course-web-curr-teacher-avatar']);

}


// 加载事件
function loadEvents() {
    // 导出成绩单
    {
        $('#exportTable').click(() => {
            tableExport('studentInfoTable', 'student-info', 'xls');
        });
    }
}