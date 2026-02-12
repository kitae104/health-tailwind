import axios from 'axios';
import { getApiBaseUrl } from "./apiBase";

const API_BASE_URL = `${getApiBaseUrl()}/api`;
// const API_BASE_URL = "http://114.71.147.30:8080/api";

// axios 인스턴스 생성
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// 요청 인터셉터 설정 
api.interceptors.request.use(
    (config) => {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const apiService = {
    //==================================
    // 인증 데이터 관리
    //==================================
    saveAuthData: (token, roles) => {
        localStorage.setItem('token', token)    // 토큰 저장
        localStorage.setItem('roles', JSON.stringify(roles)) // 역할 저장
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
    }, 
    
    hasRole: (roleName) => {
        const roles = localStorage.getItem('roles');
        return roles ? JSON.parse(roles).includes(roleName) : false;
    },

    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;  // 토큰 존재 여부로 인증 상태 확인
    },

    isDoctor: () => {
        return apiService.hasRole('DOCTOR');    // 'DOCTOR' 역할 확인
    },

    isPatient: () => {
        return apiService.hasRole('PATIENT');
    },

    //==================================
    // 인증 및 사용자 관리
    //==================================
    login: (body) => api.post('/auth/login', body),     // 로그인

    register: (body) => api.post('/auth/register', body),   // 회원가입

    forgotPassword: (body) => api.post('/auth/forgot-password', body), // 비밀번호 재설정 요청

    resetPassword: (body) => api.post('/auth/reset-password', body), // 비밀번호 재설정

    getUserDetails: () => api.get('/users/me'), // 현재 사용자 정보 조회

    getUserById: (userId) => api.get(`/users/by-id/${userId}`), // 특정 사용자 정보 조회

    getAllUsers: () => api.get('/users/all'), // 모든 사용자 조회

    updatePassword: (updatePasswordRequest) => api.put('/users/update-password', updatePasswordRequest), // 비밀번호 업데이트

    uploadProfilePicture: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return api.put('/users/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    //==================================
    // 환자 관리
    //==================================
    getMyPatientProfile: () => api.get('/patients/me'), // 내 환자 프로필 조회

    updateMyPatientProfile: (body) => api.put('/patients/me', body), // 내 환자 프로필 업데이트

    getPatientById: (patientId) => api.get(`/patients/${patientId}`), // 특정 환자 정보 조회

    getAllGenotypeEnums: () => api.get('/patients/genotypes'), // 모든 유전자형 열거형 조회

    getAllBloodGroupEnums: () => api.get('/patients/bloodgroup'), // 모든 혈액형 열거형 조회

    
    //==================================
    // 의사 관리
    //==================================
    getMyDoctorProfile: () => api.get('/doctors/me'), // 내 의사 프로필 조회

    updateMyDoctorProfile: (body) => api.put('/doctors/me', body), // 내 의사 프로필 업데이트

    getAllDoctors: () => api.get('/doctors'), // 모든 의사 조회

    getDoctorById: (doctorId) => api.get(`/doctors/${doctorId}`), // 특정 의사 정보 조회

    getAllDocgetAllSpecializationEnumstors: () => api.get('/doctors/specializations'), // 모든 전문 분야 열거형 조회


    //==================================
    // 예약 관리
    //==================================
    bookAppointment: (appointmentDTO) => api.post('/appointments', appointmentDTO), // 예약 생성

    getMyAppointments: () => api.get('/appointments'), // 내 예약 조회

    cancelAppointment: (appointmentId) => api.put(`/appointments/cancel/${appointmentId}`), // 예약 취소

    completeAppointment: (appointmentId) => api.put(`/appointments/complete/${appointmentId}`), // 예약 완료


    //==================================
    // 상담 관리
    //==================================
    createConsultation: (consultationDTO) => api.post('/consultations', consultationDTO), // 상담 생성

    getConsultationByAppointmentId: (appointmentId) => api.get(`/consultations/appointment/${appointmentId}`), // 예약 ID로 상담 조회

    getConsultationHistoryForPatient: (patientId) => 
        api.get("/consultations/history", { params: {patientId}}), // 환자 상담 기록 조회

};

export default api;