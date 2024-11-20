package com.groupd.bms.controller.enterprise.csf;

import com.groupd.bms.service.CommonService;
import com.groupd.bms.service.EnterpriseService;
import com.groupd.bms.util.StringUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.groupd.bms.controller.BaseController;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * CustomerBoardController
 * 고객지원 게시판 컨트롤러
 */
@Controller
@RequestMapping("enterprise/csf")
public class CustomerBoardController extends BaseController{

    @Autowired
    private CommonService commonService;

    @Autowired
    private EnterpriseService enterpriseService;

    /*
     * 프로젝트 정보 화면 페이지 
     */
    @GetMapping("/{path}")
    public String handleSinglePath(@PathVariable("path") String path, Model model) {
        return "enterprise/csf/" + path;
    }

    /*
     * 업체 상세 안내 팝업 가져오기
     */
    @RequestMapping(value = "/customer_detail", method = { RequestMethod.POST, RequestMethod.GET })
    public ResponseEntity<?> customerDetail(HttpServletRequest request) {

        HashMap<String, Object> requestMap = setRequest(request);
        String userId     = StringUtil.objectToString(requestMap.get("userId"));                   //사용자ID
        String searchVal  = StringUtil.objectToString(requestMap.get("searchVal"));                //검색어

        // 데이터 가져오기
        HashMap<String, Object> siteInfoMap = (HashMap<String, Object>)commonService.mng("SITE_DETAIL", userId, "", "", "", "", "", searchVal, "");

        // 데이터가 있을 경우
        if(siteInfoMap != null && siteInfoMap.size() > 0) {

            // 업체 그룹디담당자 리스트
            List<Map<String, Object>> RegMemberList = commonService.mngList("siteMngUser_List", userId, "0", "0", "", "", "", StringUtil.objectToString(siteInfoMap.get("siteKey")), "");

            String contactInformation = "";

            for(int i = 0; i < RegMemberList.size(); i++) {

                contactInformation = contactInformation + StringUtil.objectToString(RegMemberList.get(i).get("name")) + StringUtil.objectToString(RegMemberList.get(i).get("jobTitle"));
                if(i == RegMemberList.size() - 1) break;
                contactInformation = contactInformation + ", ";
            }

            String adress      = StringUtil.objectToString(siteInfoMap.get("address")) + " " + StringUtil.objectToString(siteInfoMap.get("addressDesc"));                                          // 주소
            String transaction = "Y".equals(StringUtil.objectToString(siteInfoMap.get("blogYN"))) ? "블로그" : "";
            transaction += "Y".equals(StringUtil.objectToString(siteInfoMap.get("homepageYN"))) ? " / 홈페이지" : "";
            transaction += "Y".equals(StringUtil.objectToString(siteInfoMap.get("reviewYN"))) ? " / 블랜딩 영상" : "";
            transaction += "Y".equals(StringUtil.objectToString(siteInfoMap.get("instagramYN"))) ? " / 인스타그램" : "";
            transaction += "Y".equals(StringUtil.objectToString(siteInfoMap.get("youtubeYN"))) ? " / 유튜브" : "";
            transaction += "Y".equals(StringUtil.objectToString(siteInfoMap.get("momcafeYN"))) ? " / 맘카페" : "";
            transaction += !"".equals(StringUtil.objectToString(siteInfoMap.get("cntBlogPos"))) ? " / 블로그 건 수(" + StringUtil.objectToString(siteInfoMap.get("cntBlogPos")) + ")건" : ""; //거래내용

            siteInfoMap.put("transaction", transaction);                // 거래내용
            siteInfoMap.put("adress", adress);                          // 주소
            siteInfoMap.put("contactInformation", contactInformation);  // 연락처

            // SNS 정보 가져오기
            List<Map<String, Object>> snsList = commonService.mngList("siteSnsInfo_List", userId, "0", "0", "", "", "", searchVal, "");
            String snsListJson = setJsonToMap(snsList);
            siteInfoMap.put("snsList", snsListJson);                     // SNS 정보
            siteInfoMap.put("retVal", "0");                        // 성공
            return ResponseEntity.ok(siteInfoMap);
        }

        return ResponseEntity.status(500).build();
    }

