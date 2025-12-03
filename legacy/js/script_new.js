import { getWaveBlob } from "webm-to-wav-converter";

window.getWaveBlob = getWaveBlob


const constraints = { audio: true, video: false };
let mediaRecorder;
const data = [];

window.addEventListener('DOMContentLoaded', () => {

    document.getElementById("start").onclick = async () => {
         try {
                data.length = 0;

                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
                
                mediaRecorder.start();
                
                console.log('recording started.')

        } catch (err) {
            console.error(err);
        };
    };
    

    document.getElementById("stop").onclick = () => {

        try {
            
            mediaRecorder.onstop = () => {

                // For 32-bit audio
                const wavBlob = getWaveBlob(data,true);
                dataTransfer = new DataTransfer();
                dataTransfer.items.add(new File([wavBlob], 'audio.wav'));
                document.getElementById('hiddenFileInput').files = dataTransfer.files;
                document.getElementById('recordForm').submit(); // normal POST, browser navigates
            };

            mediaRecorder.stop();
            
        } catch (err) {
            console.error(err);
        };
    };
});