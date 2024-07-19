/**
 * @title dishonesty-exp
 * @description
 * @version 0.1.0
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";
import "../styles/wheel.css";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";
import DishonestyPlugin from "./plugins/dishonesty";
import SpinningWheelPlugin from "./plugins/wheel";
import DisplayTextPlugin from "./plugins/display-text";

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({
  assetPaths,
  input = {},
  environment,
  title,
  version,
}) {
  const jsPsych = initJsPsych();

  const timeline = [];

  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });

  // Welcome screen
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: "<p>Welcome to dishonesty-exp!<p/>",
  });

  // Switch to fullscreen
  timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });

  timeline.push({
    type: SpinningWheelPlugin,
  });

  timeline.push({
    type: DishonestyPlugin,
  });

  timeline.push({
    type: DisplayTextPlugin,
  });

  timeline.push({
    type: DishonestyPlugin,
  });

  timeline.push({
    type: DisplayTextPlugin,
  });

  timeline.push({
    type: DishonestyPlugin,
  });

  timeline.push({
    type: DisplayTextPlugin,
  });

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