    /*
     * 프로젝트 정보 화면 페이지
     */
    @RequestMapping(value = "/add_business_management", method = { RequestMethod.POST, RequestMethod.GET })
    public String add_business_management(HttpServletRequest request, Model model) {

        HashMap<String, Object> registrationMap = setRequest(request);
        String userId     = StringUtil.objectToString(registrationMap.get("userId"));                   //관리자 ID
        String siteKey  = StringUtil.objectToString(registrationMap.get("siteKey"));                  //업체키

        //TODO 유지보수 게시판 정보 get set return


        // GET 요청인지 확인
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            // GET 요청일 경우 처리할 로직 작성
            // 예: 다른 페이지로 리다이렉트, 에러 메시지 출력 등
            return "redirect:/enterprise/main";
        }


        // 업체 상세 데이터 가져오기
        HashMap<String, Object> siteInfoMap = (HashMap<String, Object>) commonService.mng("SITE_DETAIL", userId, "", "", "", "", "", siteKey, "");

        if (siteInfoMap != null && siteInfoMap.size() > 0) {

            siteInfoMap.put("siteDomainExpdt", StringUtil.dataformat(StringUtil.objectToString(siteInfoMap.get("siteDomainExpdt"))));
            siteInfoMap.put("siteHostingExpdt", StringUtil.dataformat(StringUtil.objectToString(siteInfoMap.get("siteHostingExpdt"))));
            siteInfoMap.put("contractSdate", StringUtil.dataformat(StringUtil.objectToString(siteInfoMap.get("contractSdate"))));
            siteInfoMap.put("contractEdate", StringUtil.dataformat(StringUtil.objectToString(siteInfoMap.get("contractEdate"))));

            // 업체 SNS계정 리스트 데이터 가져오기
            String snsListJson ="";
            List<Map<String, Object>> snsList = commonService.mngList("siteSnsInfo_List", userId, "0", "0", "", "", "", StringUtil.objectToString(siteInfoMap.get("siteKey")), "");
            snsListJson = setJsonToMap(snsList);

            // 업체 그룹디담당자 리스트 데이터 가져오기
            String regMemberJson ="";
            List<Map<String, Object>> RegMemberList = commonService.mngList("siteMngUser_List", userId, "0", "0", "", "", "", StringUtil.objectToString(siteInfoMap.get("siteKey")), "");
            regMemberJson = setJsonToMap(RegMemberList);

            model.addAttribute("siteInfo", siteInfoMap);                    //업체 상세 데이터 가져오기
            model.addAttribute("snsList", snsListJson);                     //업체 SNS계정 리스트 데이터 가져오기
            model.addAttribute("regMemberList", regMemberJson);             //업체 그룹디담당자 리스트 데이터 가져오기
            model.addAttribute("corrections", "Y");          //수정 여부
        }

        /**
         * 사원 목록 리스트를 가져온다.
         */
        String MemListJson ="";
        List<Map<String, Object>> memberList = commonService.mngList("USER_LIST_SIMPLE", userId, "0", "0", "", "", "", "", "");
        MemListJson = setJsonToMap(memberList);
        model.addAttribute("memberList", MemListJson);

        /**
         * 업체 상태 코드를 가져온다.
         */
        List<Map<String, Object>> reList = enterpriseService.codeMgtViewSiteState("LIST", "siteState","", "");
        model.addAttribute("siteStateList", reList);

        /**
         * 업체 상태 레벨 코드를 가져온다.
         */
        List<Map<String, Object>> siteStateLevelList = enterpriseService.codeMgtViewSiteState("LIST", "siteStateLevel","", "");
        model.addAttribute("siteStateLevelList", siteStateLevelList);

        /**
         * 업체 개원 상태 코드를 가져온다.
         */
        List<Map<String, Object>> siteOpenStateList = enterpriseService.codeMgtViewSiteState("LIST", "siteOpenState","", "");
        model.addAttribute("siteOpenStateList", siteOpenStateList);

        /**
         * 계약 상태 코드를 가져온다.
         */
        List<Map<String, Object>> contractreList = enterpriseService.codeMgtViewSiteState("LIST","contractState","", "");
        model.addAttribute("contractStateList", contractreList);

