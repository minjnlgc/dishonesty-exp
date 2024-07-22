import { ParameterType } from "jspsych";
import { FIXATION_CROSS_DURATION, FIXATION_CROSS_HTML } from "../constants";
const info = {
  name: "display-text-plugin",
  parameters: {
    trial_duration: {
      type: ParameterType.INT,
      default: null,
    },
    fixation_cross_duration: {
      type: ParameterType.INT,
      default: FIXATION_CROSS_DURATION,
    },
  },
};

class DisplayTextPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  async trial(display_element, trial) {
    const random_trial_duration = this.jsPsych.randomization.randomInt(
      5000,
      8000
    );
    trial.trial_duration = random_trial_duration;

    display_element.innerHTML = `<h1>ESTIMATOR submitting estimate</h1>
      <center><div class="loader"></div></center>
    `;
    await this.delay(trial.trial_duration);

    display_element.innerHTML = FIXATION_CROSS_HTML;
    await this.delay(trial.fixation_cross_duration);
    this.jsPsych.finishTrial();
  }

  async delay(ms) {
    return new Promise((resolve) =>
      this.jsPsych.pluginAPI.setTimeout(resolve, ms)
    );
  }
}

DisplayTextPlugin.info = info;
export default DisplayTextPlugin;
