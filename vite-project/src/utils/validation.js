// utils/validation.js
export const validateForm = (event) => {
  event.preventDefault();
  const form = event.target.closest("form");
  if (!form) return false; // form 요소 없으면 false 반환

  if (!form.checkValidity()) {
    form.reportValidity(); // 브라우저 기본 메시지 표시
    return false;          // 유효하지 않음
  }
  return true;             // 유효함
};

// 새로 추가하는 함수: 특정 input만 선택해서 검사
export const validateInputs = (event, selectors = []) => {
  event.preventDefault();

  if (!Array.isArray(selectors) || selectors.length === 0) return false;

  let isValid = true;

  for (const selector of selectors) {
    const input = document.querySelector(selector);
    
    if (!input) continue;

    if (!input.checkValidity()) {
      input.reportValidity(); // 해당 input 오류 메시지 출력
      isValid = false;
      break; // 첫 번째 오류에서 중단
    }
  }

  return isValid;
};