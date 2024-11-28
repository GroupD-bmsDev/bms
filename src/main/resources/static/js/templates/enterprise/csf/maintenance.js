/*
 * /enterprise/csf/maintenance.html 연동 스크립트 영역
 */
$(document).ready(function () {
    dataTableReload();

    // 유지보수 요청 버튼 클릭 이벤트
    $('body').on('click', 'tr', function() {
        //var seq1 = $(this).data('seq');
        var seq = $(this).attr('seq');
        
       // alert("seq :" + seq);


        showDetail(seq);
    });

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
});


 // 직원 목록 테이블 생성
 function dataTableReload() {

    var table = $('#maintenanceTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/enterprise/csf/maintenance_list",
            "type": "POST",
            "data": function(d) {
                // 검색 조건을 데이터에 추가
                d.fr_date = $('#fr_date').val();
                d.to_date = $('#to_date').val();
                d.searchType = $('#searchType').val();
                d.search = $('#sch_word').val();
            }
        },
        "columns": [
            { "data": null, 
                "className": "mt_wr_wdate",
                "render": function(data, type, row) {
                return formatDate(row.regdate);
                } 
            }, // 업무 요청일
            { "data": "name" },//작성자
            { "data": null, 
                "className": "mt_wr_state",
                "render": function(data, type, row) {
                    if(row.strTaskState =="접수"){
                        return '<span class="main_board_wrstate state_receive" style="cursor: default">' + row.strTaskState + '</span>'; 
                    }else if(row.strTaskState =="확인"){
                        return '<span class="main_board_wrstate state_check" style="cursor: default">' + row.strTaskState + '</span>'; 

                    }else if(row.strTaskState =="진행"){
                        return '<span class="main_board_wrstate state_progress" style="cursor: default">' + row.strTaskState + '</span>'; 
                    }else if(row.strTaskState =="완료"){
                        return '<span class="main_board_wrstate state_complete" style="cursor: default">' + row.strTaskState + '</span>'; 
                    }else if(row.strTaskState =="기타"){
                        return '<span class="main_board_wrstate state_other" style="cursor: default">' + row.strTaskState + '</span>'; 
                    }else if(row.strTaskState =="보류"){
                        return '<span class="main_board_wrstate state_hold" style="cursor: default">' + row.strTaskState + '</span>'; 
                    }else{
                        return '<span class="main_board_wrstate state_receive" style="cursor: default">' + row.strTaskState + '</span>'; 
                    }
                } 
            },// 상태
            { "data": null, 
                "className": "mt_wr_state",
                "render": function(data, type, row) {
                    if(row.strGdDepartCode =="마케팅"){
                        return '<span class="main_board_wrcategory cat_mk" style="cursor: default">' +row.strGdDepartCode+'</span>';
                    }else if(row.strGdDepartCode =="광고관리"){
                        return '<span class="main_board_wrcategory cat_ec" style="cursor: default">' +row.strGdDepartCode+'</span>';
                    }else if(row.strGdDepartCode =="디자인"){
                        return '<span class="main_board_wrcategory cat_dg" style="cursor: default">' +row.strGdDepartCode+'</span>';
                    }else if(row.strGdDepartCode =="디자인"){
                        return '<span class="main_board_wrcategory cat_pb" style="cursor: default">' +row.strGdDepartCode+'</span>';
                    }else if(row.strGdDepartCode =="미디어제작"){
                        return '<span class="main_board_wrcategory cat_bd" style="cursor: default">' +row.strGdDepartCode+'</span>';
                    }else if(row.strGdDepartCode =="관리"){
                        return '<span class="main_board_wrcategory cat_cp" style="cursor: default">' +row.strGdDepartCode+'</span>';
                    }else if(row.strGdDepartCode =="재무"){
                        return '<span class="main_board_wrcategory cat_fn" style="cursor: default">' +row.strGdDepartCode+'</span>';
                    }else{
                        return '<span class="main_board_wrcategory cat_no" style="cursor: default">' +row.strGdDepartCode+'</span>';
                    }
                } 
            },// 부서
            { "data": "title" },        //제목
            { "data": null, 
                "className": "mt_wr_wdate",
                "render": function(data, type, row) {
                    if(!isNaN(row.dueDate)){
                        return formatDate(row.dueDate);
                    }else{
                        return "";
                    }
                } 
            }, // 필요 일자
            { "data": null, 
                "className": "mt_wr_wdate",
                "render": function(data, type, row) {
                    if(!isNaN(row.reqEDate)){
                        return formatDate(row.reqEDate);
                    }else{
                        return "";
                    }
                } 
            } // 필요 일자
        ],
        "language": {
            "paginate": {
                "first": "처음",
                "last": "맨끝",
                "next": "다음",
                "previous": "이전"
            },
            "info": "", // 정보 텍스트를 숨깁니다.
            "lengthMenu": "", // 길이 메뉴 텍스트를 숨깁니다.
            "zeroRecords": "데이터가 없습니다.", // 필요에 따라 조정
            "infoEmpty": "" // 빈 정보 텍스트를 숨깁니다.
        },
        "dom": 'rtip', // 기본 페이징 네비게이션 컨트롤을 숨깁니다.
        "createdRow": function(row, data, dataIndex) {
            console.log(data);
            //alert(data.seq);
            // 행에 userId 값을 data 속성으로 추가
            $(row).attr('seq', data.seq);
        },
        "initComplete": function(settings, json) {
            updateCustomPagination(settings);
        }
    });

    //화면 새로 그려질 때마다 해당 함수 호출 (페이지 이동, 검색 등)
    table.on('draw', function () {
        updateCustomPagination(table.settings());
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

}

function showDetail(seq) {
    event.preventDefault(); 
    
   //alert("seq111:" + seq1);

    var form = $('<form>', {
        method: 'POST',
        action: '/enterprise/csf/maintenance_view'
    });

    
    form.append($('<input>', {
        type: 'hidden',
        name: 'searchVal',
        value: seq
    }));
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