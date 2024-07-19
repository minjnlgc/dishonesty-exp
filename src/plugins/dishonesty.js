import { ParameterType } from "jspsych";
import { FIXATION_CROSS_HTML, JARS_IMG_NAMES } from "../constants";

const info = {
  name: "dishonesty-plugin",
  parameters: {
    condition: {
      type: ParameterType.STRING,
      default: null,
    },
    trial_duration: {
      type: ParameterType.INT,
      default: 10000, // 10 sec
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
      default: 15,
    },
    max: {
      type: ParameterType.FLOAT,
      default: 35,
    },
    stimulus: {
      type: ParameterType.STRING,
      default: null,
    },
    n_block: {
      type: ParameterType.INT,
      default: null
    }
  },
};


const MAX_OCCURENCE = 2;
const MAX_ATTEMPTS = 100; // You can adjust this number as needed
let attempts = 0;
let jar_image_history = {}; // create a dictionary to store how many times each stimulus occur

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
      n_block: trial.n_block
    };

    let jar_image_id;
    do {
      jar_image_id =
        JARS_IMG_NAMES[
          this.jsPsych.randomization.randomInt(0, JARS_IMG_NAMES.length - 1)
        ];

        attempts += 1;
        if (attempts > MAX_ATTEMPTS) {
          console.log("Max attempts reached, exiting loop.");
          break;
        }

        // if the stimulus is in the dictionary and it appears twice then we dont want it.
    } while (jar_image_history.hasOwnProperty(jar_image_id) && jar_image_history[jar_image_id] === MAX_OCCURENCE);
    
    if (jar_image_history.hasOwnProperty(jar_image_id)) {
      jar_image_history[jar_image_id] += 1;
    } else {
      jar_image_history[jar_image_id] = 1;
    }
    
    trial_data.stimulus = jar_image_id;

    console.log(jar_image_history);

    let html_content = `
        <div>
            <img src='../../assets/images/jars/${jar_image_id}'style='max-width: ${trial.image_size_percentage}%; height: auto' />
        </div>
        <h2>Enter your advice: </h2>
        <div style='display: flex; justify-content: center; margin-right: 25px'>
          <label style='font-size: 35px; margin-top: 5px' >£</label> <input type='number' id='response' required
            style='padding: 7px 8px; width: 30%; margin-left: 15px; font-size: 20px; box-sizing: border-box;'
              min='${trial.min}'
            />
            <br />
          <button class="jspsych-btn" id='response-btn' type='submit'>Submit</button>
        </div>
        `; // TO-DO: style the input box & data collection

    display_element.innerHTML = html_content;
    console.log(jar_image_id);

    display_element
      .querySelector("#response-btn")
      .addEventListener("click", async () => {
        await this.handleOnClick(display_element, trial_data, startTime, trial);
      });

    await this.delay(trial.trial_duration);
    display_element.innerHTML = FIXATION_CROSS_HTML;

    await this.delay(2000);
    this.endTrial(trial_data);
  }

  async delay(ms) {
    return new Promise((resolve) =>
      this.jsPsych.pluginAPI.setTimeout(resolve, ms)
    );
  }

  async handleOnClick(display_element, trial_data, startTime, trial) {
    const rt = performance.now() - startTime;
    trial_data.rt = rt;

    const response = Number(display_element.querySelector("#response").value);
    console.log(response);

    if (response < trial.min || response > trial.max) {
      window.alert(
        `The number must be larger than ${trial.min} and smaller than ${trial.max}`
      );
    } else {
      display_element.querySelector("#response").value = null;
      trial_data.response = response;
      console.log(trial_data);

      display_element.innerHTML = FIXATION_CROSS_HTML;
      await this.delay(1000);
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
