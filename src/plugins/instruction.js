import { ParameterType } from "jspsych";
import { GENERAL_INSTRUCTIONS } from "../constants";

const info = {
  name: "instruction-plugin",
  parameters: {
    block_number: {
      type: ParameterType.INT,
      default: null,
    },
    rt: {
      type: ParameterType.INT,
      default: null,
    },
    instruction_arr: {
      type: ParameterType.OBJECT,
      default: [],
    },
  },
};

class InstructionPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element, trial) {
    this.currentIndex = 0; // Ensure currentIndex is reset for each trial

    const startTime = performance.now();
    const trial_data = {
      block_number: trial.block_number,
      rt: null,
      instruction_arr: trial.instruction_arr,
    };

    display_element.innerHTML = `<div id="sentence-container" style="font-size: 20px; margin: 30px; text-align: left;"></div>
    <p style='font-size=12px;'><i>Press the spacebar to continue</i></p>`;

    this.keydownListener = (event) => {
      if (event.code === "Space") {
        this.showNextSentence(
          display_element,
          trial.instruction_arr,
          trial_data,
          startTime
        );
      }
    };

    window.addEventListener("keydown", this.keydownListener);
  }

  showNextSentence(display_element, sentences, trial_data, startTime) {
    const container = display_element.querySelector("#sentence-container");
    if (this.currentIndex < sentences.length) {
      container.innerHTML += `<p>${sentences[this.currentIndex]}</p>`;
      this.currentIndex++;
    } else {
      trial_data.rt = performance.now() - startTime;
      window.removeEventListener("keydown", this.keydownListener); // Remove event listener
      this.jsPsych.finishTrial(trial_data);
    }
  }
}

InstructionPlugin.info = info;
export default InstructionPlugin;
