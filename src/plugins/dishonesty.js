import { ParameterType } from "jspsych";
import {
  ADVICE_PROMPT,
  CONDITIONS,
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
      default: 30000, // 10 sec
    },
    image_size_percentage: {
      type: ParameterType.STRING,
      default: 40,
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
    envelope_colors: {
      type: ParameterType.OBJECT,
      default: null,
    },
    is_choose_by_user: {
      type: ParameterType.BOOL,
      default: true,
    },
  },
};

// dictionary of sets of images occur in each condition, making sure no repeat.
const jar_image_history = {
  BASELINE: new Set(),
  PRIVATE: new Set(),
  PUBLIC: new Set(),
};

// SVG for closed envelope
const envelop_closed_SVG_HTML = `
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="150"
          height="150"
          id='close'
        >
          <path
            d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
          />
        </svg>
`;

// SVG for open envelope
const envelop_open_SVG_HTML = `
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="150"
          height="150"
          id='open'
          class='highlight'
        >
         <path d="M215.4 96L144 96l-36.2 0L96 96l0 8.8L96 144l0 40.4 0 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3 48 96c0-26.5 21.5-48 48-48l76.6 0 49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48 416 48c26.5 0 48 21.5 48 48l0 44.3 22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4l0-89 0-40.4 0-39.2 0-8.8-11.8 0L368 96l-71.4 0-81.3 0zM0 448L0 242.1 217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1 512 448s0 0 0 0c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64c0 0 0 0 0 0zM176 160l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
        </svg>
`;

const jar_images_arr = JARS_IMG_NAMES;

class DishonestyPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  async trial(display_element, trial) {
    const startTime = performance.now();

    // data to collect
    const trial_data = {
      condition: trial.condition,
      response: trial.response,
      rt: trial.rt,
      jar_image: trial.jar_image,
      advice_estimation: null,
      block_number: trial.block_number,
      envelope_colors: trial.envelope_colors,
      is_choose_by_user: trial.is_choose_by_user,
      user_choice: null,
    };

    // console.log(jar_images_arr);
    console.log(trial.condition);

    // select images if no image provided
    if (trial.jar_image === null) {
      let jar_image_id;
      do {
        jar_image_id =
          jar_images_arr[
            this.jsPsych.randomization.randomInt(0, jar_images_arr.length - 1)
          ];
      } while (jar_image_history[trial.condition].has(jar_image_id));

      jar_image_history[trial.condition].add(jar_image_id);
      trial_data.jar_image = jar_image_id;
    }

    // get the advice according to condition
    trial_data.advice_estimation =
      trial.jar_image_estimation_dictionary[trial_data.jar_image];

    const img_html = `<div>
            <img src='../../assets/images/jars/${trial_data.jar_image}'style='max-width: ${trial.image_size_percentage}%; height: auto' />
        </div>`;

    // colors hex of all envelope decided by trial.envelope_colors
    const envelop_SVG_HTML = `
       <span id='envelop-private' class='envelop' style='color: ${trial.envelope_colors["PRIVATE"]}'>
        ${envelop_closed_SVG_HTML}
       </span>
       <span id='envelop-public' class='envelop' style='color: ${trial.envelope_colors["PUBLIC"]}'>
        ${envelop_closed_SVG_HTML}
       </span>
       <span id='envelop-baseline' class='envelop' style='color: ${trial.envelope_colors["BASELINE"]}'>
        ${envelop_closed_SVG_HTML}
       </span>
    `;

