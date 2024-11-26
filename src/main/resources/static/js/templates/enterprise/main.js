
$(document).ready(function () {

    $('#taskStateWord').val("");    //요청상태 선택 초기화
    $('#taskStateType').val("");    //요청상태 선택 초기화
    $('#gdDepartCodeWord').val("");    //부서선택 초기화
    $('#gdDepartCodeType').val("");    //부서선택 초기화

    $('.main_board_state>span').click(function () {
        $('.main_board_state>span').removeClass('active');
        $(this).addClass('active');
        
        // 업무요청 클릭시 data-state 값으로 설정
        var selectedState = $(this).data('state');
        $('#taskStateWord').val(selectedState); // hidden 필드에 taskStateWord 값 저장
        $('#taskStateType').val("selTaskState"); 

        // 리스트 재호출
        maintanceListLoad();
    });
    $('.main_board_category>span').click(function () {
        $('.main_board_category>span').removeClass('active');
        $(this).addClass('active');
    });
    $('.main_board_wrstate').click(function () {
        $(this).children('.state_select').slideToggle(100);
    });
    $('.main_board_wrcategory').click(function () {
        $(this).children('.category_select').slideToggle(100);
    });
    $('.main_side_alert').click(function () {
        $('.main_side_alert_box').slideToggle(300);
        $('.main_side_org_box').slideUp(300);
    });
    $('.main_side_org').click(function () {
        $('.main_side_org_box').slideToggle(300);
        $('.main_side_alert_box').slideUp(300);
        $('.side_org_btn').toggleClass('active');
    });
    $('.side_org_btn').click(function () {
        var caseBtn = $(this).attr('id');
        $('.org_modal').removeClass('on');
        $('.org_modal').removeClass('out');
        $('.org_modal#' + caseBtn).addClass('on');
        $('body, html').addClass('modal-active');
    });

    $('.org_modal_close').click(function () {
        $('.org_modal').addClass('out');
        $('body, html').removeClass('modal-active');
    });
    
    //오늘날짜 셋팅
    var todayDate = getTodayDateDays("yyyy.mm.dd day") ;
    if(todayDate!=""){
        document.getElementById('today_info').textContent = todayDate;
    }

    maintanceListLoad();   

});

// 요청상태 class
const taskStateClassMap = {
    "접수": "state_receive",
    "확인": "state_check",
    "진행": "state_progress",
    "완료": "state_complete",
    "기타": "state_other",
    "보류": "state_hold"
};

// 그룹디 담당부서별 class
const gdDepartCodeClassMap = {
    "미처리": "cat_no",
    "마케팅 / 기획": "cat_mk",
    "광고관리": "cat_ec",
    "디자인": "cat_dg",
    "퍼블리싱": "cat_pb",
    "영상": "cat_bd",
    "관리": "cat_cp",
    "재무": "cat_fn"
};

// 유지보수게시판 리스트 불러오기
function maintanceListLoad() {
    
    var loginSiteKey = $("#siteKey").val();    

     // AJAX POST 요청
     $.ajax({
        url: '/enterprise/csf/maintenance_list', // API URL
        method: 'POST', // POST 방식
        data: { // JSON 객체를 URL 인코딩 형태로 전송
            fr_date: '',        
            to_date: '',        
            searchType: $('#taskStateType').val(),
            search: $('#taskStateWord').val(),
            searchType2: $('#gdDepartCodeType').val(),
            search2: $('#gdDepartCodeWord').val(),
            userId: '', 
            siteKey: loginSiteKey, // 동적으로 셋팅된 siteKey
            draw : 0,
            start : 0,
            length : 10
        },
        success: function (response) {
            // 응답 성공 시 실행
            if (response && Array.isArray(response.data)) {
                const $list = $('.main_board_wrap'); // ul 요소 선택
                
                // 기존 내용 초기화 (필요 시)
                $list.empty();
                
                // 응답 데이터 반복 처리
                response.data.forEach(function (item, index) {
                    const listClassNumber = (index + 1).toString().padStart(2, '0');
                    const taskStateClass = taskStateClassMap[item.strTaskState] || "state_receive"; // 기본값: 접수
                    const gdDepartCodeClass = gdDepartCodeClassMap[item.strGdDepartCode] || "cat_no"; // 기본값: 미처리
                    let fileImageHTML = ''; // 기본값은 빈 문자열

                    // fileCnt 값이 1 이상인 경우에만 이미지 출력
                    if (item.fileCnt && item.fileCnt >= 1) {
                        fileImageHTML = `<img src="/img/main_board_file.svg" alt="파일첨부" class="main_board_file" />`;
                    }
                    
                    const listItem = `
                    <li class="main_board_list main_board_list${listClassNumber}">
                        <div class="main_board_con">
                            
                            <span class="main_board_wrtime">
                                ${item.isToday === 1 ? 
                                    `<span class="main_board_new">오늘</span>${item.strRegtime || ''}` : 
                                    (item.strRegdate || '')}
                            </span>

                            <span class="main_board_wrcp">${item.siteName || ''}</span>
                            <span class="main_board_wrname">${item.name || ''}</span>
                            <div class="main_board_box">
                                <span class="main_board_wrstate ${taskStateClass}">${item.strTaskState || '접수'}
                                    <ul class="state_select">
                                        <li><span class="state_receive">접수</span></li>
                                        <li><span class="state_check">확인</span></li>
                                        <li><span class="state_progress">진행</span></li>
                                        <li><span class="state_complete">완료</span></li>
                                        <li><span class="state_other">기타</span></li>
                                        <li><span class="state_hold">보류</span></li>
                                    </ul>
                                </span>
                            </div> 
                            <div class="main_board_box">
                                <span class="main_board_wrcategory ${gdDepartCodeClass}">${item.strGdDepartCode || '미처리'}
                                    <ul class="category_select">
                                        <li><span class="cat_no">미처리</span></li>
                                        <li><span class="cat_mk">마케팅 / 기획</span></li>
                                        <li><span class="cat_ec">광고관리</span></li>
                                        <li><span class="cat_dg">디자인</span></li>
                                        <li><span class="cat_pb">퍼블리싱</span></li>
                                        <li><span class="cat_bd">영상</span></li>
                                        <li><span class="cat_cp">관리</span></li>
                                        <li><span class="cat_fn">재무</span></li>
                                    </ul>
                                </span>
                            </div>                            
                            <a href="#" class="main_board_subject" onclick="showDetail(${item.seq}); return false;">${item.title || ''}</a>
                            <span class="main_board_comment">${item.commentCnt || '0'}</span>
                            ${fileImageHTML} <!-- 첨부파일 이미지 부분 -->
                        </div>
                    </li>`;
                    
                    // 생성된 <li> 항목을 ul에 추가
                    $list.append(listItem);
                });
            } else {
                console.error('No valid data received from the server.');
            }
        },
        error: function (xhr, status, error) {
            // 오류 처리
            console.error('Error fetching maintenance list:', error);
        }
    });
   

}

function showDetail(seq) {
    event.preventDefault(); 
    
    var seq = $(this).attr('seq');

    var form = $('<form>', {
        method: 'POST',
        action: '/enterprise/csf/maintenance_view'
    });

    form.append($('<input>', {
        type: 'hidden',
        name: 'searchVal',
        value: seq
    }));

    $('body').append(form);
    form.submit();
}


