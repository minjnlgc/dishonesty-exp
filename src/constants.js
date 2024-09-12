// Constants for advice condition
export const BASELINE = "BASELINE";
export const PRIVATE = "PRIVATE";
export const PUBLIC = "PUBLIC";

export const CONDITIONS = [BASELINE, PRIVATE, PUBLIC];

// colors hex
export const GREEN_HEX = "#7bc043";
export const RED_HEX = "#ee4035";
export const BLUE_HEX = "#0392cf";

// Constants for different advice of condition
export const ADVICE_PROMPT = {
  BASELINE:
    "<span style='color: {HEX};'>No advice to you</span> - The advice shared with other participants",
  PRIVATE:
    "<span style='color: {HEX};'>Private advice</span> - The advice only shared with you: <br> The jar contains {num} pounds.",
  PUBLIC:
    "<span style='color: {HEX};'>Public advice</span> - The advice shared with all participants: <br> The jar contains {num} pounds.",
};

// Offset for generating advice
export const OFFSET = 2;

// practice trials image
export const PRACTICE_JAR_IMG_NAMES = ["5.23.jpg", "6.28.jpg", "7.31.jpg"];

// For dishonesty old coin experiment
// Constants for condition
// export const BASELINE = "BASELINE";
export const IMAGERY = "IMAGERY";
export const BREAK = "BREAK";

export const CONDITION_ARR = [BASELINE, IMAGERY, BREAK];

// Constants for roles
export const ADVISOR = "ADVISOR";
export const ESTIMATOR = "ESTIMATOR";

// Constants for estimate types
export const ACCURATE = "ACCURATE";
export const HIGH = "HIGH";

// Constants for fixation cross
export const FIXATION_CROSS_HTML = `<h1 style='font-size: 60px;'>+</h1>`;
export const FIXATION_CROSS_DURATION = 3000;

// Constants for instruction prompts
export const CONTINUE_PROMT_HTML = "<p><i>Press any key to continue</i></p>";

// constants for dishonesty trial
export const JARS_IMG_NAMES = [
  "15.49.JPG",
  // "15.96.JPG",
  "16.14.JPG",
  "16.80.JPG",
  // "17.42.JPG",
  "17.92.JPG",
  "18.79.JPG",
  "18.98.JPG",
  "19.04.JPG",
  // "19.66.JPG",
  "20.07.JPG",
  "20.93.JPG",
  "21.22.JPG",
  "21.83.JPG",
  // "22.76.JPG",
  "23.23.JPG",
  "23.39.JPG",
  "23.74.JPG",
  "24.17.JPG",
  // "24.66.JPG",
  "25.00.JPG",
  "25.03.JPG",
  "25.17.JPG",
  "25.71.JPG",
  // "26.03.JPG",
  "26.05.JPG",
  "26.28.JPG",
  "27.00.JPG",
  "27.81.JPG",
  // "27.91.JPG",
  "28.13.JPG",
  "28.21.JPG",
  // "28.63.JPG",
  "29.28.JPG",
  "29.55.JPG",
  // "29.71.JPG",
  "30.16.JPG",
  "30.98.JPG",
  "31.50.JPG",
  // "5.23.jpg",
  // "6.28.jpg",
  // "7.31.jpg",
];

// export const EXAMPLE_JAR_IMG_NAMES = "18.96.JPG";

