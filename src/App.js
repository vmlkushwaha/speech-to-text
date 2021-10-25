import React, { Component } from "react";
import { getTokenOrRefresh } from "./token_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import "./App.css";
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: "the result will be shown here... ",
    };
  }

  async componentDidMount() {
    const tokenRes = await getTokenOrRefresh();
    if (tokenRes.authToken === null) {
      this.setState({
        displayText: "FATAL_ERROR: " + tokenRes.error,
      });
    }
  }

  async sttFromMic() {
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region,
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig,
    );

    this.setState({
      displayText: "speak into your microphone...",
    });

    recognizer.recognizeOnceAsync((result) => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `The Result is: ${result.text}`;
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }

      this.setState({
        displayText: displayText,
      });
    });
  }

  render() {
    return (
      <div className="app-container">
        <h1 className="title">Convert Speech to Text</h1>

        <div className="main-container">
          <h4>click on the mic to start</h4>
          <div className="mic-container" onClick={() => this.sttFromMic()}>
            <i class="microphone big icon"></i>
          </div>
          <div className="result-container">
            <p className="result">{this.state.displayText}</p>
          </div>
        </div>
      </div>
    );
  }
}
