
$(document).ready(function () {

  $('input[type="radio"]').on('click', function(e) {

    if (this.previousChecked) {
      $(this).prop('checked', false);
    }
    this.previousChecked = this.checked;
  });

  $('input[type="radio"]').each(function() {
      if (isNaN(this.previousChecked)) { 
        this.previousChecked = this.checked;
      }
  });

});

/**
 * api 통신 공통 함수
 * @param {API 주소}  url 
 * @param {데이터}    data 
 * @param {HTTP 메소드} method
 * @param {성공 콜백} successCallback 
 * @param {실패 콜백} errorCallback 
 */
function ajaxRequest(url, data, method, successCallback, errorCallback) {

  if(forbiddenWordsCheck(data)){
    alert('금지된 단어가 포함되어 있습니다.');
    return;
  }

  $.ajax({
    url: url,
    method: method || "GET", // 기본값으로 "GET" 설정
    data: $.param(data), // 데이터를 URL 인코딩된 문자열로 변환
    dataType: "json",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    success: successCallback,
    error: errorCallback
  });
}

/**
 * 특수문자 제거
 * return true : 금칙어 존재
 * return false : 금칙어 없음
 **/
function forbiddenWordsCheck(str) {
  // str이 문자열인지 확인하고, 아니라면 문자열로 변환
  if (typeof str !== 'string') {
    str = str.toString(); 
  }

  for (let word of forbiddenWords) {
    if (str.toLowerCase().includes(word.toLowerCase())) {
      return true;
    }
  }
  return false;
}

// 금칙어 목록
const forbiddenWords = [
  // 기존 금칙어
  "badword1", "badword2", "badword3",

  // SQL 인젝션
  "OR '1'='1'", "DROP TABLE", "--", ";", "UNION", "SELECT", "INSERT", "UPDATE", "DELETE",

  // 크로스 사이트 스크립팅(XSS)
  "<script>", "alert(", "document.cookie", "window.location", "<img", "onload", "onerror",

  // 시스템 명령어 실행
  "&&", "|", ">", "rm ", "shutdown ", "echo", "ls ", "cat ",

  // 디렉토리 탐색(Directory Traversal)
  "../", "..\\", "%2e%2e/", "%2e%2e\\"
];

// 얼럿 화면
function showAlert(message) {
  alert(message);
}

//로그아웃, 로그인 페이지로 이동
function logout() {
   alert("no action! need to modify that new redirect url")
}

/**
 * 이미지 업로드 관련 함수 모음
 * @param {*} event 
 */
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggedImg = document.getElementById(data);
  const targetImg = event.target;

  if (targetImg.tagName === 'IMG') {
    // Swap the image sources
    const tempSrc = draggedImg.src;
    draggedImg.src = targetImg.src;
    targetImg.src = tempSrc;
  }
}
/**
 * 이미지 업로드 관련 함수 모음 끝
 */

// 현재 날짜를 구하는 함수
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요
  const day = ('0' + today.getDate()).slice(-2); // 날짜가 한 자리 수일 때 0을 앞에 붙임
  return `${year}-${month}-${day}`;
}

// 두 날짜 사이의 차이를 계산하는 함수
function calculateDuration(startDate, endDate) {
  // Convert the input strings to Date objects if they are strings
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Calculate the difference in months
  let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  totalMonths += endDate.getMonth() - startDate.getMonth();

  // Calculate years and remaining months
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months };
}

// 쿠키 설정 함수
function setCookie(key, value, days) {
  var date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  var expires = "; expires=" + date.toUTCString();
  document.cookie = key + "=" + (value || "") + expires + "; path=/";
}

/**
 * 주민등록번호 형식으로 변환
 * @param {*} input 
 */
function formatRRN(input) {
  
  var value = "";
  try{
    value = input.val().replace(/\D/g, ''); // 숫자가 아닌 모든 문자 제거
  }catch(e){
    value = input.value.replace(/\D/g, ''); // 숫자가 아닌 모든 문자 제거
  }
  const formattedValue = value.replace(/(\d{6})(\d{1,7})?/, '$1-$2');

  input.value = formattedValue.slice(0, 14); // 최대 길이를 14로 제한
}

/**
 * 전화번호 형식으로 변환
 * @param {*} input 
 */
function formatNumber(input) {
    var value = "";
    try {
      value = input.val().replace(/\D/g, ''); // 숫자가 아닌 모든 문자 제거
    } catch(e) {
      value = input.value.replace(/\D/g, ''); // 숫자가 아닌 모든 문자 제거
    }

    let formattedValue;

    if (value.length === 11) {
      // 휴대폰 번호 형식 (예: 010-1234-5678)
      formattedValue = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (value.length === 10 && value.startsWith("02")) {
      // 서울 집 전화번호 형식 (예: 02-123-4567)
      formattedValue = value.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else if (value.length === 10) {
      // 그 외 집 전화번호 형식 (예: 031-123-4567)
      formattedValue = value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else if (value.length === 9 && value.startsWith("02")) {
      // 서울 집 전화번호 형식 (구형식, 예: 02-123-4567)
      formattedValue = value.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    } else {
      // 기타 번호는 그대로 반환
      formattedValue = value;
    }

    input.val(formattedValue.slice(0, 13)); // 최대 길이를 13로 제한 (전화번호 형식에 맞게)
}

/**
 * 전화번호 형식으로 변환 2
 * @param {*} input 
 */
function formatPhoneNumber(input) {

  try{
    
      // 전화번호 형식에 맞춰 하이픈 추가
      if (numbers.length === 11) { // 010-XXXX-XXXX 형식
        return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      } else if (numbers.length === 10) { // 02-XXX-XXXX, 031-XXX-XXXX 등 형식
        return numbers.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
      } else { // 그 외 형식은 변환하지 않고 반환
        return numbers;
      }
      
  }catch(e){
    return input;
  }
  
}

// 파일 다운로드 함수
function getProxy(fileName) {
  return "/proxy/" + fileName;
}

/**
 * 필수 파라미터 체크 함수
 * @returns {Boolean}
 */
function validate() {
  let form = document.getElementById('frmSubmit');
  let inputs = form.querySelectorAll('input[required], select[required]');
  let allFilled = true;

  for (let input of inputs) {
      if (!input.value.trim()) {
          allFilled = false;
          input.focus();
          alert(input.getAttribute('data-alert') + "를(을) 입력해주세요.");
          break; // 필수 필드가 비어있는 경우 루프 종료
      }
  }
  
  return allFilled;
}


/**
 * 관리자의 부서명
 * @param {*} row 
 * @returns 
 */
function setdepartName(departNameClass){

  if(departNameClass.indexOf('광고관리') != -1  ){
    return 'cat_ec';
  }

  if(departNameClass.indexOf('디자인') != -1  ){
    return 'cat_dg';
  }

  if(departNameClass.indexOf('퍼블리싱') != -1  ){
    return 'cat_pb';
  }

  if(departNameClass.indexOf('영상') != -1 ){
    return 'cat_bd';
  }

  if(departNameClass.indexOf('관리') != -1  ){
    return 'cat_cp';
  }

  if(departNameClass.indexOf('재무')  != -1 ){
    return 'cat_fn';
  }

  if( departNameClass.indexOf('마케팅') != -1 || departNameClass.indexOf('기획') != -1){
    return 'cat_mk';
  }

  return "cat_dg";

}
