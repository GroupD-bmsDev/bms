/*
 * pif/place_write.html 연동 스크립트 영역
 */
// 두 개의 input 요소를 선택합니다.
const dcname1 = document.getElementById('dcname1');
const dcname2 = document.getElementById('dcname2');
// 첫 번째 input의 값이 변경되었을 때 두 번째 input의 값을 동기화합니다.
dcname1.addEventListener('input', function () {
    dcname2.value = dcname1.value;
});
// 두 번째 input의 값이 변경되었을 때 첫 번째 input의 값을 동기화합니다.
dcname2.addEventListener('input', function () {
    dcname1.value = dcname2.value;
});
// 첨부파일 이미지 띄우기
function readURL(input, previewElement, uploadElement, mainImageElement) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            previewElement.src = e.target.result;
            if (mainImageElement) {
                mainImageElement.src = e.target.result;
            }
            uploadElement.style.display = 'none';
        };

        reader.readAsDataURL(input.files[0]);
    }
}

document.querySelectorAll('.profile_box').forEach((profileBox, index) => {
    const realUpload = profileBox.querySelector('.real_upload');
    const upload = profileBox.querySelector('.upload');
    const profilePreview = profileBox.querySelector('.profile_preview');
    const mainImage = document.querySelectorAll('.place_main_img img')[index] || null;

    realUpload.addEventListener('change', function () {
        readURL(this, profilePreview, upload, mainImage);
    });

    upload.addEventListener('click', () => realUpload.click());
});
//이름입력
$(function () {
    $('.name_box').keyup(function (event) {
        regexp = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
        v = $(this).val();
        if (regexp.test(v)) {
            alert('한글만 입력가능 합니다.');
            $(this).val(v.replace(regexp, ''));
        }
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
