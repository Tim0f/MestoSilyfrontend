export type UploadInput = FormData | Blob | File;

export function ensureFormData(input: UploadInput, fieldName = 'file'): FormData {
  if (typeof FormData === 'undefined') {
    throw new Error('FormData недоступен в текущем окружении. Передайте готовый экземпляр FormData.');
  }

  if (input instanceof FormData) {
    return input;
  }

  const formData = new FormData();
  formData.append(fieldName, input);
  return formData;
}

