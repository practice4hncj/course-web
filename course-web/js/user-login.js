/**
 * 用户登录页面
 */

// 入口函数
$(function () {
    loadEvents();
});


/**
 * 加载事件
 */
function loadEvents() {
    // 菜单切换
    switchDivTab([
        new DivTab('#userLogin', '.user'),
        new DivTab('#adminLogin', '.admin')
    ]);

    // 管理员登录
    $('#adminLoginForm').submit(() => {
        simpleLogin({
            username: $('#adminUsername').val(),
            password: $('#adminPassword').val(),
            type: 3
        }, (data) => {
            // 存储账号密码到 localStorage中
            console.log(data);
            localStorage.setItem('course-web-curr-admin-username', data.data['adminAccount']);
            localStorage.setItem('course-web-curr-admin-password', data.data['adminPwd']);
            // 跳转到管理页面
            // window.location.href = 'admin.html';
        });
        return false;
    });

    // 教师登录
    $('#userLoginForm').submit(() => {
        let username = $('#teacherUsername').val();
        let password = $('#teacherPassword').val();
        simpleLogin({
            username: username,
            password: password,
            type: 2
        }, () => {

        });
        return false;
    });

}


function simpleLogin(param, success) {
    let url = API.ACCOUNT_API.LOGIN;
    post(url, param).then(data => {
        toastr.success('登录成功！');
        if (success) {
            success(data);
        }
    }).catch((reason => {
        if (isString(reason)) {
            toastr.warning(reason);
        } else {
            toastr.error(ErrorCode["10001"]);
        }
    }));
}