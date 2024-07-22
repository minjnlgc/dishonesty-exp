import { initJsPsych } from "jspsych";
import { BASELINE, BREAK, IMAGERY } from "./constants";

const jsPsych = initJsPsych();
let n_block = 0;

/**
 * Creates a sequence of trials for a "break" condition block in the experimental timeline.
 * The sequence includes trials for dishonesty, text display, and serial number, based on the given parameters.
 *
 * @param {Object} dishonesty_trial - The configuration for dishonesty trials. This object is used to create dishonesty trials in the sequence.
 * @param {Object} text_display_trial - The configuration for text display trials. This object is used to add text display trials in the sequence.
 * @param {Object} serial_num_trial - The configuration for serial number trials. This object is used to add serial number trials in the sequence.
 * @param {string} block_trial_type - The type of block trial to be used in dishonesty trials. This is assigned to the `block_type` field in the dishonesty trials.
 * @param {Array} timeline - The array that will be populated with the sequence of trials. This is the experimental timeline where the generated trials will be added.
 * @param {number} [n=5] - The number of trials to generate. Must be greater than or equal to 3. Defaults to 5 if not provided.
 *
 * @throws {Error} Throws an error if `n` is less than 3.
 */
export const createBreakConditionBlockSuit = (
  dishonesty_trial,
  text_display_trial,
  serial_num_trial,
  block_trial_type,
  timeline,
  n = 5
) => {
  if (n < 3) {
    throw new Error("n should be larger than 3");
  }

  const middle_idx = Math.floor(n / 2);

  const base_dishonesty_trial = {
    ...dishonesty_trial,
    block_type: block_trial_type,
    block_number: n_block,
  };

  const new_dishonesty_trial = {
    ...base_dishonesty_trial,
    condition: BREAK,
  };

  const new_serial_num_trial = {
    ...serial_num_trial,
    block_number: n_block,
  };

  for (let i = 0; i < n; i++) {
    if (i === 0 || i === n - 1 || i === middle_idx) {
      timeline.push(new_dishonesty_trial);
      timeline.push(text_display_trial);
    } else {
      timeline.push(new_serial_num_trial);
    }
  }
};

/**
 * Creates a sequence of trials for a "mental imagery" condition block in the experimental timeline.
 * The sequence includes trials for mental imagery and text display, based on the given parameters.
 * 
 * The trials are arranged such that the first, middle, and last positions in the sequence contain the base dishonesty trial followed by a text display trial,
 * while all other positions contain the modified dishonesty trial with the "IMAGERY" condition.
 *
 * @param {Object} dishonesty_trial - The configuration for dishonesty trials. This object is used to create base dishonesty trials and is modified for the imagery condition.
 * @param {Object} text_display_trial - The configuration for text display trials. This object is added in between dishonesty trials.
 * @param {string} block_trial_type - The type of block trial to be used in dishonesty trials. This is assigned to the `block_type` field in the dishonesty trials.
 * @param {Array} timeline - The array that will be populated with the sequence of trials. This is the experimental timeline where the generated trials will be added.
 * @param {number} [n=5] - The number of trials to generate. Must be greater than or equal to 3. Defaults to 5 if not provided.
 *
 * @throws {Error} Throws an error if `n` is less than 3.
 */
export const createMentalImageryConditionBlockSuit = (
  dishonesty_trial,
  text_display_trial,
  block_trial_type,
  timeline,
  n = 5
) => {
  if (n < 3) {
    throw new Error("n should be larger than 3");
  }

  const middle_idx = Math.floor(n / 2);

  const base_dishonesty_trial = {
    ...dishonesty_trial,
    block_type: block_trial_type,
    block_number: n_block,
  };

  const new_dishonesty_trial = {
    ...base_dishonesty_trial,
    condition: IMAGERY,
    is_baseline: false,
  };

  for (let i = 0; i < n; i++) {
    if (i === 0 || i === n - 1 || i === middle_idx) {
      timeline.push(base_dishonesty_trial);
      timeline.push(text_display_trial);
    } else {
      timeline.push(new_dishonesty_trial);
    }
  }
};

/**
 * Creates a sequence of trials for a "baseline" condition block in the experimental timeline.
 * The sequence includes repeated trials for the base dishonesty condition followed by a text display trial.
 *
 * @param {Object} dishonesty_trial - The configuration for dishonesty trials. This object is used to create baseline dishonesty trials.
 * @param {Object} text_display_trial - The configuration for text display trials. This object is added after each dishonesty trial.
 * @param {string} block_trial_type - The type of block trial to be used in dishonesty trials. This is assigned to the `block_type` field in the dishonesty trials.
 * @param {Array} timeline - The array that will be populated with the sequence of trials. This is the experimental timeline where the generated trials will be added.
 * @param {number} [n=5] - The number of trial pairs (dishonesty and text display) to generate. Defaults to 5 if not provided.
 */
export const createBaseLineConditionBlockSuit = (
  dishonesty_trial,
  text_display_trial,
  block_trial_type,
  timeline,
  n = 5
) => {
  const base_dishonesty_trial = {
    ...dishonesty_trial,
    block_type: block_trial_type,
    block_number: n_block,
  };

  for (let i = 0; i < n; i++) {
    timeline.push(base_dishonesty_trial);
    timeline.push(text_display_trial);
  }
};

export const createMultipleBlock = (
  instruction_trial,
  block_instructions,
  dishonesty_trial,
  text_display_trial,
  serial_num_trial,
  condition_arr,
  timeline
) => {
  const shuffled_condition_arr = jsPsych.randomization.shuffle(condition_arr);
  console.log(shuffled_condition_arr);
  shuffled_condition_arr.forEach((condition) => {
    timeline.push({
      ...instruction_trial,
      stimulus: `<h2>${block_instructions[condition]}</h2>
         <p style='font-size=12px'><i>Press any key to continue</i></p>
      `,
    });

    switch (condition) {
      case BASELINE:
        createBaseLineConditionBlockSuit(
          dishonesty_trial,
          text_display_trial,
          condition,
          timeline
        );
        break;
      case IMAGERY:
        createMentalImageryConditionBlockSuit(
          dishonesty_trial,
          text_display_trial,
          condition,
          timeline
        );
        break;
      case BREAK:
        createBreakConditionBlockSuit(
          dishonesty_trial,
          text_display_trial,
          serial_num_trial,
          condition,
          timeline
        );
        break;
    }

    n_block += 1;
  });
};
