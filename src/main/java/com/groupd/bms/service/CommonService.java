package com.groupd.bms.service;

import java.util.List;
import java.util.Map;

/**
 * 공통 데이터를 관리하기 위한 서비스
 * @version 1.0
 * @since 2024.09.14
 */
public interface CommonService {

    /**
     * 공통 코드 정보를 조회한다.
     * @param String gubun,String codeGubun, String code, String codeName
     * @return HashMap<String, Object>
     */
    public Map<String, Object> codeMgtView(String gubun, String codeGubun, String code, String codeName);

    /**
     * 공통 코드 정보를 조회한다.
     * @param String gubun,String codeGubun, String code, String codeName
     * @return List<Map<String, Object>>
     */
    public List<Map<String, Object>> codeMgtViewList(String gubun, String codeGubun, String code, String codeName);


    /**
     * 공통 게시판 정보를 조회한다.
     * @param String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam
     * @return HashMap<String, Object>
     */
    public Map<String, Object> mng(String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam);

    /**
     * 공통 게시판 리스트 정보를 조회한다.
     * @param String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam
     * @return HashMap<String, Object>
     */
    public List<Map<String, Object>> mngList(String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam);

    
    /**
     * 공통 게시판 정보를 조회한다.(파라미터2개 추가버전)
     * @param String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam
     * @return HashMap<String, Object>
     */
    public Map<String, Object> mng_v2(String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam, String searchGubun2, String searchVal2, String searchGubun3, String searchVal3);

    /**
     * 공통 게시판 리스트 정보를 조회한다.(파라미터2개 추가버전)
     * @param String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam
     * @return HashMap<String, Object>
     */
    public List<Map<String, Object>> mngList_v2(String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam, String searchGubun2, String searchVal2, String searchGubun3, String searchVal3);    

   
} 