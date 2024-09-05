import { ParameterType } from "jspsych";
import {
  ADVICE_PROMPT,
  FIXATION_CROSS_DURATION,
  FIXATION_CROSS_HTML,
  JARS_IMG_NAMES,
  PRIVATE,
} from "../constants";

const info = {
  name: "dishonesty-plugin",
  parameters: {
    condition: {
      type: ParameterType.STRING,
      default: PRIVATE, // advice type
    },
    image_display_duration: {
      type: ParameterType.INT,
      default: 3000, // 3 sec
    },
    advice_display_duration: {
      type: ParameterType.INT,
      default: 5000, // 5 sec
    },
    response_duration: {
      type: ParameterType.INT,
      default: 10000, // 10 sec
    },
    image_size_percentage: {
      type: ParameterType.STRING,
      default: 10,
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
      default: null, // the min for user estimation
    },
    max: {
      type: ParameterType.FLOAT,
      default: null, // the max for user estimation
    },
    jar_image: {
      type: ParameterType.STRING,
      default: null,
    },
    block_number: {
      type: ParameterType.INT,
      default: null,
    },
    jar_image_estimation_dictionary: {
      type: ParameterType.OBJECT,
      default: null,
    },
  },
};

const jar_image_history = {
  BASELINE: new Set(),
  PRIVATE: new Set(),
  PUBLIC: new Set(),
};

const jar_images_arr = JARS_IMG_NAMES;

class DishonestyPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  async trial(display_element, trial) {
    const startTime = performance.now();

    const trial_data = {
      condition: trial.condition,
      response: trial.response,
      rt: trial.rt,
      jar_image: trial.stimulus,
      advice_estimation: null,
      block_number: trial.block_number,
    };

    // console.log(jar_images_arr);
    console.log(trial.condition);

    let jar_image_id;
    do {
      jar_image_id =
        jar_images_arr[
          this.jsPsych.randomization.randomInt(0, jar_images_arr.length - 1)
        ];
    } while (jar_image_history[trial.condition].has(jar_image_id));

    jar_image_history[trial.condition].add(jar_image_id);
    trial_data.jar_image = jar_image_id;
    trial_data.advice_estimation =
      trial.jar_image_estimation_dictionary[jar_image_id];

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

    const enter_advice_html = enter_advice_baseline_html;

    console.log("image_id:", jar_image_id);

    display_element.innerHTML = img_html;
    await this.delay(trial.image_display_duration);

    display_element.innerHTML = `<h2>${ADVICE_PROMPT[trial.condition].replace(
      "{num}",
      trial_data.advice_estimation
    )}</h2>`;
    await this.delay(trial.advice_display_duration);

    display_element.innerHTML = enter_advice_html;

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

    // show the countdown in baseline conditon when entering advice
    let seconds = trial.response_duration / 1000;
    while (seconds > 0) {
      display_element.querySelector("#count-down").innerText = seconds;
      await this.delay(1000);
      seconds -= 1;
    }

    display_element.innerHTML = FIXATION_CROSS_HTML;
    await this.delay(FIXATION_CROSS_DURATION);
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
      this.jsPsych.pluginAPI.clearAllTimeouts();
      console.log(trial_data);
      display_element.innerHTML = FIXATION_CROSS_HTML;
      await this.delay(FIXATION_CROSS_DURATION);
      this.endTrial(trial_data);
    }
  }

  endTrial(trial_data) {
    this.jsPsych.pluginAPI.clearAllTimeouts();
    this.jsPsych.finishTrial(trial_data);
  }
}

DishonestyPlugin.info = info;
export default DishonestyPlugin;
