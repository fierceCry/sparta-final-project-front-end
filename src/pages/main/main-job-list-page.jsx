import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { data } from "../../mock-data/job-address";
import "../../styles/main/main-job-list.scss";
import { submitRegion } from '../../services/main';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const cities = Array.from(new Set(data.map(item => item.시도명).filter(name => name)));
  const districts = Array.from(new Set(data.filter(item => item.시도명 === selectedCity).map(item => item.시군구명).filter(name => name)));
  const dongs = Array.from(new Set(data.filter(item => item.시군구명 === selectedDistrict).map(item => item.읍면동명).filter(name => name)));

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict("");
    setSelectedDong("");
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedDong("");
  };

  const handleDongChange = (e) => {
    setSelectedDong(e.target.value);
  };

  const handleSubmit = async () => {
    const selectedRegion = { city: selectedCity, district: selectedDistrict, dong: selectedDong };
    try {
      const response = await submitRegion(token, selectedRegion, navigate);
      console.log('Filtered Jobs:', response.localJob);
      onSubmit(response.localJob); // 부모 컴포넌트로 잡일 목록 전달
      onClose();
    } catch (error) {
      console.error('설정 완료 중 오류 발생:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>지역 설정</h2>
        <select value={selectedCity} onChange={handleCityChange}>
          <option value="">시도 선택</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedCity}>
          <option value="">시군구 선택</option>
          {districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
        <select value={selectedDong} onChange={handleDongChange} disabled={!selectedDistrict}>
          <option value="">읍면동 선택</option>
          {dongs.map(dong => (
            <option key={dong} value={dong}>{dong}</option>
          ))}
        </select>
        <button onClick={handleSubmit}>설정 완료</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Modal;
