import axios from "axios";

export async function uploadFileToSignedUrl(signedUrl, file, contentType, onProgress, onComplete) {
  axios
    .put(signedUrl, file, {
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress(progressEvent);
        }
      },
      headers: {
        "Content-Type": contentType,
      },
    })
    .then((response) => {
      if (onComplete) {
        onComplete(response);
      }
    })
    .catch((err) => {
      console.error(err.response);
    });
}
