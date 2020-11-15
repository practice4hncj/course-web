// 入口函数
$(function () {
    // 加载题目
    loadQuestions();

    // 加载事件
    loadEvents();
});


/**
 * 加载题目
 * @param type 类型 [1:选择，2:填空，3:判断]，不填则请求所有类型的题目
 * @param success 加载成功的回调
 */
function loadQuestions(type, success) {
    let url = QUESTION_API.FIND;
    let param = {
        chapterid: currCpid,
        type: type
    };
    let list;
    // 请求所有类型
    if (!type) {
        loadQuestions(1);
        loadQuestions(2);
        loadQuestions(3, () => {
            toastr.success('刷新成功')
        });
        return;
    }
    my_ajax(url, param, (e) => {
        let questionList = e.data;
        let html = '';
        if (e.code === 200) {
            switch (type) {
                // 填空
                case 2:
                    let num_tk = 1;
                    list = $('#tkList');
                    html = '';
                    questionList.forEach((item) => {
                        let question = formatQuestion(item['question'], item['panswer'], 2);
                        html += `
                        <div questionid="{0}" class="tk-item">
                            <p class="question-main">{1}</p>
                            <p class="question-answer">答案：{2}</p>
                        </div>                  
                        `.format(item['pid'], num_tk + '、' + question['question'], question['answer']);
                        num_tk++;
                    });
                    list.html(html);
                    break;
                // 判断
                case 3:
                    let num_pd = 1;
                    list = $('#pdList');
                    html = '';
                    questionList.forEach((item) => {
                        let question = formatQuestion(item['question'], item['panswer'], 3);
                        html += `
                        <div questionid="{0}" class="pd-item">
                            <p class="question-main">{1}</p>
                            <p class="question-answer">答案：{2}</p>
                        </div>
                        `.format(item['pid'], num_pd + '、' + question['question'], question['answer']);
                        num_pd++;
                    });
                    list.html(html);
                    break;
                // 选择
                case 1:
                default:
                    let num_xz = 1;
                    list = $('#xzList');
                    html = '';
                    questionList.forEach((item) => {
                        // 格式化题干
                        let question = formatQuestion(item['question'], item['panswer'], 1);
                        // 动态生成选项
                        let optHtml = '';
                        question['opts'].forEach((opt) => {
                            optHtml += '<p>{0}</p>'.format(opt);
                        });
                        // 添加题目
                        html += `
                        <div questionid="{0}" class="xz-item">
                            <p class="question-main">{1}</p>
                            <div class="question-opts">
                            {2}
                            </div>
                            <p class="question-answer">答案：{3}</p>
                        </div>
                        `.format(item['pid'], num_xz + '、' + question['question'], optHtml, question['answer']);
                        num_xz++;
                    });
                    list.html(html);
                    break;
            }
            if (success) {
                success();
            }
        } else {
            toastr.error(e.message);
        }
    });
}

// 加载事件
function loadEvents() {

    // 导入题目
    {
        // 下载导入模板
        $('#downloadTemplate').attr('href', STATIC.QUESTION_TEMPLATE);
        // 按钮的点击事件
        $('#importQuestion').off('click');
        $('#importQuestion').click(() => {
            return $('#importQuestionInput').click();
        });
        // input file的change事件
        $('#importQuestionInput').off('change');
        $('#importQuestionInput').change((e) => {
            let files = e.target.files;
            // 解析excel文件
            resolveXlsx(false, files, (list) => {
                try {
                    list.forEach((item, index) => {
                        console.log(item);
                        // 判断模板是否正确
                        if (!(item['answer'] && item['qtype'] && item['question'])) {
                            throw new Error('请使用正确的模板！');
                        }
                        // 请求添加题目API
                        let param = {
                            chapterid: currCpid,
                            ptype: item['qtype'],
                            question: item['question'],
                            panswer: item['answer']
                        };
                        // 最后一次成功回调后刷新页面
                        if (index === list.length - 1) {
                            addQuestion(param, loadQuestions);
                        } else {
                            addQuestion(param);
                        }
                    });
                } catch (e) {
                    toastr.error(e.message);
                }

            });
        });
    }
}

// 单独添加题目
function addQuestion(param, success) {
    let url = QUESTION_API.ADD;
    param['user'] = teacherId;
    param['pwd'] = teacherPassword;
    my_ajax(url, param, (e) => {
        if (e.code === 200) {
            if (success) {
                success();
            }
        } else {
            toastr.error(e.message);
        }
    });
}


/**
 * 格式化题目
 * @param questionStr   题干字符串
 * @param answerStr     答案字符串
 * @param type          题目类型
 */
function formatQuestion(questionStr, answerStr, type) {
    switch (type) {
        // 填空题
        case 2:
            let answer = answerStr.replace(/\$/g, '、');
            return {
                question: questionStr,
                answer: answer
            };
        // 判断题
        case 3:
            return {
                question: questionStr,
                answer: answerStr
            };
        // 选择题
        case 1:
        default:
            let questions = questionStr.split('$');
            let q = questions[0];
            let opts = [];
            for (let i = 1; i < questions.length; i++) {
                opts.push(questions[i])
            }
            return {
                question: q,
                opts: opts,
                answer: answerStr
            };
    }
}