$(document).ready(function () {
    // 페이지 로드 시 저장된 아이디 로드
    var savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
        $('#userId').val(savedUserId);
        $('#rememberMe').prop('checked', true);
    }
    $('.btnView').on('click', function () {
        var oThis = $(this);
        var oPassField = $('#password');
        var sRemoveClass = 'on';
        var sAddClass = 'off';
        var sInputType = 'password';
        if (oThis.hasClass('off') === true) {
            sRemoveClass = 'off';
            sAddClass = 'on';
            sInputType = 'text';
        }
        oThis.removeClass(sRemoveClass);
        oThis.addClass(sAddClass);
        oPassField.attr('type', sInputType);
    });
    /**
     * 로그인 버튼
     */
    $('#loginBtn').click(function () {
        var username = $('#userId').val();
        var password = $('#password').val();

        // 유효성 검사
        if (username.trim() === '' || password.trim() === '') {
            alert('로그인 정보를 정확히 입력해주세요.');
            return;
        }

        if (forbiddenWordsCheck(username) || forbiddenWordsCheck(password)) {
            alert('금지된 단어가 포함되어 있습니다.');
            return;
        }

        // 아이디 저장 체크박스 검사
        if ($('#rememberMe').is(':checked')) {
            localStorage.setItem('userId', username); // 로컬 스토리지에 아이디 저장
        } else {
            localStorage.removeItem('userId'); // 저장된 아이디 삭제
        }

        // 자동 로그인 체크박스 검사
        if ($('#autoLogin').is(':checked')) {
            // 예제 사용법
            setCookie('autoLogin', 'true', 365);
            setCookie('userId', username, 365);
            setCookie('password', password, 365);
        } else {
            document.cookie = 'autoLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }

        // 로그인 데이터 준비
        var loginData = {
            userId: username,
            password: password,
        };

        // ajaxRequest 함수를 사용하여 로그인 처리
        ajaxRequest(
            '/admin/acm/loginProcess.do',
            loginData,
            'POST',
            function (response) {
                // 로그인 성공 시 대시보드 페이지로 리디렉트
                if (response.retVal == 0) {
                    setCookie('gubun', 'BMS', 365);
                    location.href = '/admin/dsb/main';
                } else {
                    alert(response.errMsg);
                }
            },
            function () {
                //error.status 분기에 따른 오류메세지 노출 필요
                alert('로그인 처리중 오류가 발생하였습니다. 재 시도 해주시기 바랍니다.');
            }
        );
    });
});
