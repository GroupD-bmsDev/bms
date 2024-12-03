/*
 * /enterprise/csf/maintenance_view.html 연동 스크립트 영역
 */
$(document).ready(function () {
    
    
    var seqValue = $('#maintenanceSeq').val();
    console.log("seqValue:"+seqValue);
   // 목록 버튼 클릭 이벤트
   $(".list_board_btn").click(function () {
    
        window.location.href = "/enterprise/csf/maintenance"
   });

   // 버튼 클릭 이벤트
   $(".modify_board_btn").click(function () {
    $("#gubun").val("modify"); // 'modify' 값을 설정
    var form = $('#empForm')[0];
    // 숨겨진 필드 추가
    //form.append('<input type="hidden" name="gubun" value="modify">');


    form.action = '/enterprise/csf/maintenance_modify'; // 서버 컨트롤러 URL
    form.method = 'post'; // 요청 방식을 POST로 설정
    form.submit(); // 폼 제출

    
    

   });

  // 삭제 버튼 클릭 이벤트
  $(".remove_board_btn").click(function () {
       
        var form = $('#empForm')[0];
        var formData = new FormData(form);

        console.log(formData);
        // seq 값이 있을 경우에만 요청
        if (seqValue) {
            // 삭제 요청을 보낼지 확인하는 다이얼로그 (선택사항)
            var confirmDelete = confirm("정말로 삭제하시겠습니까?");
            if (confirmDelete) {
                // AJAX 요청으로 글 삭제
                $.ajax({
                    url: '/enterprise/csf/removeMaintenance',  // 글 삭제 요청 URL
                    method: 'POST',             // HTTP 메소드 (POST)
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        console.log(data);
                        // 삭제 성공 시 처리 (예: 알림 메시지, 페이지 리다이렉션 등)
                        if (data.retVal==0) {
                            alert("글이 삭제되었습니다.");
                            window.location.href = "/enterprise/csf/maintenance";  // 삭제 후 목록 페이지로 이동
                        } else {
                            alert("삭제에 실패했습니다. 다시 시도해주세요.");
                        }
                    },
                    error: function(xhr, status, error) {
                        // 에러 처리
                        console.error("삭제 요청 실패:", error);
                        alert("삭제 요청 중 오류가 발생했습니다.");
                    }
                });
            }
        } else {
            alert("삭제할 글을 선택해 주세요.");
        }
  });

});