    // prompt for baseline condition
    const enter_advice_baseline_html = ` 
      <h1 id='count-down'></h1>  
      <h2>Enter your estimation: </h2>
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

    console.log("image_id:", trial_data.jar_image);

    // jar image
    display_element.innerHTML = img_html;
    await this.delay(trial.image_display_duration);

    // envelops
    display_element.innerHTML = envelop_SVG_HTML;

    if (trial.is_choose_by_user) {
      console.log("Entering condition setup");
      for (const condition of CONDITIONS) {
        console.log("Setting up condition:", condition);
        const envelope = display_element.querySelector(
          `#envelop-${condition.toLowerCase()}`
        );
        console.log("Found envelope:", envelope);

        if (envelope) {
          const svg = envelope.querySelector("svg");
          if (svg) {
            svg.addEventListener("click", () =>
              this.handleUserChoice(
                condition,
                display_element,
                trial_data,
                trial,
                enter_advice_html,
                startTime
              )
            );
          } else {
            console.error("SVG element not found for condition:", condition);
          }
        } else {
          console.error("Envelope not found for condition:", condition);
        }
      }
    } else {
      // If not user choose, as usual
      display_element.querySelectorAll(`.envelop > svg`).forEach((element) => {
        element.classList.add("disabled");
      });

      await this.delay(800);
      const usualEnvelope = display_element.querySelector(
        `#envelop-${trial.condition.toLowerCase()}`
      );
      if (usualEnvelope) {
        usualEnvelope.innerHTML = envelop_open_SVG_HTML;
      }
      await this.delay(800);

      // Add advice prompt
      display_element.innerHTML += `<h2 style='line-height: 1.5; margin-top: 20px;'>${ADVICE_PROMPT[
        trial.condition
      ]
        .replace("{num}", trial_data.advice_estimation)
        .replace("{HEX}", trial.envelope_colors[trial.condition])}</h2>`;
      await this.delay(trial.advice_display_duration);

      // Set to enter advice HTML
      display_element.innerHTML = enter_advice_html;
      this.setupEventListeners(display_element, trial_data, startTime, trial); // Reattach event listeners
    }
  }

  // Class Function to set up event listeners
  async setupEventListeners(display_element, trial_data, startTime, trial) {
    // Handle clicking response button
    display_element
      .querySelector("#response-btn")
      .addEventListener("click", async () => {
        await this.handleSubmit(display_element, trial_data, startTime, trial);
      });

    // Handle pressing Enter key in response input
    display_element
      .querySelector("#response")
      .addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
          await this.handleSubmit(
            display_element,
            trial_data,
            startTime,
            trial
          );
        }
      });
  }

  // Class Function to handle user choice
  async handleUserChoice(
    condition,
    display_element,
    trial_data,
    trial,
    enter_advice_html,
    startTime
  ) {
    console.log("User chose condition:", condition);

    // Disable all envelopes
    display_element.querySelectorAll(`.envelop > svg`).forEach((element) => {
      element.classList.add("disabled");
    });

    // Change the chosen envelope to the open envelope SVG
    const chosenEnvelope = display_element.querySelector(
      `#envelop-${condition.toLowerCase()}`
    );
    if (chosenEnvelope) {
      chosenEnvelope.innerHTML = envelop_open_SVG_HTML;
    }

    // Add advice
    display_element.innerHTML += `<h2 style='line-height: 1.5; margin-top: 20px;'>${ADVICE_PROMPT[
      condition
    ]
      .replace("{num}", trial_data.advice_estimation)
      .replace("{HEX}", trial.envelope_colors[condition])}</h2>`;

    await this.delay(trial.advice_display_duration);

    // Set to enter advice HTML
    display_element.innerHTML = enter_advice_html;
    this.setupEventListeners(display_element, trial_data, startTime, trial); // Reattach event listeners
  }

  // class function, delay, so that we can reuse it
  async delay(ms) {
    return new Promise((resolve) =>
      this.jsPsych.pluginAPI.setTimeout(resolve, ms)
    );
  }

  // class function, handle submit user response
  async handleSubmit(display_element, trial_data, startTime, trial) {
    // calculate the response time
    const rt = performance.now() - startTime;
    trial_data.rt = rt;

    // get the response
    const response = Number(display_element.querySelector("#response").value);
    console.log(response);

    // no response no proceed
    if (!response) {
      return;
    }

    // check if respone meet requirement, if so save it.
    if (
      trial.min &&
      trial.max &&
      (response < trial.min || response > trial.max)
    ) {
      window.alert(
        `The number must be larger than ${trial.min} and smaller than ${trial.max}`
      );
    } else {
      display_element.querySelector("#response").value = null; // clear the response in the input box
      trial_data.response = response; // save it to data
      this.jsPsych.pluginAPI.clearAllTimeouts(); // clean the timeout (delay)
      console.log(trial_data);
      display_element.innerHTML = FIXATION_CROSS_HTML; // showing fixation cross
      await this.delay(FIXATION_CROSS_DURATION);
      this.endTrial(trial_data); // end the trial
    }
  }

  // class function, end trial
  endTrial(trial_data) {
    this.jsPsych.pluginAPI.clearAllTimeouts();
    this.jsPsych.finishTrial(trial_data);
  }
}

DishonestyPlugin.info = info;
export default DishonestyPlugin;
