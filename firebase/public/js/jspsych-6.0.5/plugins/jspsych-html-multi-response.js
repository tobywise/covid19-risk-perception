/**
 * jspsych-html-slider-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['html-multi-response'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-multi-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      description: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Description',
        default: undefined,
        description: 'The description to be displayed'
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
      show_slider_value: {
        type: jsPsych.plugins.parameterType.INT,
        default: false
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var slider_clicked = false;
    var confidence_clicked = true;

    var html = '<div id="jspsych-html-slider-response-wrapper" style="margin: 100px 0px;">';
    html += '<div id="jspsych-html-slider-response-stimulus">' + trial.stimulus + '<br><br></div>';
    html += '<div id="jspsych-html-slider-response-description">' + trial.description + '</div>';
    html += '<br><br>';
    html += trial.prompt;
    html += '<br><br><br>';
    html += '<div class="jspsych-html-slider-response-container" style="position:relative;">';

    if (trial.response_type == 'slider') {
      html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-html-slider-response-response" class="not-clicked"></input>';
      html += '<div>'
      for(var j=0; j < trial.labels.length; j++){
        var width = 100/(trial.labels.length-1);
        var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%; font-weight: bold">'+trial.labels[j]+'</span>';
        html += '</div>'
      }
    }

    if (trial.show_slider_value > 0) {
      html += '<br><br><div id="slider-value" style="font-size: 120%"></div><br>'
    }

    if (trial.confidence == true) {
      confidence_clicked = false;
      html += '<br><br>';
      html += 'How confident are you in this answer?';
      html += '<br><br>';
      html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-html-slider-response-confidence" class="not-clicked"></input>';
      html += '<div>'
      var confidence_labels = ['complete guess', 'completely sure']
      for(var j=0; j < confidence_labels.length; j++){
        var width = 100/(confidence_labels.length-1);
        var left_offset = (j * (100 /(confidence_labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%; font-weight: bold">'+confidence_labels[j]+'</span>';
        html += '</div>'
      }
    }

    else if (trial.response_type == 'likert') {
      var options = trial.options.split(';');
      var width = 100;
      var options_string = '<div class="jspsych-survey-likert-opts" data-radio-group="Q' + 1 + '" style="list-style-type:none">';
      for (var j = 0; j < options.length; j++) {
        options_string += '<label class="jspsych-survey-likert-opt-label">' + options[j];
        options_string += '<input checked="unchecked" type="radio" name="radio' + '" value="' + j + '"</input>';
        options_string += '<span class="checkmark"></span></label>';
      }
      options_string += '<input checked="checked" type="radio" name="radio' + '" value="' + -99 + '" style="opacity: 0"</input>';
      options_string += '</div>';
      html += options_string;
    }


    html += '</div>';

    // add submit button
    html += '<div id="response-warning"></div><br>'
    html += '<button id="jspsych-html-slider-response-next" class="jspsych-btn">'+trial.button_label+'</button>';
    html += '</div>';
    html += '</div>';
    display_element.innerHTML = html;

    if (trial.response_type == 'slider') {
      document.getElementById('jspsych-html-slider-response-response').onclick = function() {
        document.getElementById("jspsych-html-slider-response-response").className = "clicked";
        slider_clicked = true;
      };

      if (trial.show_slider_value > 0) {
        document.getElementById('slider-value').innerHTML = '<b>' + document.getElementById('jspsych-html-slider-response-response').value / trial.show_slider_value + '</b>';
        document.getElementById('jspsych-html-slider-response-response').oninput = function() {
          document.getElementById('slider-value').innerHTML = '<b>' + document.getElementById('jspsych-html-slider-response-response').value / trial.show_slider_value + '</b>';
        }
      }
      
    
      if (trial.confidence == true) {
        document.getElementById('jspsych-html-slider-response-confidence').onclick = function() {
          document.getElementById("jspsych-html-slider-response-confidence").className = "clicked";
          confidence_clicked = true;
        };
      }  
    }


    var response = {
      rt: null,
      response: null
    };

    display_element.querySelector('#jspsych-html-slider-response-next').addEventListener('click', function() {
      // measure response time
      var endTime = (new Date()).getTime();
      response.rt = endTime - startTime;
      if (trial.response_type == 'slider') {

        if (slider_clicked == true & confidence_clicked == true) {
          response.response = display_element.querySelector('#jspsych-html-slider-response-response').value;
          if (trial.confidence == true) {
            response.confidence = display_element.querySelector('#jspsych-html-slider-response-confidence').value;
          }
        }
        else {
          response.response = -99;
          
        }
      }  
      else if (trial.response_type == 'likert') {
        var ele = document.getElementsByName('radio'); 
              
        for(i = 0; i < ele.length; i++) { 
            if(ele[i].checked) {
              response.response = ele[i].value;
            }
        } 
      }
      

      if(trial.response_ends_trial & response.response != -99){
        end_trial();
      } 
      else if (response.response == -99) {
        if (trial.response_type == 'likert') {
          document.getElementById('response-warning').innerHTML = 'Please select one answer';
        }
        else if (trial.response_type == 'slider') {
          document.getElementById('response-warning').innerHTML = 'You must click on the slider before continuing';
        }
        
      }
      else {
        display_element.querySelector('#jspsych-html-slider-response-next').disabled = true;
      }

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "response": response.response,
        "confidence": response.confidence,
        "stimulus": trial.stimulus,
        "prompt": trial.prompt,
        "qid": trial.qid,
        "phase": trial.phase
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-slider-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
