import { ParameterType } from "jspsych";
import {
  ACCURATE,
  BASELINE,
  BREAK,
  FIXATION_CROSS_DURATION,
  FIXATION_CROSS_HTML,
  IMAGERY,
  JARS_IMG_NAMES,
} from "../constants";

const info = {
  name: "dishonesty-plugin",
  parameters: {
    condition: {
      type: ParameterType.STRING,
      default: BASELINE,
    },
    is_baseline: {
      type: ParameterType.BOOL,
      default: true,
    },
    trial_duration: {
      type: ParameterType.INT,
      default: 10000, // 10 sec
    },
    image_display_duration: {
      type: ParameterType.INT,
      default: 3000, // 3 sec
    },
    response_duration: {
      type: ParameterType.INT,
      default: 6000, // 6 sec
    },
    image_size_percentage: {
      type: ParameterType.STRING,
      default: 45,
    },
    response: {
      type: ParameterType.INT,
      default: null,
    },
    rt: {
      type: ParameterType.FLOAT,
      default: null,
    },
    min: {
      type: ParameterType.INT,
      default: null,
    },
    max: {
      type: ParameterType.FLOAT,
      default: null,
    },
    stimulus: {
      type: ParameterType.STRING,
      default: null,
    },
    block_number: {
      type: ParameterType.INT,
      default: null,
    },
    block_type: {
      type: ParameterType.STRING,
      default: null,
    },
    dishonesty_stimulus_arr: {
      type: ParameterType.OBJECT,
      default: JARS_IMG_NAMES,
    },
    base_trials_stimulus_in_high_condition_arr: {
      type: ParameterType.OBJECT,
      default: null,
    },
    high_trials_stimulus_in_high_condition_arr: {
      type: ParameterType.OBJECT,
      default: null,
    },
    estimate_type: {
      type: ParameterType.STRING,
      default: ACCURATE,
    },
  },
};

const jar_image_history = new Set(); // create a dictionary to store how many times each stimulus occur

const high_condition_jar_image_history = new Set(); // max should be 15 - 3;
const high_condition_base_jar_image_history = new Set(); // max should be 3;

class DishonestyPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  async trial(display_element, trial) {
    const startTime = performance.now();

    let trial_data = {
      condition: trial.condition,
      trial_duration: trial.trial_duration,
      response: trial.response,
      rt: trial.rt,
      stimulus: trial.stimulus,
      block_number: trial.block_number,
      block_type: trial.block_type,
      //dishonesty_stimulus_arr: trial.dishonesty_stimulus_arr,
      base_trials_stimulus_in_high_condition_arr:
        trial.base_trials_stimulus_in_high_condition_arr,
      high_trials_stimulus_in_high_condition_arr:
        trial.high_trials_stimulus_in_high_condition_arr,
    };

    if (jar_image_history.size === 15) {
      jar_image_history.clear();
    }
    if (high_condition_jar_image_history.size === 12) {
      high_condition_jar_image_history.clear();
    }
    if (high_condition_base_jar_image_history.size === 3) {
      high_condition_jar_image_history.clear();
    }

    const jar_images_arr =
      this.switchStimuliSet(trial) || trial.dishonesty_stimulus_arr;
    const jar_images_history_set = this.switchHistorySet(trial);

    console.log(jar_images_arr);
    console.log(trial.condition);

    let jar_image_id;
    do {
      jar_image_id =
        jar_images_arr[
          this.jsPsych.randomization.randomInt(0, jar_images_arr.length - 1)
        ];
    } while (jar_images_history_set.has(jar_image_id));

    jar_images_history_set.add(jar_image_id);
    trial_data.stimulus = jar_image_id;

    console.log(
      `${trial.condition} history, is baseline ${trial.is_baseline}:`,
      jar_images_history_set
    );

    const img_html = `<div>
            <img src='../../assets/images/jars/${jar_image_id}'style='max-width: ${trial.image_size_percentage}%; height: auto' />
        </div>`;

