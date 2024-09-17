import { ParameterType } from "jspsych";

// Define the information about the plugin, including its name and parameters.
const info = {
  name: "quiz-plugin", // Plugin name
  parameters: {
    block_number: {
      type: ParameterType.INT, // Parameter type is integer
      default: null, // Default value is null
    },
    question_list: {
      type: ParameterType.OBJECT, // Parameter type is object (list of questions)
      default: [], // Default value is an empty array
    },
    recap_instruction_content: {
      type: ParameterType.STRING, // Parameter type is string
      default: "Here are the recap of the instruction", // Default recap instruction content
    },
  },
};

class QuizPlugin {
  // Constructor to initialize jsPsych instance
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  // Method to define the trial (what happens when the trial starts)
  async trial(display_element, trial) {
    // Initialize trial data with block number, response times, and incorrect attempts
    const trial_data = {
      block_number: trial.block_number,
      rt: null, // Reaction time
      responses: {
        Q1: 0, // Response for question 1
        Q2: 0, // Response for question 2
        Q3: 0, // Response for question 3
      },
      incorrect_count: {
        Q1: 0, // Incorrect count for question 1
        Q2: 0, // Incorrect count for question 2
        Q3: 0, // Incorrect count for question 3
      },
      attempts: 0, // Track number of attempts
    };

    // Get the current time when the trial starts
    const startTime = performance.now();
    console.log(trial.question_list);

    // Generate the HTML for the quiz using the question list
    const quiz_html = trial.question_list
      .map((quiz_obj, i) => this.createOneQuiz(quiz_obj, i)) // Create HTML for each question
      .join(""); // Join HTML elements into one string

    // Add content including a recap button, quiz HTML, and submit button
    const content = `
    <div id='quiz-container' style='text-align: left; font-size: 20px; margin: 30px; height: 100vh; padding-top: 20px'>
      <button id='recap-button' class='jspsych-btn' style='margin-top: 20px; background-color: #00aedb; color: white; font-size: 20px'>Click here to show the recap of the instructions</button>
      <div id='recap-instruction' style='display: none; margin-top: 10px;'>${trial.recap_instruction_content}</div>
      ${quiz_html}  
      <center><button id="submit-button" style="margin-top: 20px; font-size: 16px;" class='jspsych-btn'>Submit</button></center>
      <br />
    </div>
    `;
    display_element.innerHTML = content; // Set the HTML content in the trial display

    console.log(trial_data.incorrect_count);

    // Add event listener for the recap button to show/hide the instruction recap
    display_element
      .querySelector("#recap-button")
      .addEventListener("click", () => {
        const recap_instruction =
          display_element.querySelector("#recap-instruction");

        // Toggle the display of the recap instruction
        if (recap_instruction.style.display == "block") {
          recap_instruction.style.display = "none";
        } else {
          recap_instruction.style.display = "block";
        }
      });

    // Add event listener for the submit button to handle quiz submission
    const submit_button = display_element.querySelector("#submit-button");
    submit_button.addEventListener("click", () => {
      trial_data.attempts += 1; // Increment the attempt count

      // Map through each question, check if the selected answer is correct, and display feedback
      const is_correct = trial.question_list.map((quiz_obj, quiz_index) => {
        const selected_option = display_element.querySelector(
          `input[name="question${quiz_index}"]:checked`
        ); // Get the selected answer
        const error_message = display_element.querySelector(
          `#error-message-${quiz_index}`
        ); // Get the error message element
        const incorrect_message = display_element.querySelector(
          `#incorrect-message-${quiz_index}`
        ); // Get the incorrect message element

        // Check if the selected option is correct
        if (
          selected_option != null &&
          parseInt(selected_option.value) === quiz_obj.CORRECT_IDX
        ) {
          console.log("non null and correct");
          error_message.style.display = "none"; // Hide error message
          incorrect_message.style.display = "none"; // Hide incorrect message

          // Record the response time and save the correct answer
          trial_data.rt = performance.now() - startTime;
          trial_data.responses[`Q${quiz_index + 1}`] = parseInt(
            selected_option.value
          );

          return true; // Return true if correct
        } else if (
          selected_option != null &&
          parseInt(selected_option.value) !== quiz_obj.CORRECT_IDX
        ) {
          console.log("wrong answer");
          error_message.style.display = "none"; // Hide error message
          incorrect_message.style.display = "block"; // Show incorrect message

          // Increment the incorrect count for this question
          trial_data.incorrect_count[`Q${quiz_index + 1}`] += 1;

          return false; // Return false if incorrect
        } else {
          // If no option is selected, show an error message
          error_message.style.display = "block"; // Show error message
          incorrect_message.style.display = "none"; // Hide incorrect message

          return false; // Return false if no selection
        }
      });

      // Check if all answers are correct
      const is_all_correct = is_correct.every((e) => e);
      console.log(is_all_correct);

      // If all answers are correct, end the trial
      if (is_all_correct) {
        this.endTrial(trial_data);
      }
    });
  }

  // Helper function to introduce a delay (used for potential timeouts or waits)
  async delay(ms) {
    return new Promise((resolve) =>
      this.jsPsych.pluginAPI.setTimeout(resolve, ms)
    );
  }

  // End the trial and store the trial data
  endTrial(trial_data) {
    this.jsPsych.pluginAPI.clearAllTimeouts(); // Clear any existing timeouts
    this.jsPsych.finishTrial(trial_data); // Finish the trial and save data
  }

  // Helper function to create the HTML structure for one quiz question
  createOneQuiz(quiz_object, quiz_index) {
    // Generate the HTML for the options in the quiz
    const options_HTML = quiz_object["OPTIONS"].reduce(
      (acc, e, option_index) => {
        acc += `<div style="margin-bottom: 25px;">
          <input type="radio" id="option${quiz_index}_${option_index}" name="question${quiz_index}" value="${option_index}" style="width: 17px; height: 17px">
          <label for="option${quiz_index}_${option_index}">${e}</label>
        </div>`;
        return acc; // Accumulate the options into a single string
      },
      ""
    );

    // Return the HTML for the question and options, along with error and incorrect messages
    return `<div>
      <h4>Question ${quiz_index + 1}: ${
      quiz_object["QUESTION"]
    }</h4>${options_HTML}
      <div id="error-message-${quiz_index}" style="color: red; display: none;">* Please select an option</div>
      <div id="incorrect-message-${quiz_index}" style="color: red; display: none;">* The answer is incorrect</div>
    </div>`;
  }
}

// Attach the info object to the plugin
QuizPlugin.info = info;

export default QuizPlugin;
