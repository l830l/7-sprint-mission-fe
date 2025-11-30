export function base64ToFile(base64Data, filename = "image.jpg", mimeType = "image/jpeg") {
  try {
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([intArray], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  } catch (err) {
    console.error("base64ToFile 변환 실패:", err);
    return null;
  }
}