        /**
         * 계약 계약플랜(포스팅/디자인)을 가져온다.
         */
        List<Map<String, Object>> contractPlanPDesignList = enterpriseService.codeMgtViewSiteState("LIST","contractPlanPDesign","", "");
        model.addAttribute("contractPlans", contractPlanPDesignList);

        /**
         * 계약 계약플랜(포스팅/디자인)을 가져온다.
         */
        List<Map<String, Object>> contractPlanVideoList = enterpriseService.codeMgtViewSiteState("LIST","contractPlanVideo","", "");
        model.addAttribute("contractPlanVideo", contractPlanVideoList);

        /**
         * 계약 계약플랜(포스팅/디자인)을 가져온다.
         */
        List<Map<String, Object>> snsTypeList = enterpriseService.codeMgtViewSiteState("LIST","snsType","", "");
        model.addAttribute("snsTypeList", snsTypeList);

        return "enterprise/csf/add_business_management";
    }

    /**
     * 업체 등록
     * @param request
     * @return
     */
    @SuppressWarnings("unused")
    @RequestMapping(value = "/Registration.do", method = { RequestMethod.POST, RequestMethod.GET })
    public ResponseEntity<?> Registration(HttpServletRequest request,
                                          @RequestParam("imgBusinessRegNo") MultipartFile imgBusinessRegNo,
                                          @RequestParam("imgDoctorLicense") MultipartFile imgDoctorLicense,
                                          @RequestParam("imgDegreeCertificate") MultipartFile imgDegreeCertificate,
                                          @RequestParam("imgDesignAssets") MultipartFile imgDesignAssets,
                                          @RequestParam("imgOpenCertificate") MultipartFile imgOpenCertificate,
                                          @RequestParam("imgSpecialistLicense") MultipartFile imgSpecialistLicense,
                                          @RequestParam("imgEtcFiles") MultipartFile imgEtcFiles,
                                          @RequestParam("imgEtc") MultipartFile imgEtc ) {

        HashMap<String, Object> RegistrationMap = setRequest(request);

        // 날짜 YYYY-MM-DD -> YYYYMMDD
        RegistrationMap.put("stingExpdt", StringUtil.objectToString(RegistrationMap.get("stingExpdt")).replaceAll("-", ""));
        RegistrationMap.put("contractEdate", StringUtil.objectToString(RegistrationMap.get("contractEdate")).replaceAll("-", ""));
        RegistrationMap.put("siteHostingExpdt", StringUtil.objectToString(RegistrationMap.get("siteHostingExpdt")).replaceAll("-", ""));
        RegistrationMap.put("contractSdate", StringUtil.objectToString(RegistrationMap.get("contractSdate")).replaceAll("-", ""));
        RegistrationMap.put("siteDomainExpdt", StringUtil.objectToString(RegistrationMap.get("siteDomainExpdt")).replaceAll("-", ""));

        //맴버 리스트를 가져온다.
        Map<String, String> parameterMap = new HashMap<>();
        int counter = 1;

        while (true) {

            String paramName = "bmMember" + counter;
            String paramValue = request.getParameter(paramName);

            if (paramValue == null || paramValue.isEmpty())
                break; // 더 이상 파라미터가 없으면 루프 종료

            parameterMap.put(paramName, paramValue);
            counter++;
        }

        RegistrationMap.put("bmsMember", parameterMap); // 맴버 리스트

        // 파일 세팅
        if(imgBusinessRegNo != null && !imgBusinessRegNo.isEmpty()) {
            RegistrationMap.put("imgBusinessRegNo", setFileName(imgBusinessRegNo, UUID.randomUUID().toString()));
        }

        if(imgDoctorLicense != null && !imgDoctorLicense.isEmpty()) {
            RegistrationMap.put("imgDoctorLicense", setFileName(imgDoctorLicense,UUID.randomUUID().toString()));
        }

        if(imgDegreeCertificate != null && !imgDegreeCertificate.isEmpty()) {
            RegistrationMap.put("imgDegreeCertificate", setFileName(imgDegreeCertificate,UUID.randomUUID().toString()));
        }

        if(imgDesignAssets != null && !imgDesignAssets.isEmpty()) {
            RegistrationMap.put("imgDesignAssets", setFileName(imgDesignAssets,UUID.randomUUID().toString()));
        }

        if(imgOpenCertificate != null && !imgOpenCertificate.isEmpty()) {
            RegistrationMap.put("imgOpenCertificate", setFileName(imgOpenCertificate,UUID.randomUUID().toString()));
        }

        if(imgSpecialistLicense != null && !imgSpecialistLicense.isEmpty()) {
            RegistrationMap.put("imgSpecialistLicense", setFileName(imgSpecialistLicense,UUID.randomUUID().toString()));
        }

        if(imgEtcFiles != null && !imgEtcFiles.isEmpty()) {
            RegistrationMap.put("imgEtcFiles", setFileName(imgEtcFiles,UUID.randomUUID().toString()));
        }

        if(imgEtc != null && !imgEtc.isEmpty()) {
            RegistrationMap.put("imgEtc", setFileName(imgEtc,UUID.randomUUID().toString()));
        }


        String corrections = StringUtil.objectToString(RegistrationMap.get("corrections"));

        if("Y".equals(corrections))
            RegistrationMap.put("gubun", "modify");
        else
            RegistrationMap.put("gubun", "regist");




        List<Map<String, Object>> snsTypeList = enterpriseService.codeMgtViewSiteState("LIST","snsType","", "");

        // SMS 데이터 가공
        RegistrationMap.put("sns", getSMSData(snsTypeList, RegistrationMap));
        enterpriseService.enterpriseInsert(RegistrationMap);

        String retVal = StringUtil.objectToString(RegistrationMap.get("retVal"));

        //업체 등록 성공 시 파일 업로드 진행
        if("0".equals(retVal)) {

            if(imgBusinessRegNo != null && !imgBusinessRegNo.isEmpty()) uploadFileToGCS(imgBusinessRegNo, StringUtil.objectToString(RegistrationMap.get("imgBusinessRegNo")));
            if(imgDoctorLicense != null && !imgDoctorLicense.isEmpty()) uploadFileToGCS(imgDoctorLicense, StringUtil.objectToString(RegistrationMap.get("imgDoctorLicense")));
            if(imgDegreeCertificate != null && !imgDegreeCertificate.isEmpty()) uploadFileToGCS(imgDegreeCertificate, StringUtil.objectToString(RegistrationMap.get("imgDegreeCertificate")));
            if(imgDesignAssets != null && !imgDesignAssets.isEmpty()) uploadFileToGCS(imgDesignAssets, StringUtil.objectToString(RegistrationMap.get("imgDesignAssets")));
            if(imgOpenCertificate != null && !imgOpenCertificate.isEmpty()) uploadFileToGCS(imgOpenCertificate, StringUtil.objectToString(RegistrationMap.get("imgOpenCertificate")));
            if(imgSpecialistLicense != null && !imgSpecialistLicense.isEmpty()) uploadFileToGCS(imgSpecialistLicense, StringUtil.objectToString(RegistrationMap.get("imgSpecialistLicense")));
            if(imgEtcFiles != null && !imgEtcFiles.isEmpty()) uploadFileToGCS(imgEtcFiles, StringUtil.objectToString(RegistrationMap.get("imgEtcFiles")));
            if(imgEtc != null && !imgEtc.isEmpty()) uploadFileToGCS(imgEtc, StringUtil.objectToString(RegistrationMap.get("imgEtc")));

        }

        if (RegistrationMap != null)
            return ResponseEntity.ok(RegistrationMap);
        else
            return ResponseEntity.status(500).build();

    }

    private JSONObject getSMSData(List<Map<String, Object>> a, HashMap<String, Object> b) {
        String snsTypeListStr = a.toString();
        String registrationMapStr = b.toString();

        snsTypeListStr = snsTypeListStr.replace("[", "").replace("]", "").replace(", ", ",");
        String[] snsTypeListArray = snsTypeListStr.split("},");
        Map<String, String> codeMap = new HashMap<>();
        for (String snsType : snsTypeListArray) {
            snsType = snsType.replace("{", "").replace("}", "");
            String[] keyValuePairs = snsType.split(",");
            Map<String, String> snsTypeMap = new HashMap<>();
            for (String pair : keyValuePairs) {
                String[] entry = pair.split("=");
                if (entry.length == 2) { // 배열 길이가 2인지 확인
                    snsTypeMap.put(entry[0].trim(), entry[1].trim()); // 공백 제거
                }
            }
            codeMap.put(snsTypeMap.get("code"), snsTypeMap.get("codeName"));
        }

        registrationMapStr = registrationMapStr.replace("{", "").replace("}", "");
        String[] registrationEntries = registrationMapStr.split(",");
        Map<String, String> registrationMap = new HashMap<>();
        for (String entry : registrationEntries) {
            String[] keyValue = entry.split("=");
            if (keyValue.length == 2) { // 배열 길이가 2인지 확인
                registrationMap.put(keyValue[0].trim(), keyValue[1].trim()); // 공백 제거
            }
        }

        JSONObject resultJson = new JSONObject();
        for (String code : codeMap.keySet()) {
            JSONObject codeJson = new JSONObject();
            for (String key : registrationMap.keySet()) {
                if (key.startsWith(code)) {
                    codeJson.put(key, StringUtil.objectToString(registrationMap.get(key)));
                }
            }
            resultJson.put(code, codeJson);
        }

        return resultJson;
    }

    /*
     * 업체 리스트 가져오기 
     */
    @RequestMapping(value = "/maintenance_list", method = { RequestMethod.POST, RequestMethod.GET })
    public ResponseEntity<?> maintenanceList( HttpServletRequest request) {

        HashMap<String, Object> registrationMap = setRequest(request);
        HashMap<String, Object> resMap = new HashMap<String, Object>();

        String startDate  = StringUtil.objectToString(registrationMap.get("fr_date"));                   //시작일
        String EndDate    = StringUtil.objectToString(registrationMap.get("to_date"));                   //종료일
        String searchType = StringUtil.objectToString(registrationMap.get("searchType"));                //검색타입     
        String search     = StringUtil.objectToString(registrationMap.get("search"));                    //검색어 
        String userId     = StringUtil.objectToString(registrationMap.get("userId"));                    //사용자ID
        String etcParam   = StringUtil.objectToString(registrationMap.get("siteKey"));                   //업체키


        int draw = Integer.parseInt(request.getParameter("draw"));                                      //페이징
        int start = Integer.parseInt(request.getParameter("start"));                                    //시작
        int length = Integer.parseInt(request.getParameter("length"));                                  //갯수

        // 페이지 번호 계산
        int page = start / length + 1;
        // 전체 레코드 수 가져오기
        int totalRecords = Integer.parseInt(setPagination(commonService.mng("taskReqBoard_Out_ListCnt", userId, String.valueOf(page), String.valueOf(length), startDate.replaceAll("-", ""), EndDate.replaceAll("-", ""), searchType, search, etcParam)));
        // 데이터 가져오기
        List<Map<String, Object>> maintenanceList = commonService.mngList("taskReqBoard_Out_List", userId, String.valueOf(page), String.valueOf(length), startDate.replaceAll("-", ""), EndDate.replaceAll("-", ""), searchType, search, etcParam);

        resMap.put("draw", draw);
        resMap.put("recordsTotal", totalRecords);
        resMap.put("data", maintenanceList);

        return ResponseEntity.ok(resMap);
    }

    /*
     * 유지보수 게시판 글쓰기 페이지
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value = "/maintenance_write", method = { RequestMethod.POST, RequestMethod.GET })
    public String maintenance_write(HttpServletRequest request, Model model) {

        HashMap<String, Object> registrationMap = setRequest(request);

        

        /**
         * 게시판 구분 값을 가져온다.
         */
        List<Map<String, Object>> taskTypeList = commonService.codeMgtViewList("LIST", "taskType", "","");
        model.addAttribute("taskTypeList", taskTypeList);


        return "enterprise/csf/maintenance_write";
    }

    /**
     * 고객 지원 게시판 글쓰기
     * @param request
     * @return
     */
    @RequestMapping(value = "/maintenance/Registration.do", method = { RequestMethod.POST, RequestMethod.GET })
    public ResponseEntity<?> maintenanceRegistration(HttpServletRequest request) {
        
        HashMap<String, Object> RegistrationMap = setRequest(request);


        //유지보수 게시판 등록
        enterpriseService.setMaintenancewrite(RegistrationMap);


         if (RegistrationMap != null)
            return ResponseEntity.ok(RegistrationMap);
        else
            return ResponseEntity.status(500).build();

    }

}