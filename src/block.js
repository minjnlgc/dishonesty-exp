import { initJsPsych } from "jspsych";
import { CONDITIONS, JARS_IMG_NAMES, OFFSET } from "./constants";

const jsPsych = initJsPsych();
let block_number = 0;

export const initializeAdviceEstimation = () => {
  const advice_estimation_dictionary = {};
  for (const image_id of JARS_IMG_NAMES) {
    const base_num = parseFloat(image_id.slice(0, 5));
    const estimation = jsPsych.randomization.randomInt(
      base_num - OFFSET,
      base_num + OFFSET
    );
    advice_estimation_dictionary[image_id] = Math.round(estimation * 100) / 100;
  }

  return advice_estimation_dictionary;
};

export const createConditionArray = () => {
  return jsPsych.randomization.repeat(CONDITIONS, JARS_IMG_NAMES.length);
};

export const splitCondtionArray = (arr) => {
  const mid = Math.floor(arr.length / 2);
  const first_half = arr.slice(0, mid);
  const second_half = arr.slice(mid, arr.length);

  return {
    first_half,
    second_half,
  };
};

export const createBlock = (dishonesty_trial, timeline, condition_arr) => {
  console.log(condition_arr);
  
  condition_arr.forEach((condition) => {
    timeline.push({
      ...dishonesty_trial,
      condition: condition,
      block_number: block_number,
    });
  });
};
