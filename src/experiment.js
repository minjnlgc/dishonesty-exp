/**
 * @title Coin experiment - UCL
 * @description
 * @version 0.1.0
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";
import "../styles/envelop.css";

// jspsych
import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";

// customised
import DishonestyPlugin from "./plugins/dishonesty";
import {

  BLUE_HEX,
  CONDITIONS,
  CONTINUE_PROMT_HTML,
  GREEN_HEX,
  PRACTICE_JAR_IMG_NAMES,
  PRACTICE_QUIZ,
  RECAP_INSTRUCTION,
  RED_HEX,
} from "./constants";
import {
  createPracticeBlock,
} from "./block";

// firebase
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc
} from "firebase/firestore";
import QuizPlugin from "./plugins/quiz";
import { initializeAdviceEstimation } from "./block";
import { createConditionArray } from "./block";
import { createBlock } from "./block";
import { splitCondtionArray } from "./block";
import BonusPlugin from "./plugins/bonus";

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

  // Add to data properties only if prolific info are not undefined or not contain 'TEST'
  if (!subject_id.includes("TEST") && study_id && session_id) {
    jsPsych.data.addProperties({
      subject_id: subject_id,
      study_id: study_id,
      session_id: session_id,
    });
  }

  /**
   * Get the envelope colors based on UTC time
   */
  const getEnvelopeColors = () => {
    const currUTCHours = new Date().getUTCHours();
    console.log(currUTCHours);

    // Assuming "morning" is defined as before or equal to 12 UTC
    const isMorning = currUTCHours <= 12;

    // adding the readable color name to all the data
    jsPsych.data.addProperties({
      PRIVATE_COLOR: isMorning ? "RED" : "BLUE",
      PUBLIC_COLOR: isMorning ? "BLUE" : "RED",
    });

    console.log({
      PRIVATE_COLOR: isMorning ? "RED" : "BLUE",
      PUBLIC_COLOR: isMorning ? "BLUE" : "RED",
    });

    // return the object contains the condition and the corresponding colours set.
    return {
      BASELINE: GREEN_HEX,
      PRIVATE: isMorning ? RED_HEX : BLUE_HEX,
      PUBLIC: isMorning ? BLUE_HEX : RED_HEX,
    };
  };

  // Get the colors for the current participant
  const envelope_colors = getEnvelopeColors();
  console.log(envelope_colors);

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

  /**
   * Practice trials
   */
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>In the following you will see 3 practice trials. </p> ${CONTINUE_PROMT_HTML}`,
  });

  const PRACTICE_JAR_IMAGE_ESTIMATION_DICTIONARY = initializeAdviceEstimation(
    PRACTICE_JAR_IMG_NAMES
  );
  const practice_dishonesty_trial = {
    type: DishonestyPlugin,
    jar_image_estimation_dictionary: PRACTICE_JAR_IMAGE_ESTIMATION_DICTIONARY,
    envelope_colors: envelope_colors,
  };

  createPracticeBlock(
    practice_dishonesty_trial,
    timeline,
    CONDITIONS,
    PRACTICE_JAR_IMG_NAMES
  );

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>Well done! You have finished the practice trials.</p> ${CONTINUE_PROMT_HTML}`,
  });

  /**
   * Instructions recap & Quiz
   */

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>Before starting the experiment, there are some quizzes to test your understanding. </p> ${CONTINUE_PROMT_HTML}`,
  });

  timeline.push({
    type: QuizPlugin,
    question_list: PRACTICE_QUIZ,
    recap_instruction_content: RECAP_INSTRUCTION,
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>Well done! You have finished the quizzes. <br> We can start the experiment!</p> ${CONTINUE_PROMT_HTML}`,
  });

  /**
   * Main experiment
   */
  // initialised the dictionary with image and generated estimation
  const JAR_IMAGE_ESTIMATION_DICTIONARY = initializeAdviceEstimation();
  console.log(JAR_IMAGE_ESTIMATION_DICTIONARY);

  // create the array the contains the sequence of the conditions showing up in this experiment
  const condition_arr = createConditionArray();
  console.log(condition_arr);

  const dishonesty_trial = {
    type: DishonestyPlugin,
    jar_image_estimation_dictionary: JAR_IMAGE_ESTIMATION_DICTIONARY,
    envelope_colors: envelope_colors,
  };

  // split condition array into two halfs, so that we can have two block
  const { first_half, second_half } = splitCondtionArray(condition_arr);

  // first block
  // remove slice to see all
  createBlock(dishonesty_trial, timeline, first_half.slice(0, 3));

  // break
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>This is a break. </p>${CONTINUE_PROMT_HTML}`,
  });

  // second block
  // remove slice to see all
  createBlock(dishonesty_trial, timeline, second_half.slice(0, 3));

  /**
   * Experiment End
   */

  // showing bonus
  timeline.push({
    type: BonusPlugin,
  });

  // Ending information, saved the data and redirect the users.
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <p style='font-size: 20px'>This is the end of the experiment!</p>
      <p style='font-size: 20px'>Thank you so much!</p>
      <p style='font-size: 16px'>Press any key to complete your submission on prolific.</p>
    `,
    // on_finish: async () => {
    //   await saveSubjectData(subject_id, jsPsych.data.get());
    //   window.location = process.env.PROLIFIC_REDIRECT_URL || "https://app.prolific.com/";
    // }, // uncomment this part to save data and redirect
  });

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych; // comment this out if dont want showing data on the screen
}
