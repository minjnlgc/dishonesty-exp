import { ParameterType } from "jspsych";
const info = {
  name: "display-text-plugin",
  parameters: {
    trial_duration: {
      type: ParameterType.INT,
      default: 2000,
    },
  },
};

class DisplayTextPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  async trial(display_element, trial) {
    display_element.innerHTML = `<h2>ESTIMATOR SUBMITTING ESTIMATE...</h2>`;
    await this.delay(trial.trial_duration);
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
