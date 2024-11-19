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

    // 정보 수정 클릭
    $("#Modifying_Information").on("click", function(event) {
        event.preventDefault();

        var siteKey = $("#siteKey").val();
        customerShowProfile(siteKey);


    });

    //업체  상세 정보 삭제 시 
    $('.bm_info_close').click(function () {
        $('.bm_info_wrap').addClass('out');
        $('body, html').removeClass('modal-active');
    });

    //프로필 상세 정보 삭제 시 
    $('.member_info_close').click(function () {
        $('.member_info_wrap').addClass('out');
        $('body, html').removeClass('modal-active');
    });

        //프로필 상세 정보 삭제 시 
    $('#member_info').click(function () {
        $('.member_info_wrap').removeClass('on');
        $('.member_info_wrap').removeClass('out');
        $('.member_info_wrap').addClass('on');
        $('body, html').addClass('modal-active');
    });

    
    

    // 이미지 클릭 시 이미지 상세 페이지로 이동
    $('#Registration').on('click', function(event) {
        event.preventDefault();

        var siteKey = $("#siteKey").val();

        var form = $('<form>', {
            method: 'POST',
            action: '/enterprise/csf/add_business_management'
        });

        form.append($('<input>', {
            type: 'hidden',
            name: 'siteKey',
            value: siteKey
        }));

        $('body').append(form);
        form.submit();
    });

    //프로필 상세 정보 삭제 시
    $('.bm_info_close').click(function () {
        $('.bm_info_wrap').addClass('out');
        $('body, html').removeClass('modal-active');
    });

    $('#member_logout').click(function () {
        if( confirm("로그아웃 하시겠습니까?") ) {
            // ajaxRequest 함수를 사용하여 로그아웃 처리
            ajaxRequest(
                '/enterprise/acm/logout.do',
                '',
                'POST',
                function (response) {
                    // 로그인 성공 시 대시보드 페이지로 리디렉트
                    location.href = '/enterprise/acm/login';
                },
                function () {
                    location.href = '/enterprise/acm/login';
                }
            );
        }
    });


});

/**
 * 회사 정보 상세 보기
 * @param {*} searchval
 */
