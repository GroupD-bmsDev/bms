package com.groupd.bms.model;

import java.io.Serializable;

public class Member implements Serializable {
    private static final long serialVersionUID = 1L;

    private String userid;
    private String pwd;
    private String name;
    private String nameEng;
    private String email;
    private String emailDepart;
    private String birthday;
    private String calendarType;
    private String gender;
    private String addr;
    private String addrDesc;
    private String post;
    private String departCode;
    private String teamCode;
    private String jobPosition;
    private String jobTitle;
    private String hireType;
    private String jobStatus;
    private String jobStartDate;
    private String jobEndDate;
    private String payGiveType;
    private String bankName;
    private String marriedType;
    private String boardUseYN;
    private String memo;
    private String imgBankbook;
    private String imgFamilyRL;
    private String imgProfile;
    private String imgEtc;
    private String grade;
    private String state;
    private String siteKey;
    private String modifyTime;
    private String systemtime;
    private String hpno;
    private String hpnoDepart;
    private String bankAccount;
    private String juminNo;
    private String code;
    private String codeName;
    private String codeSeq;
    private String siteName;

    // Default Constructor
    public Member() {
    }

    // Constructor with all fields
    public Member(String userid, String pwd, String name, String nameEng, String email, String emailDepart, String birthday, 
    String calendarType, String gender, String addr, String addrDesc, String post, String departCode, String teamCode, String jobPosition, 
    String jobTitle, String hireType, String jobStatus, String jobStartDate, String jobEndDate, String payGiveType, String bankName, 
    String marriedType, String boardUseYN, String memo, String imgBankbook, String imgFamilyRL, String imgProfile, String imgEtc, 
    String grade, String state, String siteKey, String modifyTime, String systemtime, String hpno, String hpnoDepart, String bankAccount, String juminNo, String code, String codeName, String codeSeq, String siteName) {
        this.userid = userid;
        this.pwd = pwd;
        this.name = name;
        this.nameEng = nameEng;
        this.email = email;
        this.emailDepart = emailDepart;
        this.birthday = birthday;
        this.calendarType = calendarType;
        this.gender = gender;
        this.addr = addr;
        this.addrDesc = addrDesc;
        this.post = post;
        this.departCode = departCode;
        this.teamCode = teamCode;
        this.jobPosition = jobPosition;
        this.jobTitle = jobTitle;
        this.hireType = hireType;
        this.jobStatus = jobStatus;
        this.jobStartDate = jobStartDate;
        this.jobEndDate = jobEndDate;
        this.payGiveType = payGiveType;
        this.bankName = bankName;
        this.marriedType = marriedType;
        this.boardUseYN = boardUseYN;
        this.memo = memo;
        this.imgBankbook = imgBankbook;
        this.imgFamilyRL = imgFamilyRL;
        this.imgProfile = imgProfile;
        this.imgEtc = imgEtc;
        this.grade = grade;
        this.state = state;
        this.siteKey = siteKey;
        this.modifyTime = modifyTime;
        this.systemtime = systemtime;
        this.hpno = hpno;
        this.hpnoDepart = hpnoDepart;
        this.bankAccount = bankAccount;
        this.juminNo = juminNo;
        this.code = code;
        this.codeName = codeName;
        this.codeSeq = codeSeq;
        this.siteName = siteName;
    }

    // Getters and Setters
    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameEng() {
        return nameEng;
    }

