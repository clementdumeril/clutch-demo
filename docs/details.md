# Clutch demo: method and results in detail

## Pipeline

1. Calibration, about 9 minutes: 3 min rest, a 2 min timed mental-math test, 2 min recovery, with two short questionnaires. EEG (Muse 2: TP9, AF7, AF8, TP10, 256 Hz), watch and webcam record together.
2. Teacher: on each electrode, theta, alpha and beta power in bands placed on the person's individual alpha frequency. Windows with bad contact, head motion or muscle tension are dropped. Signals whose rest-to-stress effect size is large enough are kept, in whichever direction they moved for this person.
3. Student: a ridge regression from heart rate (Garmin watch) and the 7 webcam face indicators (MediaPipe, in the browser), each as a change from the person's rest, to the teacher's curve.
4. After the calibration, the student scores alone. In the recording shown, a study protocol follows: relaxation, easy math, hard math, colour words, 3 min each.

The page does not run the models: [`data.json`](../data.json) holds the per-second scores that the team's code produced when this recording was replayed through it (`tools/build_demo.py` in the team repository). [`demo.js`](../demo.js) draws them.

## Shared model on a new person

One model for everyone, tested on the person it never saw (leave-one-participant-out, 4 sessions, 34 min labelled). AUC for relaxation against hard math and colour words. Source: `results.shared` in [`data.json`](../data.json).

| Features | AUC |
| --- | --- |
| EEG | 0.83 |
| Muscle (EMG) | 0.69 |
| Heart rate | 0.36 |
| Face | 0.37 |
| Heart + face, no headset | 0.35 |

EEG features carry over to a new person; heart rate and face do not, and only become useful once calibrated on the person by the headset.

## What I built, in full

In the team repository I wrote 39 of the 48 commits:

- the Python app: Muse 2 streaming through muse-lsl, EEG processing (filters, band power on the individual alpha frequency, muscle and contact rejection), the calibration protocol and the teacher, the Garmin heart-rate connection over Bluetooth, and the browser UI;
- the 7 face indicators computed in the browser with MediaPipe (`frontend/face-sensor.js`);
- dataset recording and export, model training from the browser, and the leave-one-participant-out evaluation behind the table above;
- this demo: `tools/build_demo.py` there, and `index.html`, `demo.js`, `demo.css` here.

Riley wrote the webcam face-tracker page, the personal model used as the student (`clutch/personal.py`), the calibration flip check, the study protocol and the `ml/` evaluation pipeline. Rishi drew the pixel-art sea that the UI style follows, made the breathing break, and added the second participant's session.

## Overview figure

[`figures/overview.svg`](figures/overview.svg), hand-written, with crops of a frame captured by [`tools/capture_frames.mjs`](../tools/capture_frames.mjs) (sensor panel, live chart, timeline).
