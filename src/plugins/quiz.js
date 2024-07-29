import { ParameterType } from "jspsych";

const info = {
  name: "quiz-plugin",
  parameters: {
    block_number: {
      type: ParameterType.INT,
      default: null,
    },
    question_list: {
      type: ParameterType.OBJECT,
      default: [],
    },
    recap_instruction_content: {
      type: ParameterType.STRING,
      default: "Here are the recap of the instruction",
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
      responses: {
        Q1: 0,
        Q2: 0,
        Q3: 0,
      },
      incorrect_count: {
        Q1: 0,
        Q2: 0,
        Q3: 0,
      },
      attempts: 0,
    };

    const startTime = performance.now();
    console.log(trial.question_list);

    const quiz_html = trial.question_list
      .map((quiz_obj, i) => this.createOneQuiz(quiz_obj, i))
      .join("");

    const content = `
    <div id='quiz-container' style='text-align: left; font-size: 20px; margin: 30px; height: 100vh; padding-top: 20px'>
      <button id='recap-button' class='jspsych-btn' style='margin-top: 20px; background-color: #00aedb; color: white; font-size: 20px'>Click here to show the recap of the instructions</button>
      <div id='recap-instruction' style='display: none; margin-top: 10px;'>${trial.recap_instruction_content}</div>
      ${quiz_html}  
      <center><button id="submit-button" style="margin-top: 20px; font-size: 16px;" class='jspsych-btn'>Submit</button></center>
    </div>
    `;
    display_element.innerHTML = content;

    console.log(trial_data.incorrect_count);

    display_element
      .querySelector("#recap-button")
      .addEventListener("click", () => {
        const recap_instruction =
          display_element.querySelector("#recap-instruction");

        if (recap_instruction.style.display == "block") {
          recap_instruction.style.display = "none";
        } else {
          recap_instruction.style.display = "block";
        }
      });

    const submit_button = display_element.querySelector("#submit-button");
    submit_button.addEventListener("click", () => {
      trial_data.attempts += 1;
      const is_correct = trial.question_list.map((quiz_obj, quiz_index) => {
        const selected_option = display_element.querySelector(
          `input[name="question${quiz_index}"]:checked`
        );
        const error_message = display_element.querySelector(
          `#error-message-${quiz_index}`
        );
        const incorrect_message = display_element.querySelector(
          `#incorrect-message-${quiz_index}`
        );

        if (
          selected_option != null &&
          parseInt(selected_option.value) === quiz_obj.CORRECT_IDX
        ) {
          console.log("non null and correct");
          error_message.style.display = "none";
          incorrect_message.style.display = "none";

          trial_data.rt = performance.now() - startTime;
          trial_data.responses[`Q${quiz_index + 1}`] = parseInt(
            selected_option.value
          );

          return true;
        } else if (
          selected_option != null &&
          parseInt(selected_option.value) !== quiz_obj.CORRECT_IDX
        ) {
          console.log("wrong answer");
          error_message.style.display = "none";
          incorrect_message.style.display = "block";

          trial_data.incorrect_count[`Q${quiz_index + 1}`] += 1;

          return false;
        } else {
          error_message.style.display = "block";
          incorrect_message.style.display = "none";

          return false;
        }
      });

      const is_all_correct = is_correct.every((e) => e);
      console.log(is_all_correct);

      if (is_all_correct) {
        this.endTrial(trial_data);
      }
    });
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

  createOneQuiz(quiz_object, quiz_index) {
    const options_HTML = quiz_object["OPTIONS"].reduce(
      (acc, e, option_index) => {
        acc += `<div style="margin-bottom: 25px;">
          <input type="radio" id="option${quiz_index}_${option_index}" name="question${quiz_index}" value="${option_index}" style="width: 17px; height: 17px">
          <label for="option${quiz_index}_${option_index}">${e}</label>
        </div>`;
        return acc;
      },
      ""
    );

    return `<div>
      <h4>Question ${quiz_index + 1}: ${
      quiz_object["QUESTION"]
    }</h4>${options_HTML}
      <div id="error-message-${quiz_index}" style="color: red; display: none;">* Please select an option</div>
      <div id="incorrect-message-${quiz_index}" style="color: red; display: none;">* The answer is incorrect</div>
    </div>`;
  }
}

QuizPlugin.info = info;
export default QuizPlugin;
