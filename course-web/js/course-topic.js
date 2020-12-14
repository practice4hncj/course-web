/**
 * 课程 - 话题页面
 */


// 入口函数
$(function () {
    // 加载试卷信息
    (async () => {
        await loadTopics();
    })();
});


// 加载话题
async function loadTopics() {
    let cid = parent.currCourseId;
    let url = API.TOPIC_APT.FIND;

    let [err, data] = await awaitWrap(post(url, {
        courseid: cid
    }));


    if (err) {
        toastr.error(err);
    } else {
        let topics = data.data;
        let html = '';

        topics.forEach(topic => {
            html += `
            <li>
                <div class="left">
                    <img src="${localStorage['course-web-curr-teacher-avatar']}" alt="">
                </div>
                <div class="right">
                    <h4 class="topic-time">${formatTime(topic['committime'])}</h4>
                    <!--suppress HtmlUnknownAttribute -->
                    <h3 topicid="${topic['topicid']}" class="topic-title">${topic['topictitle']}</h3>
                    <h4 class="topic-content">${topic['topiccontent']}</h4>
                </div>
                 <!--suppress HtmlUnknownAttribute -->
                <div topicid="${topic['topicid']}" class="delete-topic"></div>
            </li>
            `;
        });
        $('.topics-ul').html(html);
        loadTopicEvents();
    }
}


// 加载话题的事件
function loadTopicEvents() {
    // 点击进入详情
    {
        $('.topic-title').off('click');
        $('.topic-title').click(async e => {
            let id = e.target.attributes['topicid'].value;
            let url = `
            topic-detail.html?
            topicid=${id}
            &sign=${md5(localStorage['course-web-curr-teacher-username'] + localStorage['course-web-curr-teacher-password'])}
            `.replace(/\s/g, '');
            // 跳转
            window.open(url, '_blank');
        });
    }


    // 点击删除话题
    {
        $('.delete-topic').off('click');
        $('.delete-topic').click(async e => {
            let id = e.target.attributes['topicid'].value;

            let yes = confirm('确定删除话题？');
            if (yes) {
                let url = API.TOPIC_APT.DELETE;
                let param = {
                    user: localStorage['course-web-curr-teacher-username'],
                    pwd: localStorage['course-web-curr-teacher-password'],
                    topicid: id
                };

                let [err, data] = await awaitWrap(post(url, param));
                if (err) {
                    toastr.error(err);
                } else {
                    toastr.success(data.message);
                    await loadTopics();
                }
            }
        });
    }
}