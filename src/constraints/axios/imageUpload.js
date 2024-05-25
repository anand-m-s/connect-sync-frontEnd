import axios from 'axios';


export const uploadImages = async (formikValues) => {
  console.log('inside upload image')
  console.log(formikValues)
  const imageUrls = [];
  const presetKey = import.meta.env.VITE_USER_UPLOAD_PRESET_CLOUDINARY
  const userKey = import.meta.env.VITE_USER_USERID_CLOUDINARY
  for (const imageFile of formikValues) {
    // console.log("formik images", imageFile);

    // Create a Blob from the File object
    const blob = new Blob([imageFile], { type: imageFile.type });
    // console.log("response blob", blob);

    // Create FormData to send the Blob to Cloudinary
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", presetKey); 

    try {
      console.log("formdata in url", formData);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${userKey}/image/upload`,
        formData
      );
      console.log("res from cloud", res);

      // Extract the URL of the uploaded image
      const imageUrl = res.data.url;
      imageUrls.push(imageUrl);
      // console.log("imageurls", imageUrls);
    } catch (error) {
      console.log("Error uploading image:", error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    }
  }

  return imageUrls; // Return the array of image URLs
};