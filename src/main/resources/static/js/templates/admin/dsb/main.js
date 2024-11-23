/*
 * dsb/main.html 연동 스크립트 영역
 */
/*
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
    });
    calendar.render();

    // 텍스트를 변경하는 코드 추가
    var daysOfWeek = [
        { class: 'fc-day-sun', text: '일' },
        { class: 'fc-day-mon', text: '월' },
        { class: 'fc-day-tue', text: '화' },
        { class: 'fc-day-wed', text: '수' },
        { class: 'fc-day-thu', text: '목' },
        { class: 'fc-day-fri', text: '금' },
        { class: 'fc-day-sat', text: '토' },
    ];

    daysOfWeek.forEach(function (day) {
        var dayElements = document.querySelectorAll('.fc-scrollgrid-section-header .' + day.class);
        dayElements.forEach(function (element) {
            element.innerText = day.text; // 원하는 텍스트로 변경
        });
    });
});
*/
$(document).ready(function () {
    $('.main_board_state>span').click(function () {
        $('.main_board_state>span').removeClass('active');
        $(this).addClass('active');
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

    maintanceListLoad();

});

// 오늘 날짜 가져오기
/*
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1
var date = ('0' + today.getDate()).slice(-2);
var day = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];

var formattedDate = year + '. ' + month + '. ' + date + ' (' + day + ')';
// 텍스트를 #today 요소에 설정
document.getElementById('today').textContent = formattedDate;
*/

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
    
    var loginSiteKey = $("#loginSiteKey").val();    

    // 요청에 필요한 파라미터
    const params = {
        fr_date: '', // 시작 날짜 (예시)
        to_date: '', // 종료 날짜 (예시)
        searchType: '', // 검색 유형 (예시)
        search: '', // 검색어 (예시)
        userId: '', // 사용자 ID (예시)
        siteKey: loginSiteKey, // 동적으로 셋팅된 siteKey
        draw : 0,
        start : 0,
        length : 10
    };
    
     // AJAX POST 요청
     $.ajax({
        url: '/admin/csf/maintenance_list', // API URL
        method: 'POST', // POST 방식
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        data: JSON.stringify(params), // 파라미터를 JSON 문자열로 변환
        success: function (response) {
            // 응답 성공 시 실행
            if (response && Array.isArray(response.data)) {
                const $list = $('.main_board_wrap'); // ul 요소 선택
                
                // 기존 내용 초기화 (필요 시)
                $list.empty();
                
                // 응답 데이터 반복 처리
                response.data.forEach(function (item, index) {
                    const listClassNumber = (index + 1).toString().padStart(2, '0');
                    const taskStateClass = taskStateClassMap[item.strTaskState] || "state_other"; // 기본값: 기타
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
                                <span class="main_board_wrstate ${taskStateClass}">${item.strTaskState || '기타'}
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
                            <a href="naver.com" class="main_board_subject">${item.title || ''}</a>
                            <span class="main_board_comment">${item.commentCnt || '0'}</span>
                            ${fileImageHTML} <!-- 첨부파일 이미지 부분 -->
                        </div>
                        <span class="main_board_wkname">${item.name || ''}</span>
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