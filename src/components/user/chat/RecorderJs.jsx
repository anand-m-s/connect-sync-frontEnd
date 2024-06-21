import { useState } from "react";
import { userAxios } from "../../../constraints/axios/userAxios";
import userApi from "../../../constraints/api/userApi";

let mediaRecorder = null;
let recordedChunks = [];

function RecorderJSDemo() {
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = () => {
        let constraints = {
            audio: true,
            video: false
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                console.log("initializing MediaRecorder...");
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = handleDataAvailable;
                mediaRecorder.start();
                setIsRecording(true);
                console.log("Recording started");
            }).catch(function (err) {
                console.error("Error initializing recording: ", err);
                alert('Error accessing media devices. Please ensure you have granted permission.');
            });
    };

    const stopRecording = () => {
        if (!mediaRecorder) {
            console.error("MediaRecorder is not initialized");
            return;
        }

        console.log("stopButton clicked");
        mediaRecorder.stop();
        setIsRecording(false);
    };

    const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }

        if (mediaRecorder.state === 'inactive') {
            const blob = new Blob(recordedChunks, { type: 'audio/wav' });
            recordedChunks = [];
            uploadAudio(blob);
        }
    };

    const uploadAudio = (blob) => {
        console.log("uploading...");
        let data = new FormData();
        data.append('text', "this is the transcription of the audio file");
        data.append('wavfile', blob, "recording.wav");
        for (let pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1]); 
        }
        //===============signed url for file upload then upload data to s3

        
        // userAxios.post('', data, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })
        // .then(response => {
        //     console.log("File uploaded successfully", response.data);
        // })
        // .catch(error => {
        //     console.error("Error uploading file", error);
        // });
    };

    return (
        <div>
            <button className="p-1" onClick={startRecording} type="button" disabled={isRecording}>Start</button>
            <button className="p-1" onClick={stopRecording} type="button" disabled={!isRecording}>Stop</button>
        </div>
    );
}

export default RecorderJSDemo;