// // Constants for general instructions
// export const GENERAL_INSTRUCTIONS = [
//   [
//     "You will be working with another participant to guess the amount of money in a glass jar.",
//     "You will be randomly allocated to the role of ADVISOR or ESTIMATOR.",
//     "The ADVISOR will see a large resolution picture of each jar for up to 10 seconds. Their role is to advise the estimator on how much money they think is in the jar.",
//     "This is an example of what you would see if you were assigned the role of ADVISOR:",
//     `<center><img src='../../assets/images/jars/${EXAMPLE_JAR_IMG_NAMES}'style='max-width: 45%; height: auto' /></center>`,
//   ],
//   [
//     "The ESTIMATOR will see a smaller picture of each jar for a shorter period of time.",
//     "This is an example of what you would see if you were assigned the role of ESTIMATOR:",
//     "The estimator is responsible for submitting the estimation, after they have received the advisor’s estimate and viewed the jar.",
//     `<center><img src='../../assets/images/jars/${EXAMPLE_JAR_IMG_NAMES}'style='max-width: 5%; height: auto' /></center>`,
//   ],
//   [
//     "Based on the accuracy of your estimate, both of you may earn up to £X of extra money.",
//     "There are a few important details to remember:",
//     "<ul><li>The advisor will be given important information to help them assess how much money is in the jar.</li></ul>",
//     "<ul><li>The estimator can decide whether they choose to use the advisor’s estimate or not.</li></ul>",
//     "<ul><li>The advisor will not see what the estimator submits.</li></ul>",
//     "<ul><li>You will not receive any feedback about how accurate your estimates are.</li></ul>",
//   ],
//   [
//     "Payment",
//     "At the end of the task, <u>one</u> of the trials will be selected at <u>random</u> and a reward will be randomly generated.",
//     "You will both be paid a proportion of this reward according to how accurate the estimate submitted by the estimator was in <strong><u>this trial only</u></strong>.",
//   ],
//   [
//     "You have been assigned the role of ADVISOR! You will now be given 2 important bits of information: ",
//     "<ul><li>The range of money in the jar will always be between £15.00 and £35.00.</li></ul>",
//     "<ul><li>You and the estimator will not always be rewarded based on accuracy.</li></ul>",
//     "Only you know these details; the ESTIMATOR <strong>does not</strong>. We will now explain how the reward will vary…",
//   ],
//   [
//     "In some of the trials, you will be rewarded based on <strong>how much above the true value</strong> the estimate submitted by the estimator is. ",
//     "But, the estimator will still be rewarded based on how accurate their estimate is. ",
//     "For example, if the amount of money in the jar is £15 and the submitted estimate was £20, you will receive a <strong>higher reward</strong> because the estimator has <strong>overestimated</strong> the true value by £5.",
//     "However, the estimator would receive a lower reward because they were less accurate, within £5 of the true value.",
//     "Conversely, if the amount of money in the jar is £15 and the submitted estimate is £16, you would receive a <strong>lower reward</strong> because the estimator has guessed the amount of money in the jar more accurately.",
//     "However, the estimator would receive a higher reward because they were more accurate, within £1 of the true value. ",
//   ],
//   [
//     "For each trial we will indicate whether the trial is a “high” or “accurate” trial, to reflect the reward structure.",
//     "<ul><li><strong>High trial</strong>: You are rewarded based on how <strong>far above</strong> the true value the estimate is, whilst the estimator is rewarded based on how close to the true value the estimate is.</li></ul>",
//     "<ul><li><strong>Accurate trial</strong>: Both you and the estimator are rewarded based on how <strong>close to</strong> the true value the estimate is.</li></ul>",
//     "We will run a short quiz before each trial to ensure you understand the reward structure. ",
//   ],
// ];

// Constants for instructions of different condition
// export const BLOCK_INSTRUCTIONS = {
//   BASELINE: `Here is a reminder of the instructions:
// <ul><li>You have been assigned the role of ADVISOR.</li></ul>
// <ul><li>The range of money in the jar will always be between £15.00 and £35.00.</li></ul>
// <ul><li>In this block, both you and the estimator will be allocated based on how accurate the estimator's submitted estimate is.</li></ul>`,
//   IMAGERY: `Here is a reminder of the instructions:
// <ul><li>You have been assigned the role of ADVISOR.</li></ul>
// <ul><li>The range of money in the jar will always be between £15.00 and £35.00.</li></ul>
// <ul><li>(imagery instruction missing)</li></ul>
// <ul><li>In this block, you will be allocated a reward based on far above the true value the estimator's submitted estimate is. But the estimator will receive a reward based on how accurate to the true value the submitted estimate is.</li></ul>`,
//   BREAK: `Here is a reminder of the instructions:
// <ul><li>You have been assigned the role of ADVISOR.</li></ul>
// <ul><li>The range of money in the jar will always be between £15.00 and £35.00.</li></ul>
// <ul><li>(break instruction missing)</li></ul>
// <ul><li>In this block, you will be allocated a reward based on far above the true value the estimator's submitted estimate is. But the estimator will receive a reward based on how accurate to the true value the submitted estimate is.</li></ul>`,
// };

