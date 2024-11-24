package com.groupd.bms.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommonRepository {

    /**
     * 공통 조회
     * @return
     */
    List<Map<String, Object>> codeMgtView(Map<String, Object> params);

    /**
     * 게시판 종류 가져오기
     * @return
     */
    List<Map<String, Object>> mngList(Map<String, Object> params);

    /**
     * 게시판 종류 가져오기(파라미터2개 추가버전)
     * @return
     */
    List<Map<String, Object>> mngList_v2(Map<String, Object> params);
    
}
