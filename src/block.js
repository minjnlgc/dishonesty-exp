import { initJsPsych } from "jspsych";
import { CONDITIONS, JARS_IMG_NAMES, OFFSET } from "./constants";

// Initialize jsPsych instance to handle the experimental timeline and data
const jsPsych = initJsPsych();

// Global variable to keep track of the block number for the experiment
let block_number = 0;

/**
 * Function to initialize the advice estimation dictionary.
 * Each jar image is assigned a random estimation value based on its base number.
 * @param {string[]} jar_image_arr - Array of jar image names (optional, default is JARS_IMG_NAMES).
 * @returns {Object} advice_estimation_dictionary - Object mapping image names to estimation values.
 */
export const initializeAdviceEstimation = (jar_image_arr = JARS_IMG_NAMES) => {
  const advice_estimation_dictionary = {};

  // Loop through each jar image
  for (const image_id of jar_image_arr) {
    // Extract a base number from the image ID
    const base_num = parseFloat(image_id.slice(0, 5));

    // Generate a random estimation within the range [base_num - OFFSET, base_num + OFFSET]
    const estimation = jsPsych.randomization.randomInt(
      base_num - OFFSET,
      base_num + OFFSET
    );

    // Store the rounded estimation (2 decimal places) in the dictionary
    advice_estimation_dictionary[image_id] = Math.round(estimation * 100) / 100;
  }

  return advice_estimation_dictionary;
};

/**
 * Function to create an array of experimental conditions.
 * @returns {Array} condition_array - Array where each condition is repeated based on the number of jar images.
 */
export const createConditionArray = () => {
  // Repeat the CONDITIONS array to match the length of jar images
  return jsPsych.randomization.repeat(CONDITIONS, JARS_IMG_NAMES.length);
};

/**
 * Function to split the condition array into two halves.
 * @param {Array} arr - The array of conditions to be split.
 * @returns {Object} - An object containing two halves of the array (first_half and second_half).
 */
export const splitCondtionArray = (arr) => {
  const mid = Math.floor(arr.length / 2); // Find the middle index
  const first_half = arr.slice(0, mid); // Slice the first half
  const second_half = arr.slice(mid, arr.length); // Slice the second half

  return {
    first_half,
    second_half,
  };
};

/**
 * Function to create a block of trials for the main experiment.
 * Each condition from condition_arr is added to the timeline with corresponding trial details.
 * @param {Object} dishonesty_trial - The base trial object to be used.
 * @param {Array} timeline - The timeline array to which trials will be pushed.
 * @param {Array} condition_arr - Array of conditions for this block.
 * @param {boolean} [is_choose_by_user=false] - Flag indicating if the user is choosing the condition.
 */
export const createBlock = (
  dishonesty_trial,
  timeline,
  condition_arr,
  is_choose_by_user = false
) => {
  console.log(condition_arr); // Log the condition array for debugging

  // Iterate through each condition and add to the timeline
  condition_arr.forEach((condition) => {
    timeline.push({
      ...dishonesty_trial, // Spread the dishonesty_trial object
      condition: condition, // Assign the current condition
      block_number: block_number, // Track the block number
      is_choose_by_user: is_choose_by_user, // Indicate if condition is user-chosen
    });
  });
};

/**
 * Function to create a practice block of trials.
 * The conditions and practice jar images are shuffled, and corresponding trials are created.
 * @param {Object} dishonesty_trial - The base trial object to be used.
 * @param {Array} timeline - The timeline array to which trials will be pushed.
 * @param {Array} condition_arr - Array of conditions for this block.
 * @param {Array} practice_jar_img_arr - Array of practice jar images.
 */
export const createPracticeBlock = (
  dishonesty_trial,
  timeline,
  condition_arr,

  practice_jar_img_arr
) => {
  // Shuffle both the condition array and the practice jar images array
  const shuffled_condition_arr = jsPsych.randomization.shuffle(condition_arr);
  const shuffled_practice_jar_img_arr =
    jsPsych.randomization.shuffle(practice_jar_img_arr);

  // Log the shuffled arrays for debugging
  console.log(shuffled_condition_arr);
  console.log(shuffled_practice_jar_img_arr);

  // Iterate through the shuffled conditions and images, and push the corresponding trials into the timeline
  shuffled_condition_arr.forEach((c, i) => {
    timeline.push({
      ...dishonesty_trial, // Spread the dishonesty_trial object
      condition: c, // Assign the shuffled condition
      jar_image: shuffled_practice_jar_img_arr[i], // Assign the corresponding shuffled jar image
    });
  });
};