// // Constants for instructions that show up during switching trials types
// export const SWITCHING_INSTRUCTIONS = {
//   NORMAL:
//     "In the next trial, you will give real estimate BUT A HIGH TRIAL (NEED TO BE CHANGED).",
//   IMAGERY:
//     "In the next trial, you will imagine giving estimate to the ESTIMATOR IN A HIGH TRIAL (NEED TO BE CHANGED).",
//   BREAK:
//     "In the next trial, you will see countdown and press space bar when the number is the multiples of 5 (NEED TO BE CHANGED).",
// };

// // Constants for recap instructions
// export const RECAP_INSTRUCTION = {
//   BASELINE: [
//     "Here we will show you the recap of the accurate trial instruction.",
//   ],
//   IMAGERY: [
//     "Here we will show you the recap of the accurate high instruction.",
//   ],
//   BREAK: ["Here we will show you the recap of the accurate high instruction."],
// };

// // Constants for quizzes
export const QUIZ_QUESTION_1 = "What is the range of money in the jars?";
export const QUIZ_OPTIONS_1 = ["10-20", "10-50", "15-30"];

export const QUIZ_QUESTION_2 =
  "Based on the instructions you just read, in which of the below will you be rewarded more money?";
export const QUIZ_OPTIONS_2 = [
  "The jar’s value is £30.00 and the estimator submits an estimate of £35.00.",
  "The jar’s value is £30.00 and the estimator submits an estimate of £30.00.",
  "The jar’s value is £30.00 and the estimator submits an estimate of £32.00.",
];

export const QUIZ_QUESTION_3 =
  "Based on the instructions you just read, in which of the below will the estimator be rewarded more money?";
export const QUIZ_OPTIONS_3 = QUIZ_OPTIONS_2;

// export const PRACTICE_QUIZ = {
//   BASELINE: [
//     {
//       QUESTION: QUIZ_QUESTION_1,
//       OPTIONS: QUIZ_OPTIONS_1,
//       CORRECT_IDX: 2, // the first index is 0
//     },
//     {
//       QUESTION: QUIZ_QUESTION_2,
//       OPTIONS: QUIZ_OPTIONS_2,
//       CORRECT_IDX: 1,
//     },
//     {
//       QUESTION: QUIZ_QUESTION_3,
//       OPTIONS: QUIZ_OPTIONS_3,
//       CORRECT_IDX: 1,
//     },
//   ],
//   IMAGERY: [
//     {
//       QUESTION: QUIZ_QUESTION_1,
//       OPTIONS: QUIZ_OPTIONS_1,
//       CORRECT_IDX: 2,
//     },
//     {
//       QUESTION: QUIZ_QUESTION_2,
//       OPTIONS: QUIZ_OPTIONS_2,
//       CORRECT_IDX: 0,
//     },
//     {
//       QUESTION: QUIZ_QUESTION_3,
//       OPTIONS: QUIZ_OPTIONS_3,
//       CORRECT_IDX: 1,
//     },
//   ],
//   BREAK: [
//     {
//       QUESTION: QUIZ_QUESTION_1,
//       OPTIONS: QUIZ_OPTIONS_1,
//       CORRECT_IDX: 2,
//     },
//     {
//       QUESTION: QUIZ_QUESTION_2,
//       OPTIONS: QUIZ_OPTIONS_2,
//       CORRECT_IDX: 0,
//     },
//     {
//       QUESTION: QUIZ_QUESTION_3,
//       OPTIONS: QUIZ_OPTIONS_3,
//       CORRECT_IDX: 1,
//     },
//   ],
// };

// NEW recap instructions and quizzes
// since we only have one type compared to the previous one
// we dont need dictionary mapping different condition and the content
export const RECAP_INSTRUCTION =
  "Here we will show you the recap of the accurate trial instruction.";
export const PRACTICE_QUIZ = [
  {
    QUESTION: QUIZ_QUESTION_1,
    OPTIONS: QUIZ_OPTIONS_1,
    CORRECT_IDX: 2, // the first index is 0
  },
  {
    QUESTION: QUIZ_QUESTION_2,
    OPTIONS: QUIZ_OPTIONS_2,
    CORRECT_IDX: 1,
  },
  {
    QUESTION: QUIZ_QUESTION_3,
    OPTIONS: QUIZ_OPTIONS_3,
    CORRECT_IDX: 1,
  },
];
