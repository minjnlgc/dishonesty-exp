import { ParameterType } from "jspsych";

const info = {
  name: "quiz-plugin",
  parameters: {
    block_number: {
      type: ParameterType.INT,
      default: null,
    },
    rt: {
      type: ParameterType.INT,
      default: null,
    },
    question: {
      type: ParameterType.STRING,
      default: "",
    },
    options: {
      type: ParameterType.OBJECT,
      default: [],
    },
    correct_option_idx: {
      type: ParameterType.INT,
      default: null,
    },
  },
};

class QuizPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  async trial(display_element, trial) {
    const trial_data = {
        block_number: trial.block_number,
        rt: null,
        selected_option: null,
        correct: null,
        incorrect_count: 0
      };

    const options_HTML = trial.options.reduce((acc, e, i) => {
      acc += `
        <div style="margin-bottom: 25px;">
          <input type="radio" id="option${i}" name="options" value="${i}" style="width: 17px; height: 17px">
          <label for="option${i}">${e}</label>
        </div>`;
      return acc;
    }, "");

    display_element.innerHTML = `
      <div id='quiz-container' style='text-align: left; font-size: 20px; margin: 30px;'>
        <h4>${trial.question}</h4>
        ${options_HTML}
        <div id="error-message" style="color: red; display: none;">* Please select an option</div>
        <div id="incorrect-message" style="color: red; display: none;">* The answer is incorrect</div>
        <center><button id="submit-button" style="margin-top: 20px; font-size: 16px;" class='jspsych-btn'>Submit</button></center>
      </div>
    `;

    const submitButton = display_element.querySelector("#submit-button");
    const errorMessage = display_element.querySelector("#error-message");
    const incorrectMessage =
      display_element.querySelector("#incorrect-message");
    const startTime = performance.now();

    submitButton.addEventListener("click", async () => {
      const selectedOption = display_element.querySelector(
        'input[name="options"]:checked'
      );

      console.log(parseInt(selectedOption.value));
      //console.log(trial.correct_option_idx);

      if (
        selectedOption !== null &&
        parseInt(selectedOption.value) === trial.correct_option_idx
      ) {
        const endTime = performance.now();
        const rt = endTime - startTime;

        trial_data.rt = rt;
        trial_data.selected_option = parseInt(selectedOption.value);
        trial_data.correct = parseInt(selectedOption.value) === trial.correct_option_idx;

        this.jsPsych.finishTrial(trial_data);
      } else if (
        selectedOption !== null &&
        parseInt(selectedOption.value) !== trial.correct_option_idx
      ) {
        incorrectMessage.style.display = "block";
        errorMessage.style.display = "none";

        trial_data.incorrect_count += 1;
        
        // const endTime = performance.now();
        // const rt = endTime - startTime;

        // trial_data.rt = rt;
        // trial_data.selected_option = parseInt(selectedOption.value);
        // trial_data.correct = parseInt(selectedOption.value) === trial.correct_option_idx;
        
        // await this.delay(2000);
        // this.jsPsych.finishTrial(trial_data);
      } else if (!selectedOption) {
        errorMessage.style.display = "block";
        incorrectMessage.style.display = "none";
      }
    });
  }

  async delay(ms) {
    return new Promise((resolve) =>
      this.jsPsych.pluginAPI.setTimeout(resolve, ms)
    );
  }
}

QuizPlugin.info = info;
export default QuizPlugin;
