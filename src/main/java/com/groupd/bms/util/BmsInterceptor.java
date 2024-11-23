package com.groupd.bms.util;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.bugsnag.Bugsnag;
import com.groupd.bms.model.Member;
import com.groupd.bms.model.MemberLogin;
import com.groupd.bms.service.CommonService;
import com.groupd.bms.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class BmsInterceptor implements HandlerInterceptor {


    private static final String[] LOGIN_CHECK_EXCLUDE_PATHS = {"/admin/acm/login","/","/error","/admin/acm/loginProcess.do","/enterprise/acm/login","/enterprise/acm/loginProcess.do"};

    @Autowired
    private UserService userService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private Bugsnag bugsnag;

    /*
     * preHandle은 컨트롤러가 실행되기 전에 실행되는 메소드
     * 로그인이 되어있는지 확인하고, 로그인이 되어있지 않다면 로그인 페이지로 리다이렉트
     * 로그인 페이지, 회원가입 페이지, 로그아웃 페이지는 세션 체크를 하지 않음
     * @param request
     * @param response
     * @param handler
     * @return boolean
     * @throws Exception
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.debug("===============================================");
        log.debug("==================== BEGIN ====================");
        log.debug("Request URI ===> " + request.getRequestURI());

        // 로컬호스트 여부 체크
        String host = request.getServerName();
        request.setAttribute("isLocalhost", "localhost".equals(host));

        //사이드바 메뉴 구분 값
        if(request.getRequestURI().contains("admin")){
            request.setAttribute("localUser", true);
        }else{
            request.setAttribute("localUser", false);
        }


        //디자이너 화면은 예외 처리 
        if(request.getRequestURI().contains("Designer")){
            return true;
        }

        // 세션 체크 로직
        if (!Arrays.asList(LOGIN_CHECK_EXCLUDE_PATHS).contains(request.getRequestURI())) {

            //비정상 접근 체크
            if(checkAbnormal(request,response)){
                log.debug("==================== 비정상접근 ====================");
                log.debug("========== BsmInterceptor.java확인필요 =============");
                log.debug("==================== 비정상접근 ====================");
                return false;
            }
            
            // 로그인이 되어있지 않은 상태
             if (request.getSession().getAttribute("member") == null) {

                 // 쿠키에 아이디 비밀번호가 있으면 로그인 시도
                if(request.getCookies() != null){

                    String autoLogin = "";              // 자동 로그인 여부
                    String userID    = "";              // 아이디
                    String password    = "";            // 비밀번호
                    String gubun       = "";


                    // 쿠키에서 아이디, 비밀번호, 자동 로그인 여부를 가져옴
                    for (int i = 0; i < request.getCookies().length; i++) {
                        
                        // 자동 로그인 쿠키가 있는지 확인
                        if(request.getCookies()[i].getName().equals("autoLogin")){
                            autoLogin = request.getCookies()[i].getValue();
                        }

                        // 아이디 쿠키가 있는지 확인
                        if(request.getCookies()[i].getName().equals("userId")){
                            userID = request.getCookies()[i].getValue();
                        }

                        // 비밀번호 쿠키가 있는지 확인
                        if(request.getCookies()[i].getName().equals("password")){
                            password = request.getCookies()[i].getValue();
                        }

                        // 구분 값이 쿠키에 있는지 확인 
                        if(request.getCookies()[i].getName().equals("gubun")){
                            gubun = request.getCookies()[i].getValue();
                        }
                        
                    }

                    // 자동 로그인 쿠키가 있으면 로그인 시도
                    if(autoLogin.equals("true") && !userID.equals("") && !password.equals("") && !gubun.equals("")){

                        String sysGubun = ("BMS".equals(gubun)) ? "BMS" : "DT";
                        // 로그인 시도
                        HashMap<String, Object> loginResultMap = userService.login(new MemberLogin(userID, SHA256Util.hashWithSHA256(password), Util.getUserIP(request), sysGubun));
                        // 로그인 성공 시 세션에 회원 정보를 저장
                        if (loginResultMap != null && loginResultMap.get("retVal").equals("0") && loginResultMap.get("member") != null){

                            Member member = (Member) loginResultMap.get("member");
                            request.getSession().setAttribute("member", member);
                            //사이트 구분 값에 따라 페이지 이동
                            setSysGubun(member,response);

                            setMember(request);
                            return false; 

                        }
                    }
                }

                // 로그인 페이지로 리다이렉트
                if (request.getSession().getAttribute("member") != null) {
                    Member member = (Member) request.getSession().getAttribute("member");
                    //사이트 구분 값에 따라 페이지 이동
                    setSysGubun(member,response);
                    return false; // 현재 요청을 중지하고 메인 페이지로 리다이렉트
                }

                 response.sendRedirect("/enterprise/acm/login");
                 return false; // 현재 요청을 중지하고 로그인 페이지로 리다이렉트
             }

             setMember(request);

        }else if("/error".equals(request.getRequestURI())){
            // 에러 페이지는 세션 체크를 하지 않음
            return true;
        }else{

            // 로그인이 되어있지 않은 상태
            if (request.getSession().getAttribute("member") != null) {
                setMember(request);
                Member member = (Member) request.getSession().getAttribute("member");
                //사이트 구분 값에 따라 페이지 이동
                setSysGubun(member,response);
                return false; // 현재 요청을 중지하고 메인 페이지로 리다이렉트
            }

         }

        //로그인 되어 있는 유저 수신함 리스트 가져 오기
        if (request.getSession().getAttribute("member") != null) {

            Member member = (Member) request.getSession().getAttribute("member");
            String userId = member.getUserid();

             // 데이터 가져오기
            List<Map<String, Object>> inBox_All_List = commonService.mngList("inBox_All_List", userId, "", "", "", "", "", "", "");
            List<Map<String, Object>> inBox_All_CNT = commonService.mngList("inBox_All_CNT", userId, "", "", "", "", "", "", "");
            List<Map<String, Object>> inBox_New_List = commonService.mngList("inBox_New_List", userId, "", "", "", "", "", "", "");
            List<Map<String, Object>> inBox_New_CNT = commonService.mngList("inBox_New_CNT", userId, "", "", "", "", "", "", "");

            //수신함 ALL 리스트 및 갯수 
           if(inBox_All_CNT != null && inBox_All_CNT.size() > 0 ){
                int cnt = com.groupd.bms.util.StringUtil.stringToInt(inBox_All_CNT.get(0).get("CNT").toString());
                request.setAttribute("inBox_All_CNT", cnt);
                request.setAttribute("inBox_All_List", inBox_All_List);

            }

            //수신함 미확인 리스트 및 갯수
            if(inBox_New_CNT != null && inBox_New_CNT.size() > 0 ){
                int cnt = com.groupd.bms.util.StringUtil.stringToInt(inBox_New_CNT.get(0).get("CNT").toString());
                request.setAttribute("inBox_New_CNT", cnt);
                request.setAttribute("inBox_New_List", inBox_New_List);
            }

        }


         

        return true; // 로그인, 등록, 로그아웃 페이지는 세션 체크를 하지 않음
    }


    /*
     * postHandle은 컨트롤러가 실행된 후에 실행되는 메소드
     * 현재 URI를 ModelAndView에 추가
     * @param request
     * @param response
     * @param handler
     * @param modelAndView
     * @throws Exception
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        String currentUri = request.getRequestURI();

        log.debug("Handling postHandle for URI: " + currentUri);

        if (modelAndView != null) {
            log.debug("ModelAndView is not null, adding currentUri");
            modelAndView.addObject("currentUri", currentUri);
        } else {
            log.debug("ModelAndView is null");
        }
    }

    /*
     * afterCompletion은 컨트롤러가 실행된 후에 실행되는 메소드
     * 예외가 발생하면 로그에 기록
     * @param request
     * @param response
     * @param handler
     * @param ex
     * @throws Exception
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        if (ex != null) {
            log.error("Request processing error", ex);
            bugsnag.notify(ex);
        }
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }


    /*
     * setMember는 세션에 저장된 회원 정보를 request에 저장
     * @param request
     * @return void
     */
    private void setMember(HttpServletRequest request) {
        Member member = (Member) request.getSession().getAttribute("member");
        request.setAttribute("member", member);
    }

    /**
     * 시스템 구분 값에 따라 페이지 이동
     * @param member
     */
    private void setSysGubun(Member member,HttpServletResponse response) throws Exception {
        
        String sysGubun = StringUtil.objectToString(member.getSiteKey());
        
        if("1000000".equals(sysGubun)){
            response.sendRedirect("/admin/dsb/main");
        }else{
            response.sendRedirect("/enterprise/dsb/main");
        }

    }

    /**
     * 비정상 접근 체크
     * 서버에 있는 세션값중 siteKey 값이 1000000 이면 그룹디 직원 아니면 외부 직원
     * @param request
     * @return
     */
    private boolean checkAbnormal(HttpServletRequest request, HttpServletResponse response) throws Exception {

        boolean checkAbnormal = false;

        Member member = (Member) request.getSession().getAttribute("member");

        if(member != null){
            
            //사이트 키가 1000000 이면 그룹디 직원 아니면 외부 직원 
            String siteKey = StringUtil.objectToString(member.getSiteKey());

            //사용자 요청 주소 
            String url = request.getRequestURI();

            //그룹디 직원이 업체 화면 접속 하려고 하였을 경우 또는 업체 직원이 그룹디 화면 접속 하려고 하였을 경우
            if((siteKey.equals("1000000") && url.contains("/enterprise")) || (!siteKey.equals("1000000") && url.contains("/admin"))){
                checkAbnormal = true;

                //로그아웃 처리
                request.getSession().removeAttribute("member");

                if(siteKey.equals("1000000")){
                    response.sendRedirect("/admin/acm/login");
                }else{
                    response.sendRedirect("/enterprise/acm/login");
                }

            }

        }

        return checkAbnormal;

    }
}