import { ParameterType } from "jspsych";
import { ADVISOR, ESTIMATOR } from "../constants";

const info = {
  name: "spinning-wheel-plugin",
  parameters: {
    condition: {
      type: ParameterType.STRING,
      default: null,
    },
    rt: {
      type: ParameterType.INT,
      default: null,
    },
    spin_wheel_result: {
      type: ParameterType.STRING,
      default: ADVISOR,
    },
    post_spin_duration: {
      type: ParameterType.STRING,
      default: 2000,
    },
    pre_spin_result_duration: {
      type: ParameterType.INT,
      default: 3000,
    },
  },
};

class SpinningWheelPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element, trial) {
    const startTime = performance.now();
    const trial_data = {
      rt: trial.rt,
      spin_wheel_result: trial.spin_wheel_result,
      post_spin_duration: trial.post_spin_duration,
      pre_spin_result_duration: trial.pre_spin_result_duration,
    };

    display_element.innerHTML = `
    <div>
        <h2 id='instruction-prompt'>Press the button below to choose your role, <br>
        the <span id='advisor-text'>blue</span> represents <span id='advisor-text'>${ADVISOR}</span>, 
        and <span id='estimator-text'>red</span> represents <span id='estimator-text'>${ESTIMATOR}</span>
        </h2>
        <h2 id='result-prompt'>Your role is ...</h2>
    </div>
    <div class="wheel-container">
        <br />
        <div class="pointer"></div>
        <div class="wheel">
        <div class="segment estimator">
        </div>
        <div class="segment advisor">
        </div>
    </div>
    <div class="spin-button">Spin</div>
    </div>
    `;

    display_element
      .querySelector(".spin-button")
      .addEventListener("click", (event) => {
        const button = event.target;
        // Add the disabled class to apply the custom CSS
        button.classList.add("disabled");
        // Disable the button to prevent further clicks
        button.disabled = true;
        
        this.spinWheel(display_element, trial_data, startTime, trial);
      });
  }

  async spinWheel(display_element, trial_data, startTime, trial) {
    trial_data.rt = performance.now() - startTime;

    const wheel = display_element.querySelector(".wheel");
    // Calculate the degrees to land on Advisor
    const degrees = 360 * 3 + 160; // 3 full rotations + 180 degrees for Advisor

    wheel.style.transition = "transform 3s ease-out";
    wheel.style.transform = `rotate(${degrees}deg)`;

    console.log();

    await this.delay(trial.pre_spin_result_duration);
    display_element.querySelector(
      "#result-prompt"
    ).innerHTML = `Your role is <span id='advisor-text'>${ADVISOR}</span>!`;

    await this.delay(trial.post_spin_duration);
    this.jsPsych.finishTrial(trial_data);
  }

  async delay(ms) {
    return new Promise((resolve) =>
      this.jsPsych.pluginAPI.setTimeout(resolve, ms)
    );
  }
}

SpinningWheelPlugin.info = info;
export default SpinningWheelPlugin;
