/*
 * csf/maintenance_write.html 연동 스크립트 영역
 */
$(document).ready(function () {


    // 등록 하기 버튼 클릭 시 호출
    $('#registration').click(function () {
        // 유효성 검사
        //if (validate()) {
            var form = $('#addEmpForm')[0];
            var formData = new FormData(form);
            $.ajax({
                type: 'post',
                url: '/enterprise/csf/maintenance/Registration.do',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.retVal == '0') {
                        
                        var corrections = $('#corrections').val(); // 이미지 초기화

                        if (corrections != '') alert('수정이 완료되었습니다.'); 
                        else alert('등록이 완료되었습니다.');
                        
                        location.href = '/enterprise/csf/maintenance';

                    } else {
                        alert('등록에 실패했습니다. 관리자에게 문의하세요.');
                    }
                },
            });
        //}
    });

});

// input file 커스텀

const fileTarget = $('.add_request_file input');

fileTarget.on('change', function () {
    var files = $(this)[0].files;
    var fileArr = [];
    for (var i = 0; i < files.length; i++) {
        fileArr.push(files[i].name);
    }

    var fileList = fileArr.join('<br>');
    $(this).siblings('.bm_file_text').html(fileList);
});
