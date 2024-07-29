import { initJsPsych } from "jspsych";
import {
  ACCURATE,
  BASELINE,
  BREAK,
  CONTINUE_PROMT_HTML,
  HIGH,
  IMAGERY,
  JARS_IMG_NAMES,
  RECAP_INSTRUCTION,
  SWITCHING_INSTRUCTIONS,
} from "./constants";

const jsPsych = initJsPsych();
let n_block = 0;

// Draw 15 different stimulus for each participants, and this consistant through out all condition
const dishonesty_stimulus_arr = jsPsych.randomization.sampleWithoutReplacement(
  JARS_IMG_NAMES,
  15
);

// Draw 3 out of the 15 different stimulus for each participants to use in the normal trials of the BREAK & IMAGERY condition.
const base_trials_stimulus_in_high_condition_arr =
  jsPsych.randomization.sampleWithoutReplacement(dishonesty_stimulus_arr, 3);
// Draw the remaining stimuli for high condition trials
const high_trials_stimulus_in_high_condition_arr =
  dishonesty_stimulus_arr.filter(
    (img) => !base_trials_stimulus_in_high_condition_arr.includes(img)
  );

/**
 * Creates a sequence of trials for a "BREAK" condition block in the experimental timeline.
 * The sequence includes trials for dishonesty, text display, and serial number, based on the given parameters.
 *
 * @param {Object} dishonesty_trial - The dishonesty trial object.
 * @param {Object} text_display_trial - The trial object that display 'ESTIMATOR submitting estimate...'
 * @param {Object} countdown_trial - The countdown trial object.
 * @param {Object} instruction_trial - The instruction trial object.
 * @param {string} block_trial_type - The type of block trial to be used in dishonesty trials. This is assigned to the `block_type` field in the dishonesty trials.
 * @param {Array} timeline - The array that will be populated with the sequence of trials. This is the experimental timeline where the generated trials will be added.
 * @param {number} [n=5] - The number of trials to generate. Must be greater than or equal to 3. Defaults to 5 if not provided.
 *
 * @throws {Error} Throws an error if `n` is less than 3.
 */