    public void setNameEng(String nameEng) {
        this.nameEng = nameEng;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmailDepart() {
        return emailDepart;
    }

    public void setEmailDepart(String emailDepart) {
        this.emailDepart = emailDepart;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getCalendarType() {
        return calendarType;
    }

    public void setCalendarType(String calendarType) {
        this.calendarType = calendarType;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddr() {
        return addr;
    }

    public void setAddr(String addr) {
        this.addr = addr;
    }

    public String getAddrDesc() {
        return addrDesc;
    }

    public void setAddrDesc(String addrDesc) {
        this.addrDesc = addrDesc;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public String getDepartCode() {
        return departCode;
    }

    public void setDepartCode(String departCode) {
        this.departCode = departCode;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public String getJobPosition() {
        return jobPosition;
    }

    public void setJobPosition(String jobPosition) {
        this.jobPosition = jobPosition;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getHireType() {
        return hireType;
    }

    public void setHireType(String hireType) {
        this.hireType = hireType;
    }

    public String getJobStatus() {
        return jobStatus;
    }

    public void setJobStatus(String jobStatus) {
        this.jobStatus = jobStatus;
    }

    public String getJobStartDate() {
        return jobStartDate;
    }

    public void setJobStartDate(String jobStartDate) {
        this.jobStartDate = jobStartDate;
    }

    public String getJobEndDate() {
        return jobEndDate;
    }

    public void setJobEndDate(String jobEndDate) {
        this.jobEndDate = jobEndDate;
    }

    public String getPayGiveType() {
        return payGiveType;
    }

    public void setPayGiveType(String payGiveType) {
        this.payGiveType = payGiveType;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getMarriedType() {
        return marriedType;
    }

    public void setMarriedType(String marriedType) {
        this.marriedType = marriedType;
    }

    public String getBoardUseYN() {
        return boardUseYN;
    }

    public void setBoardUseYN(String boardUseYN) {
        this.boardUseYN = boardUseYN;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getImgBankbook() {
        return imgBankbook;
    }

    public void setImgBankbook(String imgBankbook) {
        this.imgBankbook = imgBankbook;
    }

    public String getImgFamilyRL() {
        return imgFamilyRL;
    }

    public void setImgFamilyRL(String imgFamilyRL) {
        this.imgFamilyRL = imgFamilyRL;
    }

    public String getImgProfile() {
        return imgProfile;
    }

    public void setImgProfile(String imgProfile) {
        this.imgProfile = imgProfile;
    }

    public String getImgEtc() {
        return imgEtc;
    }

    public void setImgEtc(String imgEtc) {
        this.imgEtc = imgEtc;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getSiteKey() {
        return siteKey;
    }

    public void setSiteKey(String siteKey) {
        this.siteKey = siteKey;
    }

    public String getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(String modifyTime) {
        this.modifyTime = modifyTime;
    }

    public String getSystemtime() {
        return systemtime;
    }

    public void setSystemtime(String systemtime) {
        this.systemtime = systemtime;
    }

    public String getHpno() {
        return hpno;
    }

    public void setHpno(String hpno) {
        this.hpno = hpno;
    }

    public String getHpnoDepart() {
        return hpnoDepart;
    }

    public void setHpnoDepart(String hpnoDepart) {
        this.hpnoDepart = hpnoDepart;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }

    public String getJuminNo() {
        return juminNo;
    }

    public void setJuminNo(String juminNo) {
        this.juminNo = juminNo;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getCodeSeq() {
        return codeSeq;
    }

    public void setCodeSeq(String codeSeq) {
        this.codeSeq = codeSeq;
    }
        
    public String getSiteName() {
        return siteName;
    }
    
    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }    

    @Override
    public String toString() {
        return "Member{" +
                "userid='" + userid + '\'' +
                ", pwd='" + pwd + '\'' +
                ", name='" + name + '\'' +
                ", nameEng='" + nameEng + '\'' +
                ", email='" + email + '\'' +
                ", emailDepart='" + emailDepart + '\'' +
                ", birthday='" + birthday + '\'' +
                ", calendarType='" + calendarType + '\'' +
                ", gender='" + gender + '\'' +
                ", addr='" + addr + '\'' +
                ", addrDesc='" + addrDesc + '\'' +
                ", post='" + post + '\'' +
                ", departCode='" + departCode + '\'' +
                ", teamCode='" + teamCode + '\'' +
                ", jobPosition='" + jobPosition + '\'' +
                ", jobTitle='" + jobTitle + '\'' +
                ", hireType='" + hireType + '\'' +
                ", jobStatus='" + jobStatus + '\'' +
                ", jobStartDate='" + jobStartDate + '\'' +
                ", jobEndDate='" + jobEndDate + '\'' +
                ", payGiveType='" + payGiveType + '\'' +
                ", bankName='" + bankName + '\'' +
                ", marriedType='" + marriedType + '\'' +
                ", boardUseYN='" + boardUseYN + '\'' +
                ", memo='" + memo + '\'' +
                ", imgBankbook='" + imgBankbook + '\'' +
                ", imgFamilyRL='" + imgFamilyRL + '\'' +
                ", imgProfile='" + imgProfile + '\'' +
                ", imgEtc='" + imgEtc + '\'' +
                ", grade='" + grade + '\'' +
                ", state='" + state + '\'' +
                ", siteKey='" + siteKey + '\'' +
                ", modifyTime='" + modifyTime + '\'' +
                ", systemtime='" + systemtime + '\'' +
                ", hpno='" + hpno + '\'' +
                ", hpnoDepart='" + hpnoDepart + '\'' +
                ", bankAccount='" + bankAccount + '\'' +
                ", juminNo='" + juminNo + '\'' +
                ", code='" + code + '\'' +
                ", codeName='" + codeName + '\'' +
                ", codeSeq='" + codeSeq + '\'' +
                ", siteName='" + siteName + '\'' +
                '}';
    }
}
