/**
 * @title Coin experiment - UCL
 * @description
 * @version 0.1.0
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";
import "../styles/wheel.css";
import "../styles/loader.css";

// jspsych
import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";

// customised
import DishonestyPlugin from "./plugins/dishonesty";
import SpinningWheelPlugin from "./plugins/wheel";
import DisplayTextPlugin from "./plugins/display-text";
import SerialNumberPlugin from "./plugins/serial-num";
import { BLOCK_INSTRUCTIONS, BREAK, CONDITION_ARR, IMAGERY } from "./constants";
import {
  createBreakConditionBlockSuit,
  createMentalImageryConditionBlockSuit,
  createMultipleBlock,
} from "./block";

// firebase
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({
  assetPaths,
  input = {},
  environment,
  title,
  version,
}) {
  /**
   * Firebase config, related helper function, and utils
   */
  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  /**
   * Helper function to save the subject data to Firestore.
   *
   * @param {String} subjectCode - The subject code, which could be a Prolific ID or "TEST".
   * @param {Object} data - The data to be saved, in JSON format.
   */
  const saveSubjectData = async (subjectCode, data) => {
    try {
      const dataArr = JSON.parse(data.json());
      const dataObject = dataArr.reduce((acc, trial, i) => {
        acc[i] = trial;
        return acc;
      }, {});

      console.log(dataObject);

      //const updatedSubjectCode = await checkIfSubjectDataExist(subjectCode);
      await setDoc(doc(db, "users", subjectCode), dataObject);
      console.log("Document written with participant ID:", subjectCode);
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  /**
   * Initialising jsPsych and get participant ID.
   */
  const jsPsych = initJsPsych();
  const timeline = [];

  const date = new Date().toJSON();
  // Get user info from prolific if there are
  const subject_id = jsPsych.data.getURLVariable("PROLIFIC_PID")
    ? jsPsych.data.getURLVariable("PROLIFIC_PID")
    : "TEST".concat(date);
  const study_id = jsPsych.data.getURLVariable("STUDY_ID");
  const session_id = jsPsych.data.getURLVariable("SESSION_ID");

  console.log(subject_id, study_id, session_id);

  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });

  // Welcome screen
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: "<p>Welcome to our experiment!</p>",
  });

  // Switch to fullscreen
  // timeline.push({
  //   type: FullscreenPlugin,
  //   fullscreen_mode: true,
  // });

  const serial_num_trial = {
    type: SerialNumberPlugin,
  };

  const dishonesty_trial = {
    type: DishonestyPlugin,
  };

  const display_text_trial = {
    type: DisplayTextPlugin,
  };

  const instruction_trial = {
    type: HtmlKeyboardResponsePlugin,
  };

  // show the spinning wheel
  timeline.push({
    type: SpinningWheelPlugin,
  });

  createMultipleBlock(
    instruction_trial,
    BLOCK_INSTRUCTIONS,
    dishonesty_trial,
    display_text_trial,
    serial_num_trial,
    CONDITION_ARR,
    timeline
  );

  // createMentalImageryConditionBlockSuit(
  //   dishonesty_trial,
  //   display_text_trial,
  //   IMAGERY,
  //   timeline
  // )

  // createBreakConditionBlockSuit(
  //   dishonesty_trial,
  //   display_text_trial,
  //   serial_num_trial,
  //   BREAK,
  //   timeline
  // );

  // Ending information, saved the data and redirect the users.
  // timeline.push({
  //   type: HtmlKeyboardResponsePlugin,
  //   stimulus: `
  //     <p style='font-size: 20px'>This is the end of the experiment!</p>
  //     <p style='font-size: 20px'>Thank you so much!</p>
  //     <p style='font-size: 16px'>Press any key to complete your submission on prolific.</p>
  //   `,
  //   on_finish: async () => {
  //     await saveSubjectData(subject_id, jsPsych.data.get());
  //     window.location = process.env.PROLIFIC_REDIRECT_URL || "https://app.prolific.com/";
  //   },
  // });

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
