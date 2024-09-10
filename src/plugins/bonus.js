import { ParameterType } from "jspsych";
import { CONTINUE_PROMT_HTML } from "../constants";

const info = {
  name: "bonus-plugin",
  parameters: {
    trial_duration: {
      type: ParameterType.INT,
      default: 5000, // 5 sec
    },
    block_number: {
      type: ParameterType.INT,
      default: null,
    },
  },
};

class BonusPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element, trial) {
    // call the function to get the diff
    const diff = this.getRandomSubjectEstimationDiff();
    console.log(diff);

    // Set max bonus and min bonus
    const max_bonus = 3.0;
    const min_bonus = 1.0;

    // Set a max allowable difference for scaling
    const max_diff = 20; // beyond this, the bonus will be the minimum

    // Calculate bonus as a linear function of the difference
    let bonus_val = Math.max(min_bonus, max_bonus - (diff / max_diff) * (max_bonus - min_bonus));

    // Display the bonus
    display_element.innerHTML = `<p>Congratulations! You earned a bonus of £${bonus_val.toFixed(2)}!</p> ${CONTINUE_PROMT_HTML}`;
  }

  // function that allow you randomly choose one dishonestry trial
  getRandomSubjectEstimationDiff() {
    // get the total number of dishonestry trials
    const dishonestyTrialNumber =
      this.jsPsych.data
        .get()
        .filter({ trial_type: "dishonesty-plugin" })
        .count() - 1;

    // randomly get one of those trials
    const randomDishonestyTrial = this.jsPsych.data
      .get()
      .filter({ trial_type: "dishonesty-plugin" }).trials[
      this.jsPsych.randomization.randomInt(0, dishonestyTrialNumber)
    ];

    console.log(dishonestyTrialNumber);
    console.log(randomDishonestyTrial);

    // get the participant response and jar value from that chosen trial
    const participant_response = randomDishonestyTrial.response;
    const jar_value = parseFloat(randomDishonestyTrial.jar_image.slice(0, 5));

    console.log(participant_response);
    console.log(jar_value);

    // return the difference btw them, and get the abs(diff)
    return Math.abs(participant_response - jar_value);
  }
}

BonusPlugin.info = info;
export default BonusPlugin;
