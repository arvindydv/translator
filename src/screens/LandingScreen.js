import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./LandingScreen.css";

import Select from "../components/Select";

const LandingScreen = () => {
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanuage, setTargetLanguage] = useState("hi");
  const textToTranslate = useRef();
  const showTranslatedText = useRef();
  const copyBtn = useRef();

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://text-translator2.p.rapidapi.com/getLanguages",
      headers: {
        "X-RapidAPI-Key": "e713376f87msh6dae9cfea149893p10941cjsn2b31d0996618",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
    };

    const savedData = localStorage.getItem("translatorLanguages");

    if (savedData) {
      setSupportedLanguages(JSON.parse(savedData));
    } else {
      // console.log("calling")
      axios
        .request(options)
        .then((res) => {
          // console.log(res.data.data.languages)
          setSupportedLanguages(res.data.data.languages);
          localStorage.setItem(
            "translatorLanguages",
            JSON.stringify(res.data.data.languages)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  function translateHandler() {
    const text = textToTranslate.current.value;

    if (text.trim() === "") {
      alert("Plese enter text to translate");
      textToTranslate.current.value = "";
      return;
    }

    showTranslatedText.current.innerText = "Loading ...";

    const encodedParams = new URLSearchParams();
    encodedParams.set("source_language", sourceLanguage);
    encodedParams.set("target_language", targetLanuage);
    encodedParams.set("text", text);

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "e713376f87msh6dae9cfea149893p10941cjsn2b31d0996618",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };

    axios
      .request(options)
      .then((response) => {
        const translatedText = response.data.data.translatedText;
        showTranslatedText.current.innerText = translatedText;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function copyHandler() {
    navigator.clipboard.writeText(showTranslatedText.current.innerText);
    copyBtn.current.innerText = "Copied";
    copyBtn.current.style.backgroundColor = "green";

    setTimeout(() => {
      copyBtn.current.innerText = "Copy";
      copyBtn.current.style.backgroundColor = "#0000ff";
    }, 800);
  }

  return (
    <div id="container">
      <header>
        <h1>Translator</h1>
      </header>
      <div id="selectors">
        <Select
          supportedLanguages={supportedLanguages}
          name="Translated from : "
          language={sourceLanguage}
          setLanguage={setSourceLanguage}
        />
        <Select
          supportedLanguages={supportedLanguages}
          name="Translated To : "
          language={targetLanuage}
          setLanguage={setTargetLanguage}
        />
      </div>

      <div id="input-container">
        <input ref={textToTranslate} placeholder="input text to translate..." />
        <button onClick={translateHandler} className="btn">
          Translate
        </button>
      </div>

      <div id="translated-data-container">
        <p ref={showTranslatedText}></p>
        <button ref={copyBtn} onClick={copyHandler} className="btn">
          Copy
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;
