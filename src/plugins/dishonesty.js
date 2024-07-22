import { ParameterType } from "jspsych";
import { BASELINE, FIXATION_CROSS_DURATION, FIXATION_CROSS_HTML, IMAGERY, JARS_IMG_NAMES } from "../constants";

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
      default: 5000, // 5 sec
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
      default: null
    }
  },
};

const jar_image_history = new Set(); // create a dictionary to store how many times each stimulus occur

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
      block_type: trial.block_type
    };

    if (jar_image_history.size === 30) {
      jar_image_history.clear();
    }
    let jar_image_id;
    do {
      jar_image_id =
        JARS_IMG_NAMES[
          this.jsPsych.randomization.randomInt(0, JARS_IMG_NAMES.length - 1)
        ];
    } while (jar_image_history.has(jar_image_history));

    jar_image_history.add(jar_image_id);
    trial_data.stimulus = jar_image_id;

    console.log(jar_image_history);

    const img_html = `<div>
            <img src='../../assets/images/jars/${jar_image_id}'style='max-width: ${trial.image_size_percentage}%; height: auto' />
        </div>`;

    // prompt for baseline condition
    const enter_advice_baseline_html = ` <h2>Enter your advice: </h2>
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
    const enter_advice_mental_imagery_HTML = ` <h2>Please imaging that your are ... (need to change) </h2>`;

    const enter_advice_html =
      (trial.condition === IMAGERY) && !trial.is_baseline
        ? enter_advice_mental_imagery_HTML
        : enter_advice_baseline_html;

    console.log(jar_image_id);

    display_element.innerHTML = img_html;
    await this.delay(trial.image_display_duration);

    display_element.innerHTML = enter_advice_html;

    if (trial.is_baseline) {
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

    await this.delay(trial.response_duration);

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
