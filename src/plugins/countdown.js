import { ParameterType } from "jspsych";
import { BREAK, FIXATION_CROSS_DURATION, FIXATION_CROSS_HTML } from "../constants";

const info = {
  name: "countdown-plugin",
  parameters: {
    condition: {
      type: ParameterType.STRING,
      default: BREAK,
    },
    trial_duration: {
      type: ParameterType.INT,
      default: 10000, // 10 sec
    },
    block_number: {
      type: ParameterType.INT,
      default: null,
    },
    countdown_seconds: {
      type: ParameterType.INT,
      default: 80
    }
  },
};

class CountDownPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  async trial(display_element, trial) {
    const rt_arr = [];
    const startTime = performance.now();

    const trial_data = {
      condition: trial.condition,
      block_number: trial.block_number,
      rt: null,
      countdown_seconds: trial.countdown_seconds
    };

    let seconds = trial.countdown_seconds;

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        const rt = performance.now() - startTime;
        rt_arr.push({ rt: rt, seconds: seconds });
      }
    });
    
    while (seconds >= 0) {
      display_element.innerHTML = `<h1 style='font-size: 55px'>${seconds}</h1>
        <p style='font-size=12px'><i>Press the space bar when it can be divided by 5</i></p>
        `;
      await this.delay(1000);

      seconds -= 1;
    }

    display_element.innerHTML = FIXATION_CROSS_HTML;
    await this.delay(FIXATION_CROSS_DURATION);

    trial_data.rt = rt_arr;
    this.endTrial(trial_data);
  }

  async delay(ms) {
    return new Promise((resolve) =>
      this.jsPsych.pluginAPI.setTimeout(resolve, ms)
    );
  }

  endTrial(trial_data) {
    this.jsPsych.pluginAPI.clearAllTimeouts();
    this.jsPsych.finishTrial(trial_data);
  }
}

CountDownPlugin.info = info;
export default CountDownPlugin;
