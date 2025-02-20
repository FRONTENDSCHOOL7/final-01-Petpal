import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSignUp, checkEmailExist } from '../../api/signUpApi';

import { StyledLabel } from '../Common/Input/InputStyle';
import Input from '../Common/Input/Input';
import Button from '../Common/Button/SubmitButton/Button';
import { uploadImg } from '../../api/imageApi';

import {
  ProfileImgBox,
  ProfileImg,
  ProfileUpload,
  AddressBox,
  SearchBtn,
  Search,
  LinkWrapper,
  LoginLink,
  MainLink,
} from './SignUpStyle';
import AddressSearch from '../AddressSearch/AddressSearch';
import { FormContainer, H1 } from '../Common/Layout/LayoutStyle';
import imgProfileBtn from '../../assets/image/profile-btn.svg';
import profileImg from '../../assets/image/profile.svg';
import CustomAlert from '../../pages/LoginPage/CustomAlert';

export default function SignUpForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(''); // 닉네임
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountname, setAccountname] = useState('');
  const [image, setImage] = useState(profileImg);
  const [selectedImage, setSelectedImage] = useState(null);
  const [intro, setIntro] = useState('');

  const [validCheck, setValidCheck] = useState(false); // 이메일 유효성 체크
  const [warningMessage, setWarningMessage] = useState(''); // response의 message

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 받아온 주소값 split 후 setIntro
  const handleAddressSelect = address => {
    setIntro(address.split(' ')[0]);
  };

  // accountname에 petpal_ + 현재시각 부여
  useEffect(() => {
    const generateUniqueAccountname = () => {
      const currentTime = new Date();
      const timestamp = `${currentTime.getFullYear()}${(
        currentTime.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}${currentTime
        .getDate()
        .toString()
        .padStart(2, '0')}${currentTime
        .getHours()
        .toString()
        .padStart(2, '0')}${currentTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}${currentTime
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
      const uniqueAccountname = `petpal_${timestamp}`;
      return uniqueAccountname;
    };

    // 회원가입 폼이 마운트될 때 자동으로 accountname 생성
    const generatedAccountname = generateUniqueAccountname();
    setAccountname(generatedAccountname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (file) {
      // 주어진 api에 허용된 확장자
      const allowedExtensions = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'tif',
        'heic',
      ];

      // 파일 확장자 추출
      const extension = file.name.split('.').pop().toLowerCase();

      if (allowedExtensions.includes(extension)) {
        setSelectedImage(file);
      } else {
        // alert(
        //   '올바른 이미지 유형을 선택하세요 (.jpg, .jpeg, .png, .gif, .bmp, .tif, .heic).',
        // );
        setAlertMessage(
          '올바른 이미지 유형을 선택하세요 (.jpg, .jpeg, .png, .gif, .bmp, .tif, .heic).',
        );
        setShowAlert(true);
      }
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    if (isSuccess) {
      navigate('/login');
    }
  };

  const handleSignUp = async e => {
    // 기본 펫팔 프로필 이미지 URL
    let baseImage = 'https://api.mandarin.weniv.co.kr/1698598137638.jpg';
    try {
      e.preventDefault();
      if (selectedImage) {
        const imgData = new FormData();
        imgData.append('image', selectedImage);
        const imageUpload = await uploadImg(imgData);
        const imagePath = imageUpload.data.filename;
        baseImage = `https://api.mandarin.weniv.co.kr/${imagePath}`;
      }
      const userData = {
        user: {
          username,
          email,
          password,
          accountname,
          image: baseImage,
          intro,
        },
      };

      const isEmailValid = await checkEmailExist(userData);

      if (isEmailValid.data.message === '사용 가능한 이메일 입니다.') {
        setWarningMessage('');
        setValidCheck(!validCheck);
        const response = await postSignUp(userData);

        if (response.status === 200) {
          setAlertMessage('회원가입 성공');
          setShowAlert(true);
          setIsSuccess(true);
        }
      } else if (
        isEmailValid.data.message === '이미 가입된 이메일 주소 입니다.'
      ) {
        setWarningMessage(isEmailValid.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FormContainer className="signUpContainer">
      <H1>이메일로 회원가입</H1>
      <ProfileImgBox>
        <ProfileImg
          src={selectedImage ? URL.createObjectURL(selectedImage) : image}
          alt="프로필 이미지"
        />
        <label htmlFor="profileImageUpload">
          <ProfileUpload src={imgProfileBtn} alt="사진 업로드 버튼 이미지" />
        </label>
        <input
          type="file"
          id="profileImageUpload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </ProfileImgBox>
      <form onSubmit={handleSignUp} className="signUpForm">
        <Input
          id="userNameSignUp"
          type="text"
          label="닉네임"
          placeholder="2~10자 이내여야 합니다."
          onChange={e => {
            setUsername(e.target.value);
          }}
          className="signUpInput"
        />
        <Input
          id="emailSignUp"
          type="text"
          label="이메일"
          placeholder="이메일을 입력해 주세요."
          onChange={e => {
            setEmail(e.target.value);
          }}
          className="signUpInput"
        />
        {warningMessage && (
          <div
            style={{
              color: 'red',
              fontSize: '12px',
              marginBottom: '15px',
              marginTop: '-10px',
            }}
          >
            {warningMessage}
          </div>
        )}
        <Input
          id="passwordSignUp"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요."
          onChange={e => {
            setPassword(e.target.value);
          }}
          className="signUpInput"
        />
        <AddressBox>
          <StyledLabel label="주소">주소</StyledLabel>
          <AddressSearch
            onAddressSelect={handleAddressSelect}
            className="signUpAddress"
          />
          <SearchBtn type="button">
            <Search className="a11yHidden">검색</Search>
          </SearchBtn>
        </AddressBox>
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={!username || !email || !password || !intro}
          className="signUpBtn"
        >
          펫팔하러 GO!
        </Button>
      </form>
      <LinkWrapper>
        <LoginLink to="/login">로그인</LoginLink>
        <MainLink to="/">메인으로 돌아가기</MainLink>
      </LinkWrapper>
      {showAlert && <CustomAlert message={alertMessage} onClose={closeAlert} />}
    </FormContainer>
  );
}