function customerShowProfile(searchval) {

    var data = {
        searchVal : searchval
    };

    ajaxRequest("/enterprise/csf/customer_detail", data, "POST", function (response) {

        if (response.retVal == 0) {

            $('#siteName').text(response.siteName);
            $('#strSiteStateLevel').text(response.strSiteStateLevel);
            $('#contractSdate').text(formatDate(response.contractSdate));
            $('#contractEdate').text(formatDate(response.contractEdate));
            $('#strContractState').text(response.strContractState);
            $('#strSiteOpenState').text(response.strSiteOpenState);
            $('#transaction').text(response.transaction);
            $('#siteURL').text(response.siteURL);
            $('#siteDomainExpdt').text(formatDate(response.siteDomainExpdt));
            $('#siteHostingExpdt').text(formatDate(response.siteHostingExpdt));
            $('#adress').text(response.adress);
            $('#memo').text(response.memo);
            $('#ceoName').text(response.ceoName);
            $('#managerPhone').text(formatPhoneNumber(response.managerPhone));
            $('#managerEmail').text(response.managerEmail);
            $('#contactInformation').text(response.contactInformation);


            if(response.imgBusinessRegNo != null && response.imgBusinessRegNo != '') {
                $('#imgBusinessRegNoView').text("사업자등록증 다운로드");
                $('#imgBusinessRegNoView').attr('data-img', getProxy(response.imgBusinessRegNo));
            }

            if(response.imgOpenCertificate != null && response.imgOpenCertificate != '') {
                $('#imgOpenCertificateView').text("학위증 다운로드");
                $('#imgOpenCertificateView').attr('data-img', getProxy(response.imgOpenCertificate));
            }

            if(response.imgDoctorLicense != null && response.imgDoctorLicense != '') {
                $('#imgDoctorLicenseView').text("개설필증 다운로드");
                $('#imgDoctorLicenseView').attr('data-img', getProxy(response.imgDoctorLicense));
            }

            if(response.imgSpecialistLicense != null && response.imgSpecialistLicense != '') {
                $('#imgSpecialistLicenseView').text("이외 자료 다운로드");
                $('#imgSpecialistLicenseView').attr('data-img', getProxy(response.imgSpecialistLicense));
            }

            if(response.imgDegreeCertificate != null && response.imgDegreeCertificate != '') {
                $('#imgDegreeCertificateView').text("의사 면허증 다운로드");
                $('#imgDegreeCertificateView').attr('data-img', getProxy(response.imgDegreeCertificate));
            }

            if(response.imgDesignAssets != null && response.imgDesignAssets != '') {
                $('#imgDesignAssetsView').text("전문의 자격증 다운로드");
                $('#imgDesignAssetsView').attr('data-img', getProxy(response.imgDesignAssets));
            }

            if(response.imgEtcFiles != null && response.imgEtcFiles != '') {
                $('#imgEtcFilesView').text("디자인 활용 자료 다운로드");
                $('#imgEtcFilesView').attr('data-img', getProxy(response.imgEtcFiles));
            }

            if(response.imgEtcFiles != null && response.imgEtcFiles != '') {
                $('#imgEtcView').text("디자인 활용 자료 다운로드");
                $('#imgEtcView').attr('data-img', getProxy(response.imgEtc));
            }

            $('#Registration').attr('data-sitekey', response.siteKey);

            $(".bm_info_state_box").hide();
            $(".bm_info_memo").hide();

            setSnsInformation(response.snsList);

            $('.bm_info_wrap').removeClass('on');
            $('.bm_info_wrap').removeClass('out');
            $('.bm_info_wrap' ).addClass('on');
            $('body, html').addClass('modal-active');


        } else {
            alert("다시 시도해 주세요. 에러코드 : " + response.retVal);
        }
    }, function () {
        alert('관리자에게 문의해 주세요.');
    });

}

/**
 * SNS 정보를 조회하는 함수
 * @param {*} searchVal
 */
function setSnsInformation(snsList) {

    try{

        const snsListData = JSON.parse(snsList);

        if(snsListData != null && snsListData != '') {
            // 각 SNS 타입에 대한 input 필드에 값 할당
            snsListData.forEach(sns => {
                const snsType = sns.snsType;

                $('#' + snsType + 'siteDomain').text(sns.domain);
                $('#' + snsType + 'id').text(sns.id);
                $('#' + snsType + 'pw').text(sns.pwd);

            });
        }

    }catch(e) {
        console.log(e);
    }

}

function showProfile(userID) {

    var data = {
        userid: userID
    };

    ajaxRequest("/admin/ems/employee_detail", data, "POST", function (response) {

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

            if(response.imgProfile == null || response.imgProfile == '')
                $('#imgView').hide();
            else{
                $('#imgView').show();
                $('#imgView').attr('src', response.imgProfile);
            }

            if(response.imgBankbook == null || response.imgBankbook == '')
                $('#imgBankbookView').hide();
            else
                $('#imgBankbookView').attr('data-img', response.imgBankbook);

            if(response.imgFamilyRL == null || response.imgFamilyRL == '')
                $('#imgFamilyRLView').hide();
            else
                $('#imgFamilyRLView').attr('data-img', response.imgFamilyRL);

            if(response.imgEtc == null || response.imgEtc == '')
                $('#imgEtcView').hide();
            else
                $('#imgEtcView').attr('data-img', response.imgEtc);

            if(response.imgProfile == null || response.imgProfile == '') $('#imgProfileView').hide();
            else $('#imgProfileView').attr('data-img', response.imgProfile);

            $('.member_info_wrap').removeClass('on');
            $('.member_info_wrap').removeClass('out');
            $('.member_info_wrap').addClass('on');
            $('body, html').addClass('modal-active');


        } else {
            alert("다시 시도해 주세요.");
        }
    }, function () {
        alert('현재 기능 개발 준비중 입니다.');
    });

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