export const createBreakConditionBlockSuit = (
  dishonesty_trial,
  text_display_trial,
  countdown_trial,
  instruction_trial,
  block_trial_type,
  timeline,
  n = 5 // should always be 5, and the serial num trial count down would be start from 105
) => {
  if (n < 3) {
    throw new Error("n should be larger than 3");
  }

  const middle_idx = Math.floor(n / 2);

  // used for the three estimate trials
  const new_dishonesty_trial = {
    ...dishonesty_trial,
    block_type: block_trial_type,
    block_number: n_block,
    condition: BREAK,
    base_trials_stimulus_in_high_condition_arr:
      base_trials_stimulus_in_high_condition_arr,
    high_trials_stimulus_in_high_condition_arr:
      high_trials_stimulus_in_high_condition_arr,
    is_baseline: false,
    estimate_type: HIGH,
  };

  // the countdown trials
  const new_countdown_trial = {
    ...countdown_trial,
    block_number: n_block,
    //countdown_seconds: 10, // for testing faster.
  };

  const baseline_instruction_trial = {
    ...instruction_trial,
    stimulus: `<p style='font-size: 20px'>${SWITCHING_INSTRUCTIONS['NORMAL']}</p>${CONTINUE_PROMT_HTML}`,
  };

  const break_instruction_trial = {
    ...instruction_trial,
    stimulus: `<p style='font-size: 20px'>${SWITCHING_INSTRUCTIONS[BREAK]}</p>${CONTINUE_PROMT_HTML}`,
  };

  for (let i = 0; i < n; i++) {
    if (i === 0 || i === n - 1 || i === middle_idx) {
      // only has the instruction for normal estimate trial
      // when it is not the first one.
      if (i !== 0) {
        timeline.push(baseline_instruction_trial);
      }

      timeline.push(new_dishonesty_trial);
      timeline.push(text_display_trial);

      // when it is not the last baseline trial,
      // introduce break trial after the baseline trial
      if (i !== n - 1) {
        timeline.push(break_instruction_trial);
      }
    } else {
      timeline.push(new_countdown_trial);
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
 * @param {Object} dishonesty_trial - The dishonesty trial object.
 * @param {Object} text_display_trial - The trial object that display 'ESTIMATOR submitting estimate...'
 * @param {Object} instruction_trial - The instruction trial object.
 * @param {string} block_trial_type - The type of block trial to be used in dishonesty trials. This is assigned to the `block_type` field in the dishonesty trials.
 * @param {Array} timeline - The array that will be populated with the sequence of trials. This is the experimental timeline where the generated trials will be added.
 * @param {number} [n=15] - The number of trials to generate. Must be greater than or equal to 3. Defaults to 15 if not provided.
 *
 * @throws {Error} Throws an error if `n` is less than 3.
 */
export const createMentalImageryConditionBlockSuit = (
  dishonesty_trial,
  text_display_trial,
  instruction_trial,
  block_trial_type,
  timeline,
  n = 5 // should change to 15 later
) => {
  if (n < 3) {
    throw new Error("n should be larger than 3");
  }

  const middle_idx = Math.floor(n / 2);

  const base_dishonesty_trial = {
    ...dishonesty_trial,
    block_type: block_trial_type,
    block_number: n_block,
    condition: IMAGERY,
    base_trials_stimulus_in_high_condition_arr:
      base_trials_stimulus_in_high_condition_arr,
    high_trials_stimulus_in_high_condition_arr:
      high_trials_stimulus_in_high_condition_arr,
    estimate_type: HIGH,
  };

  const new_dishonesty_trial = {
    ...base_dishonesty_trial,
    is_baseline: false,
  };

  const baseline_instruction_trial = {
    ...instruction_trial,
    stimulus: `<p style='font-size: 20px'>${SWITCHING_INSTRUCTIONS['NORMAL']}</p>${CONTINUE_PROMT_HTML}`,
  };

  const imagery_instruction_trial = {
    ...instruction_trial,
    stimulus: `<p style='font-size: 20px'>${SWITCHING_INSTRUCTIONS[IMAGERY]}</p>${CONTINUE_PROMT_HTML}`,
  };

  for (let i = 0; i < n; i++) {
    if (i === 0 || i === n - 1 || i === middle_idx) {
      // only has the instruction for normal estimate trial
      // when it is not the first one.
      if (i !== 0) {
        timeline.push(baseline_instruction_trial);
      }

      timeline.push(base_dishonesty_trial);
      timeline.push(text_display_trial);

      // when it is not the last baseline trial,
      // introduce imagery trial after the baseline trial
      if (i !== n - 1) {
        timeline.push(imagery_instruction_trial);
      }
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
 * @param {Object} text_display_trial - - The trial object that display 'ESTIMATOR submitting estimate...'
 * @param {string} block_trial_type - The type of block trial to be used in dishonesty trials. This is assigned to the `block_type` field in the dishonesty trials.
 * @param {Array} timeline - The array that will be populated with the sequence of trials. This is the experimental timeline where the generated trials will be added.
 * @param {number} [n=15] - The number of trial pairs (dishonesty and text display) to generate. Defaults to 15 if not provided.
 */
export const createBaseLineConditionBlockSuit = (
  dishonesty_trial,
  text_display_trial,
  block_trial_type,
  timeline,
  n = 5 // should change to 15 later
) => {
  const base_dishonesty_trial = {
    ...dishonesty_trial,
    block_type: block_trial_type,
    block_number: n_block,
    dishonesty_stimulus_arr: dishonesty_stimulus_arr,
    estimate_type: ACCURATE,
  };

  for (let i = 0; i < n; i++) {
    timeline.push(base_dishonesty_trial);
    timeline.push(text_display_trial);
  }
};

/**
 * A function that created blocks of all conditions. The sequence of the condition would be randomised.
 *
 * @param {Object} instruction_trial - The instruction trial object.
 * @param {Object} block_instructions - The block instructions dictionary.
 * @param {Object} quiz_trial - The quiz trial object.
 * @param {Object} dishonesty_trial - The dishonesty trial object.
 * @param {Object} text_display_trial - The trial object that display 'ESTIMATOR submitting estimate...'
 * @param {Object} countdown_trial - The countdown trial object.
 * @param {Array<string>} condition_arr - An array of all the conditions.
 * @param {Object} quiz_arr - A dictionary that contains the quiz (question, option, and correct index) for each condition.
 * @param {Array<Object>} timeline - The array to push the trial object on.
 */
export const createMultipleBlock = (
  instruction_trial,
  block_instructions,
  quiz_trial,
  dishonesty_trial,
  text_display_trial,
  countdown_trial,
  condition_arr,
  quiz_dict,
  timeline
) => {
  const shuffled_condition_arr = jsPsych.randomization.shuffle(condition_arr);
  console.log(shuffled_condition_arr);
  shuffled_condition_arr.forEach((condition) => {
    timeline.push({
      ...instruction_trial,
      stimulus: `<h3 style='text-align: left; margin: 40px'>${block_instructions[condition]}</h3>
         <p style='font-size=12px'><i>Press any key to continue</i></p>
      `,
    });

    console.log(quiz_dict[condition]);

    const new_quiz_tiral = {
      ...quiz_trial,
      question_list: quiz_dict[condition],
      recap_instruction_content: RECAP_INSTRUCTION[condition]
    };

    timeline.push(new_quiz_tiral);

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
          instruction_trial,
          condition,
          timeline
        );
        break;
      case BREAK:
        createBreakConditionBlockSuit(
          dishonesty_trial,
          text_display_trial,
          countdown_trial,
          instruction_trial,
          condition,
          timeline
        );
        break;
    }

    n_block += 1;
  });
};