    // prompt for baseline condition
    const enter_advice_baseline_html = ` 
      <h1 id='count-down'></h1>  
      <h2>Enter your advice: </h2>
        <div style='display: flex; justify-content: center; margin-right: 25px'>
          <label style='font-size: 35px; margin-top: 5px' >£</label> <input type='number' id='response' required
            style='padding: 7px 8px; width: 70%; margin-left: 15px; font-size: 20px; box-sizing: border-box;'
              min='${trial.min}'
            />
        </div>
        <br />
        <button class="jspsych-btn" id='response-btn' type='submit'>Submit</button>
        <p style='font-size=12px'><i>Press submit or Enter key</i></p>
        `;

    // prompt for mental imagery condition
    const enter_advice_mental_imagery_HTML = `<h1 id='count-down'></h1><h2>Please imaging that your are ... (NEED TO BE CHANGED) </h2>`;

    const enter_advice_html =
      trial.condition === IMAGERY && !trial.is_baseline
        ? enter_advice_mental_imagery_HTML
        : enter_advice_baseline_html;

    console.log(jar_image_id);

    display_element.innerHTML = img_html;
    await this.delay(trial.image_display_duration);

    display_element.innerHTML = enter_advice_html;

    if (
      trial.is_baseline ||
      (!trial.is_baseline && trial.condition === BREAK)
    ) {
      display_element
        .querySelector("#response-btn")
        .addEventListener("click", async () => {
          this.handleSubmit(display_element, trial_data, startTime, trial);
        });

      display_element
        .querySelector("#response")
        .addEventListener("keypress", async (e) => {
          if (e.key === "Enter") {
            this.handleSubmit(display_element, trial_data, startTime, trial);
          }
        });
    }

    // show the countdown in baseline conditon when entering advice
    let seconds = trial.response_duration / 1000;
      while (seconds > 0) {
        display_element.querySelector("#count-down").innerText = seconds;
        await this.delay(1000);
        seconds -= 1;
    }

    if (trial.condition === IMAGERY) {
      display_element.innerHTML = FIXATION_CROSS_HTML;
      await this.delay(FIXATION_CROSS_DURATION);
    }

    this.endTrial(trial_data);
  }

  async delay(ms) {
    return new Promise((resolve) =>
      this.jsPsych.pluginAPI.setTimeout(resolve, ms)
    );
  }

  async handleSubmit(display_element, trial_data, startTime, trial) {
    const rt = performance.now() - startTime;
    trial_data.rt = rt;

    const response = Number(display_element.querySelector("#response").value);
    console.log(response);

    if (
      trial.min &&
      trial.max &&
      (response < trial.min || response > trial.max)
    ) {
      window.alert(
        `The number must be larger than ${trial.min} and smaller than ${trial.max}`
      );
    } else {
      display_element.querySelector("#response").value = null;
      trial_data.response = response;
      console.log(trial_data);
      this.endTrial(trial_data);
    }
  }

  endTrial(trial_data) {
    this.jsPsych.pluginAPI.clearAllTimeouts();
    this.jsPsych.finishTrial(trial_data);
  }

  switchStimuliSet(trial) {
    if (trial.condition === BASELINE && trial.is_baseline) {
      return trial.dishonesty_stimulus_arr;
    } else if (
      (trial.condition === BREAK || trial.condition === IMAGERY) &&
      trial.is_baseline
    ) {
      return trial.base_trials_stimulus_in_high_condition_arr;
    } else if (
      (trial.condition === BREAK || trial.condition === IMAGERY) &&
      !trial.is_baseline
    ) {
      return trial.high_trials_stimulus_in_high_condition_arr;
    } else {
      throw new Error(
        `Invalid combination of condition: '${trial.condition}' and is_baseline: '${trial.is_baseline}'.`
      );
    }
  }

  switchHistorySet(trial) {
    if (trial.condition === BASELINE && trial.is_baseline) {
      return jar_image_history;
    } else if (
      (trial.condition === BREAK || trial.condition === IMAGERY) &&
      trial.is_baseline
    ) {
      return high_condition_base_jar_image_history;
    } else if (
      (trial.condition === BREAK || trial.condition === IMAGERY) &&
      !trial.is_baseline
    ) {
      return high_condition_jar_image_history;
    } else {
      throw new Error(
        `Invalid combination of condition: '${trial.condition}' and is_baseline: '${trial.is_baseline}'.`
      );
    }
  }
}

DishonestyPlugin.info = info;
export default DishonestyPlugin;
