$(document).ready(function () {
    $('.side_menu > li > a').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('open');
        $('.side_menu > li > a').not(this).removeClass('open');
        var subMenu = $(this).siblings('.side_sub_menu');
        $('.side_sub_menu').not(subMenu).slideUp();
        subMenu.slideToggle();
    });

    // a 태그 클릭 이벤트를 바인딩합니다.
    $('a[data-ajax]').click(function (event) {
        event.preventDefault();
        var url = $(this).attr('href');
        loadContent(url);
    });

    // 내 정보 버튼 클릭 시 호출
    $('.user_info_btn').click(function () {
        showProfile($('#userid').val());
    });

    //프로필 상세 정보 삭제 시
    $('.member_info_close').click(function () {
        $('.member_info_wrap').addClass('out');
        $('body, html').removeClass('modal-active');
    });

    $('#member_logout').click(function () {
        if( confirm("로그아웃 하시겠습니까?") ) {
            // ajaxRequest 함수를 사용하여 로그아웃 처리
            ajaxRequest(
                '/admin/acm/logout.do',
                '',
                'POST',
                function (response) {
                    // 로그인 성공 시 대시보드 페이지로 리디렉트
                    location.href = '/admin/acm/login';
                },
                function () {
                    location.href = '/admin/acm/login';
                }
            );
        }
    });

    $('#infoUrl').on('click', function (event) {
        event.preventDefault();

        var userID = $(this).attr('data-userKey');

        var form = $('<form>', {
            method: 'POST',
            action: '/admin/ems/add_employees',
        });

        form.append(
            $('<input>', {
                type: 'hidden',
                name: 'userid',
                value: userID,
            })
        );

        $('body').append(form);
        form.submit();
    });

    // 현재 URL 가져오기
    var currentUrl = window.location.pathname;

    // 모든 메뉴 항목에서 "active" 클래스 제거
    $('.side_menu a').removeClass('active');

    // URL에서 첫 번째 경로 부분 추출 (path1)
    var path1 = currentUrl.split('/')[2];

    // 해당 id를 가진 메뉴 항목 찾기
    var targetMenuItem = $('#side_' + path1);

    // 찾은 메뉴 항목 클릭 이벤트 트리거
    targetMenuItem.trigger('click');
});

function showProfile(userID) {
    var data = {
        userid: userID,
    };

    ajaxRequest(
        '/admin/ems/employee_detail',
        data,
        'POST',
        function (response) {
            if (response.retVal == 0) {
                $('#userNameView').text(response.userName);
                $('#depart_total_infoView').text(response.depart_total_info);
                $('#jobStartDateView').text(response.jobStartDate);
                $('#jobDateView').text(response.jobDate);
                $('#hireTypeView').text(response.hireType);
                $('#birthdayView').text(response.birthday);
                $('#emailView').text(response.email);
                $('#emailDepartView').text(response.emailDepart);
                $('#hpnoView').text(response.hpno);
                $('#hpnoDepartView').text(response.hpnoDepart);
                $('#addrView').text(response.addr);
                $('#AccountView').text(response.Account);
                $('#marriedTypeView').text(response.marriedType);
                $('#juminNoView').text(response.juminNo);
                $('#boardUseYNView').text(response.boardUseYN);
                $('#memoView').text(response.memo);
                $('#departName').text(response.departName);
                $('#departName').removeClass();
                $('#departName').addClass('member_info_team');
                $('#departName').addClass(setdepartName(response.departName));
                $('#infoUrl').attr('data-userKey', userID);

                if (response.imgProfile == null || response.imgProfile == '') $('#imgView').hide();
                else {
                    $('#imgView').show();
                    $('#imgView').attr('src', response.imgProfile);
                }

                if (response.imgBankbook == null || response.imgBankbook == '') $('#imgBankbookView').hide();
                else $('#imgBankbookView').attr('data-img', response.imgBankbook);

                if (response.imgFamilyRL == null || response.imgFamilyRL == '') $('#imgFamilyRLView').hide();
                else $('#imgFamilyRLView').attr('data-img', response.imgFamilyRL);

                if (response.imgEtc == null || response.imgEtc == '') $('#imgEtcView').hide();
                else $('#imgEtcView').attr('data-img', response.imgEtc);

                if (response.imgProfile == null || response.imgProfile == '') $('#imgProfileView').hide();
                else $('#imgProfileView').attr('data-img', response.imgProfile);

                $('.member_info_wrap').removeClass('on');
                $('.member_info_wrap').removeClass('out');
                $('.member_info_wrap').addClass('on');
                $('body, html').addClass('modal-active');
            } else {
                alert('다시 시도해 주세요.');
            }
        },
        function () {
            alert('현재 기능 개발 준비중 입니다.');
        }
    );
}

/**
 * 파일 다운로드 함수
 * @param {*} id
 */
function downloadFile(id) {
    // 클릭된 a 태그의 href 속성 값을 가져옴
    var fileUrl = $('#' + id).attr('data-img');

    // 임시 a 태그 생성
    var $tempLink = $('<a>');
    $tempLink.attr('href', fileUrl);

    // 파일 다운로드 설정
    $tempLink.attr('download', fileUrl.substring(fileUrl.lastIndexOf('/') + 1));

    // 페이지에 추가 후 클릭하여 다운로드 실행
    $('body').append($tempLink);
    $tempLink[0].click();

    // 임시로 만든 링크 제거
    $tempLink.remove();
}
