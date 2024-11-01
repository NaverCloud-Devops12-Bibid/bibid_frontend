import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import RegisterProgress from '../components/registration/RegisterProgress';
import RegistrationStep1 from '../components/registration/RegistrationStep1';
import RegistrationStep2 from '../components/registration/RegistrationStep2';
import RegistrationStep3 from '../components/registration/RegistrationStep3';
import RegistrationStep4 from '../components/registration/RegistrationStep4';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [memberInfo, setMemberInfo] = useState(null);
  const memberIndex = useSelector((state) => state.memberSlice.memberIndex); 

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        console.log(memberIndex);
        const response = await axios.get(`http://${process.env.REACT_APP_BACK_SERVER}/mypage/userInfo/${memberIndex}`);
        console.log("Fetched member info:", response.data.item);
        setMemberInfo(response.data.item);
      } catch (error) {
        console.error("Error fetching member info:", error);
      }
    };

    if (memberIndex) {
      fetchMemberInfo();
    }
  }, [memberIndex]);

  const [formData, setFormData] = useState({
    auctionType: '',
    category: '',
    subcategory: '',
    productName: '',
    productDescription: '',
    startingPrice: '',
    startingLocalDateTime: '',
    endingLocalDateTime: '',
    bidIncrement: '',
    shippingMethod: '택배',
    costResponsibility: '선불',
    instantPurchaseEnabled: false,
    instantPurchasePrice: '',
    autoReauctionEnabled: false,
    reauctionStartingPrice: '',
    thumbnail: '',
    additionalImages: [],
  });

  const stepMap = {
    '/registration/step1': 1,
    '/registration/step2': 2,
    '/registration/step3': 3,
    '/registration/step4': 4,
  };

  const [currentStep, setCurrentStep] = useState(stepMap[location.pathname] || 1);

  useEffect(() => {
    setCurrentStep(stepMap[location.pathname] || 1);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const nextStep = () => {
    const nextStepNum = currentStep + 1;
    navigate(`/registration/step${nextStepNum}`);
  };

  const prevStep = () => {
    const prevStepNum = currentStep - 1;
    if (prevStepNum >= 1) {
      navigate(`/registration/step${prevStepNum}`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegistrationStep1 formData={formData} setFormData={setFormData} nextStep={nextStep} />;
      case 2:
        return <RegistrationStep2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <RegistrationStep3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} memberInfo={memberInfo} />;
      case 4:
        return <RegistrationStep4 memberInfo={memberInfo}/>;
      default:
        return null;
    }
  };

  return (
    <div>
      <RegisterProgress activeStep={currentStep - 1} />
      {renderStep()}
    </div>
  );
};

export default RegistrationForm;