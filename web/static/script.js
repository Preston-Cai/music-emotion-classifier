// handling audio recording on browser

let mediaRecorder;
let chunks = [];


window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start').onclick = async () => {
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("mic access granted.")
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.start();
      console.log("recording started.");
    } catch (err) {
      console.error("Mic access denied or error: ", err);
    }
};

  document.getElementById('stop').onclick = () => {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: 'audio/wav' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([audioBlob], 'audio.wav'));
      document.getElementById('hiddenFileInput').files = dataTransfer.files;
      document.getElementById('recordForm').submit(); // normal POST, browser navigates
    };
  };
});
