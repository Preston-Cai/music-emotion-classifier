'''webapp helper: audio recording and saving'''


import wave
import struct
import os

try:
    from pvrecorder import PvRecorder
except ImportError:
    print("PvRecorder not found. Please install it: pip install pvrecorder")
    exit(1)


def record_and_save():

    recorder = PvRecorder(frame_length=512, device_index=-1)
    audio = []

    try:
        recorder.start()

        while True:
            frame = recorder.read()
            audio.extend(frame)
    except KeyboardInterrupt:
        recorder.stop()
        with wave.open(os.path.join(r'web/uploads', 'audio.wav'), 'w') as f:
            f.setparams((1, 2, 16000, 512, "NONE", "NONE"))
            f.writeframes(struct.pack("h" * len(audio), *audio))
    finally:
        recorder.delete()

if __name__ == '__main__': 
    record_and_save()