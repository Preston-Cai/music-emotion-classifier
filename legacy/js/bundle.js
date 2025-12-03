(function () {
    'use strict';

    var webmToWavConverter = {};

    var wavBlobUtil;
    var hasRequiredWavBlobUtil;

    function requireWavBlobUtil () {
    	if (hasRequiredWavBlobUtil) return wavBlobUtil;
    	hasRequiredWavBlobUtil = 1;
    	function _writeStringToArray(aString, targetArray, offset) {
    	    for (let i = 0; i < aString.length; ++i)
    	        targetArray[offset + i] = aString.charCodeAt(i);
    	}

    	function _writeInt16ToArray(aNumber, targetArray, offset) {
    	    aNumber = Math.floor(aNumber);
    	    targetArray[offset + 0] = aNumber & 255;          // byte 1
    	    targetArray[offset + 1] = (aNumber >> 8) & 255;   // byte 2
    	}

    	function _writeInt32ToArray(aNumber, targetArray, offset) {
    	    aNumber = Math.floor(aNumber);
    	    targetArray[offset + 0] = aNumber & 255;          // byte 1
    	    targetArray[offset + 1] = (aNumber >> 8) & 255;   // byte 2
    	    targetArray[offset + 2] = (aNumber >> 16) & 255;  // byte 3
    	    targetArray[offset + 3] = (aNumber >> 24) & 255;  // byte 4
    	}

    	// Return the bits of the float as a 32-bit integer value.  This
    	// produces the raw bits; no intepretation of the value is done.
    	function _floatBits(f) {
    	    const buf = new ArrayBuffer(4);
    	    (new Float32Array(buf))[0] = f;
    	    const bits = (new Uint32Array(buf))[0];
    	    // Return as a signed integer.
    	    return bits | 0;
    	}

    	function _writeAudioBufferToArray(
    	    audioBuffer,
    	    targetArray,
    	    offset,
    	    bitDepth
    	) {
    	    let index = 0, channel = 0;
    	    const length = audioBuffer.length;
    	    const channels = audioBuffer.numberOfChannels;
    	    let channelData, sample;

    	    // Clamping samples onto the 16-bit resolution.
    	    for (index = 0; index < length; ++index) {
    	        for (channel = 0; channel < channels; ++channel) {
    	            channelData = audioBuffer.getChannelData(channel);

    	            // Branches upon the requested bit depth
    	            if (bitDepth === 16) {
    	                sample = channelData[index] * 32768.0;
    	                if (sample < -32768)
    	                    sample = -32768;
    	                else if (sample > 32767)
    	                    sample = 32767;
    	                _writeInt16ToArray(sample, targetArray, offset);
    	                offset += 2;
    	            } else if (bitDepth === 32) {
    	                // This assumes we're going to out 32-float, not 32-bit linear.
    	                sample = _floatBits(channelData[index]);
    	                _writeInt32ToArray(sample, targetArray, offset);
    	                offset += 4;
    	            } else {
    	                console.log('Invalid bit depth for PCM encoding.');
    	                return;
    	            }

    	        }
    	    }
    	}

    	// Converts the Blob data to AudioBuffer
    	async function _getAudioBuffer(blobData, contextOptions = undefined) {
    	    let blob = blobData;

    	    if (!(blob instanceof Blob)) blob = new Blob([blobData]);

    	    const url = URL.createObjectURL(blob);

    	    const response = await fetch(url);

    	    const arrayBuffer = await response.arrayBuffer();

    	    const audioContext = new AudioContext(contextOptions);

    	    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    	    return audioBuffer;
    	}

    	/**
    	 * 
    	 * @param {Blob | Blob[]} blobData - Blob or Blob[] to be converted to audio/wave Blob
    	 * @param {boolean} as32BitFloat - Convert to 16-bit or 32-bit file, default 16-bit
    	 * @param {AudioContextOptions} contextOptions - optiosn needs to be used for encoding
    	 * @returns 
    	 */
    	async function getWaveBlob(
    	    blobData, as32BitFloat, contextOptions = undefined
    	) {
    	    const audioBuffer = await _getAudioBuffer(blobData, contextOptions);

    	    // Encoding setup.
    	    const frameLength = audioBuffer.length;
    	    const numberOfChannels = audioBuffer.numberOfChannels;
    	    const sampleRate = audioBuffer.sampleRate;
    	    const bitsPerSample = as32BitFloat ? 32 : 16;
    	    const bytesPerSample = bitsPerSample / 8;
    	    const byteRate = sampleRate * numberOfChannels * bitsPerSample / 8;
    	    const blockAlign = numberOfChannels * bitsPerSample / 8;
    	    const wavDataByteLength = frameLength * numberOfChannels * bytesPerSample;
    	    const headerByteLength = 44;
    	    const totalLength = headerByteLength + wavDataByteLength;
    	    const waveFileData = new Uint8Array(totalLength);
    	    const subChunk1Size = 16;
    	    const subChunk2Size = wavDataByteLength;
    	    const chunkSize = 4 + (8 + subChunk1Size) + (8 + subChunk2Size);

    	    _writeStringToArray('RIFF', waveFileData, 0);
    	    _writeInt32ToArray(chunkSize, waveFileData, 4);
    	    _writeStringToArray('WAVE', waveFileData, 8);
    	    _writeStringToArray('fmt ', waveFileData, 12);

    	    // SubChunk1Size (4)
    	    _writeInt32ToArray(subChunk1Size, waveFileData, 16);
    	    // AudioFormat (2): 3 means 32-bit float, 1 means integer PCM.
    	    _writeInt16ToArray(as32BitFloat ? 3 : 1, waveFileData, 20);
    	    // NumChannels (2)
    	    _writeInt16ToArray(numberOfChannels, waveFileData, 22);
    	    // SampleRate (4)
    	    _writeInt32ToArray(sampleRate, waveFileData, 24);
    	    // ByteRate (4)
    	    _writeInt32ToArray(byteRate, waveFileData, 28);
    	    // BlockAlign (2)
    	    _writeInt16ToArray(blockAlign, waveFileData, 32);
    	    // BitsPerSample (4)
    	    _writeInt32ToArray(bitsPerSample, waveFileData, 34);
    	    _writeStringToArray('data', waveFileData, 36);
    	    // SubChunk2Size (4)
    	    _writeInt32ToArray(subChunk2Size, waveFileData, 40);

    	    // Write actual audio data starting at offset 44.
    	    _writeAudioBufferToArray(audioBuffer, waveFileData, 44, bitsPerSample);

    	    return new Blob([waveFileData], {
    	        type: 'audio/wave'
    	    });
    	}

    	wavBlobUtil = getWaveBlob;
    	return wavBlobUtil;
    }

    var downloadUtil;
    var hasRequiredDownloadUtil;

    function requireDownloadUtil () {
    	if (hasRequiredDownloadUtil) return downloadUtil;
    	hasRequiredDownloadUtil = 1;
    	const getWaveBlob = requireWavBlobUtil();

    	/**
    	 * @param {Blob | Blob[]} blobData - Blob or Blob[] to be converted to audio/wave Blob
    	 * @param {boolean} as32BitFloat - Convert to 16-bit or 32-bit file
    	 * @param {string} filename - Name of the file
    	 * @param {AudioContextOptions} contextOptions - audio context options for encoding
    	 * @returns
    	 */
    	async function downloadWav(
    	    blobData, as32BitFloat, filename = null, contextOptions = undefined
    	) {
    	    const blob = await getWaveBlob(blobData, as32BitFloat, contextOptions);

    	    const anchorElement = document.createElement('a');
    	    anchorElement.href = window.URL.createObjectURL(blob);
    	    anchorElement.download = filename || `recording('${as32BitFloat ? '32bit' : '16bit'}).wav`;
    	    anchorElement.style.display = 'none';
    	    document.body.appendChild(anchorElement);
    	    anchorElement.click();
    	    document.body.removeChild(anchorElement);
    	}

    	downloadUtil = downloadWav;
    	return downloadUtil;
    }

    var WavRecorder_1;
    var hasRequiredWavRecorder;

    function requireWavRecorder () {
    	if (hasRequiredWavRecorder) return WavRecorder_1;
    	hasRequiredWavRecorder = 1;
    	const getWaveBlob = requireWavBlobUtil();
    	const downloadWav = requireDownloadUtil();

    	/** Class Representing a WavRecorder */
    	class WavRecorder {
    	    /**
    	     * @property {MediaRecorder} mediaRecorder - MediaRecorder instance
    	     */
    	    mediaRecorder;

    	    /**
    	     * @property {MediaStream} - stream User's MediaStream
    	     */
    	    stream;

    	    /**
    	     * @property {Blob} __data - Recorded WEBM data
    	     */
    	    __data;

    	    /**
    	     * Access user media from the audio input, will be asking audio permission if not available already
    	     * @param {MediaTrackConstraints} constraints - MediaTrackConstraints to be applied, if any defaults = { audio: true, video: false }
    	     * @return - Got User MediaStream or not
    	     */
    	    async start(constraints = { audio: true, video: false }) {
    	        if (this.mediaRecorder?.state === "recording") return true;

    	        const mediaTrackConstraints = constraints || { audio: true, video: false };

    	        try {
    	            this.stream = await navigator.mediaDevices.getUserMedia(mediaTrackConstraints);

    	            this.mediaRecorder = new MediaRecorder(this.stream);

    	            this.mediaRecorder.ondataavailable = (e) => this.__data = e.data;
    	        } catch (err) {
    	            console.error(err);
    	            return false;
    	        }

    	        this.mediaRecorder?.start();
    	        return true;
    	    }

    	    /**
    	     * Stop recording the audio
    	     * @returns {void}
    	     */
    	    stop() {
    	        if (this.mediaRecorder?.state !== "recording") return true;

    	        this.mediaRecorder.stop();
    	        this.mediaRecorder.onstop = () => {
    	            this.stream.getTracks().forEach(track => track.stop());
    	            this.mediaRecorder = undefined;
    	            this.stream = undefined;
    	        };
    	    }

    	    /**
    	     * Download the wav audio file
    	     * @param {string} filename - Optional name of the file to be downloaded, without extension 
    	     * @param {boolean} as32Bit - Audio required in 32-bit, default is 16-bit.
    	     * @param {AudioContextOptions} contextOptions - optiosn needs to be used for encoding
    	     * @returns {void}
    	     */
    	    async download(
    	        filename = null, as32Bit = false, contextOptions = undefined
    	    ) {
    	        if (this.__data) return await downloadWav(this.__data, as32Bit, filename, contextOptions);
    	    }

    	    /**
    	     * Get the recorded wav audio Blob
    	     * @param {boolean} as32Bit - Get 32-bit audio, default is 16-bit
    	     * @param {AudioContextOptions} contextOptions - optiosn needs to be used for encoding
    	     * @returns {void}
    	     */
    	    async getBlob(as32Bit = false, contextOptions = undefined) {
    	        if (this.__data) return await getWaveBlob(this.__data, as32Bit, contextOptions);
    	    }
    	}

    	WavRecorder_1 = WavRecorder;
    	return WavRecorder_1;
    }

    var hasRequiredWebmToWavConverter;

    function requireWebmToWavConverter () {
    	if (hasRequiredWebmToWavConverter) return webmToWavConverter;
    	hasRequiredWebmToWavConverter = 1;
    	webmToWavConverter.WavRecorder = requireWavRecorder();
    	webmToWavConverter.getWaveBlob = requireWavBlobUtil();
    	webmToWavConverter.downloadWav = requireDownloadUtil();
    	return webmToWavConverter;
    }

    var webmToWavConverterExports = requireWebmToWavConverter();

    window.getWaveBlob = webmToWavConverterExports.getWaveBlob;


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

            } catch (err) {
                console.error(err);
            }    };
        

		document.getElementById("stop").onclick = (e) => {
			document.getElementById("stop").remove();

			console.log("TEST");
		};

        document.getElementById("stop").onclick = () => {

            try {
                
                mediaRecorder.onstop = () => {

                    // For 32-bit audio
                    const wavBlob = webmToWavConverterExports.getWaveBlob(data,true);
                    dataTransfer = new DataTransfer();
                    dataTransfer.items.add(new File([wavBlob], 'audio.wav'));
                    document.getElementById('hiddenFileInput').files = dataTransfer.files;
                    document.getElementById('recordForm').submit(); // normal POST, browser navigates
                };

                mediaRecorder.stop();
                
            } catch (err) {
                console.error(err);
            }    };
    });

})();
