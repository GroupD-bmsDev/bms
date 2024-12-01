/*
 * csf/maintenance.html 연동 스크립트 영역
 */
let table;

// 유지보수게시판-업무요청상태 class
const taskStateClassMap = {
    "접수": "state_receive",
    "확인": "state_check",
    "진행": "state_progress",
    "완료": "state_complete",
    "기타": "state_other",
    "보류": "state_hold"
};

// 유지보수게시판-그룹디 담당부서별 class
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


$(document).ready(function () {
    
    initDataTable(); // DataTable 초기화    
    
    $('.main_board_state>span').click(function () {        
        $('.main_board_state>span').removeClass('active');
        $(this).addClass('active');
        
        // 업무요청 클릭시 data-state 값으로 설정
        var selectedState = $(this).data('state');
        $('#taskStateType').val("selTaskState"); 
        $('#taskStateWord').val(selectedState);                 
        table.draw(); // 테이블 다시 그리기
    });

    $('.main_board_category>span').click(function () {
        $('.main_board_category>span').removeClass('active');
        $(this).addClass('active');
        
        // 부서 클릭한 span의 data-state 값으로 설정
        var selectedState = $(this).data('state');
        $('#gdDepartCodeType').val("selGdDepartCode");
        $('#gdDepartCodeWord').val(selectedState); 
        table.draw(); // 테이블 다시 그리기
    });
    $('.main_board_wrstate').click(function () {
        $(this).children('.state_select').slideToggle(100);
    });
    $('.main_board_wrcategory').click(function () {
        $(this).children('.category_select').slideToggle(100);
    });

    //검색 버튼 클릭 이벤트
    $('#searchButton').on('click', function() {
        table.draw();
    });

    //하단 페이지 버튼 클릭 이벤트
    $('#customPagination').on('click', 'a', function (e) {
        e.preventDefault();
        if (!$(this).hasClass('disabled') && !$(this).hasClass('pg_current')) {
            var page = $(this).data('page');
            table.page(page).draw(false);
            updateCustomPagination(table.settings());
        }
    });
    
    // 엔터 클릭 시, 검색 버튼 클릭 이벤트
    $(document).on('keypress', function(event) {
        if (event.which === 13) { 
          $('#searchButton').click();
          event.preventDefault(); 
        }
    });
    
    // 유지보수 요청 버튼 클릭 이벤트
    $('body').on('click', 'tr', function() {
        var seq = $(this).attr('seq');
        showDetail(seq);
    });
});

 // 유지보수게시판 목록 테이블 초기화
function initDataTable() {
    table = $('#maintenanceTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/admin/csf/maintenance_list",
            "type": "POST",
            "data": function(d) {
                d.fr_date       = $('#fr_date').val();
                d.to_date       = $('#to_date').val();
                d.searchType    = $('#taskStateType').val();
                d.search        = $('#taskStateWord').val();
                d.searchType2   = $('#gdDepartCodeType').val();
                d.search2       = $('#gdDepartCodeWord').val();
                d.searchType3   = $('#searchType').val();
                d.search3       = $('#sch_word').val();
            }
        },
        "columns": [
            { "data": null, "className": "mt_wr_wdate", "render": data => formatDate(data.regdate) }, // 업무 요청일
            { "data": null, "className": "mt_wr_wdate", "render": data => formatDate(data.dueDate) }, // 완료 예정일
            { "data": "siteName" }, // 작성자
            { "data": "name" }, // 작성자
            { "data": null, "className": "mt_wr_state", 
                "render": data => {
                    const taskStateClass = taskStateClassMap[data.strTaskState] || "state_receive";
                    return `<span class="main_board_wrstate ${taskStateClass}" style="cursor: default">${data.strTaskState || '접수'}</span>`;
                } 
            }, // 상태
            { "data": null, "className": "mt_wr_state",
                "render": data => {
                    const gdDepartCodeClass = gdDepartCodeClassMap[data.strGdDepartCode] || "cat_no";
                    return `<span class="main_board_wrcategory ${gdDepartCodeClass}" style="cursor: default">${data.strGdDepartCode || '미처리'}</span>`;
                } 
            }, // 부서
            { "data": "title" }, // 제목
            { "data": "strGdUserKey" } // 담당자
        ],
        "language": {
            "paginate": { "first": "처음", "last": "맨끝", "next": "다음", "previous": "이전" },
            "zeroRecords": "데이터가 없습니다."
        },
        "dom": 'rtip',
        "createdRow": function(row, data) {
            $(row).attr('seq', data.seq);
        },
        "initComplete": function(settings) {
            updateCustomPagination(settings);
        }
    });

    // 테이블 이벤트 설정
    table.on('draw', function () {
        updateCustomPagination(table.settings());
    });
}

function showDetail(seq) {
    event.preventDefault();     

    var form = $('<form>', {
        method: 'POST',
        action: '/admin/csf/maintenance_view'
    });
    form.append($('<input>', {
        type: 'hidden',
        name: 'seq',
        value: seq
    }));

    $('body').append(form);
    form.submit();
}
/**
 * ajax  완료 후, 넘버링 데이타를 표시한다.
 * @param {} settings 
 */
function updateCustomPagination(settings) {
    var api = new $.fn.dataTable.Api(settings);
    var pageInfo = api.page.info();
    var paginationHtml = '';

    paginationHtml += '<a href="#" data-page="0" class="pg_page pg_start' + (pageInfo.page === 0 ? ' disabled' : '') + '">처음</a>';
    paginationHtml += '<a href="#" data-page="' + (pageInfo.page - 1) + '" class="pg_page pg_prev' + (pageInfo.page === 0 ? ' disabled' : '') + '">이전</a>';
    for (var i = 0; i < pageInfo.recordsTotal; i++) {
        paginationHtml += '<a href="#" data-page="' + i + '" class="pg_page' + (pageInfo.page === i ? ' pg_current' : '') + '">' + (i + 1) + '</a>';
    }
    paginationHtml += '<a href="#" data-page="' + (pageInfo.page + 1) + '" class="pg_page pg_next' + (pageInfo.page === pageInfo.recordsTotal - 1 ? ' disabled' : '') + '">다음</a>';
    paginationHtml += '<a href="#" data-page="' + (pageInfo.pages - 1) + '" class="pg_page pg_end' + (pageInfo.page === pageInfo.recordsTotal - 1 ? ' disabled' : '') + '">맨끝</a>';

    $('#customPagination').html(paginationHtml);
}