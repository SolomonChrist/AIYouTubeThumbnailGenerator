
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // result is "data:image/jpeg;base64,LzlqLzRBQ...""
          // we need to remove the "data:image/jpeg;base64," part.
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('Failed to read file as Base64 string.'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
};
