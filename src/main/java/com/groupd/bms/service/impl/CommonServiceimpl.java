package com.groupd.bms.service.impl;

import com.groupd.bms.repository.CommonRepository;
import com.groupd.bms.service.CommonService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 공통 서비스 클래스
 * @version 1.0
 * @since 2024.09.14
 */
@Service
public class CommonServiceimpl implements CommonService {

    @Autowired
    private CommonRepository commonRepository;

    /*
     * 공통 코드 정보를 조회한다.
     */
    @Override
    public Map<String, Object> codeMgtView(String gubun, String codeGubun, String code, String codeName) {

        List<Map<String, Object>> codeMgtList = codeMgtViewList(gubun, codeGubun, code, codeName);
        if(codeMgtList.size() > 0) return codeMgtList.get(0);
        else return new HashMap<String, Object>();
    }

    /**
     * 업체 코드관리를 한다.
     */
    public List<Map<String, Object>> codeMgtViewList(String gubun, String codeGubun, String code, String codeName) {

        HashMap<String, Object> getStateCode = new HashMap<>();

        getStateCode.put("gubun", gubun);
        getStateCode.put("codeGubun", codeGubun);
        getStateCode.put("code", code);
        getStateCode.put("codeName", codeName);

        List<Map<String, Object>> reList = commonRepository.codeMgtView(getStateCode);
        return reList;
    }

    /*
     * 공통 코드 정보를 조회한다.
     */
    @Override
    public Map<String, Object> mng(String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam) {

        List<Map<String, Object>> mng = mngList(gubun, userID, pageno, pagesize, Sdate, Edate, searchGubun, searchVal, etcParam);
        if(mng.size() > 0) return mng.get(0);
        else return new HashMap<String, Object>();
    }

    /*
     * 공통 게시판 리스트 정보를 조회한다.
     */
    @Override
    public List<Map<String, Object>> mngList(String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam) {

        HashMap<String, Object> boardMap = new HashMap<>();
        boardMap.put("gubun", gubun);
        boardMap.put("userid", userID);
        boardMap.put("PageNo", pageno);
        boardMap.put("Sdate", Sdate);
        boardMap.put("Edate", Edate);
        boardMap.put("PageSize", pagesize);
        boardMap.put("searchGubun", searchGubun);
        boardMap.put("searchVal", searchVal);
        boardMap.put("etcParam", etcParam);
        return commonRepository.mngList(boardMap);
    }
    

    /*
     * 공통 코드 정보를 조회한다.(파라미터2개 추가버전)
     */
    @Override
    public Map<String, Object> mng_v2(String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam,String searchGubun2, String searchVal2) {

        List<Map<String, Object>> mng2 = mngList_v2(gubun, userID, pageno, pagesize, Sdate, Edate, searchGubun, searchVal, etcParam, searchGubun2, searchVal2);
        if(mng2.size() > 0) return mng2.get(0);
        else return new HashMap<String, Object>();
    }

    /*
     * 공통 게시판 리스트 정보를 조회한다.(파라미터2개 추가버전)
     */
    @Override
    public List<Map<String, Object>> mngList_v2(String gubun,String userID, String pageno, String pagesize,String Sdate,String Edate,String searchGubun, String searchVal, String etcParam,String searchGubun2, String searchVal2) {

        HashMap<String, Object> boardMap = new HashMap<>();
        boardMap.put("gubun", gubun);
        boardMap.put("userid", userID);
        boardMap.put("PageNo", pageno);
        boardMap.put("Sdate", Sdate);
        boardMap.put("Edate", Edate);
        boardMap.put("PageSize", pagesize);
        boardMap.put("searchGubun", searchGubun);
        boardMap.put("searchVal", searchVal);
        boardMap.put("searchGubun2", searchGubun2);
        boardMap.put("searchVal2", searchVal2);
        boardMap.put("etcParam", etcParam);
        return commonRepository.mngList_v2(boardMap);
    }
    
}
