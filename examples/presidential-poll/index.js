const { VoiceServer } = require("@fonos/voice");
const { tts } = require("./config");

const config = {
  finishOnKey: "*",
  timeout: 2000,
  numDigits: 1,
  source: "dtmf"
};

const voiceServerConfig = {
  base: ""
};
const candidates = {
  1: { name: "Donald Trump" },
  2: { name: "Hillary Clinton" },
  3: { name: "Beny Sanders" }
};

/**
 * This example shows the using of most all Fonos verbs.
 */
const voiceServer = new VoiceServer(voiceServerConfig);

//You can use another TTS plugin as MaryTTS
voiceServer.use(tts);

voiceServer.listen(async (req, res) => {
  await res.say(
    "Hello, this is a presidential poll from the Georgia Statistics Center."
  );

  const key = await res.gather(config);
  console.log(`Remove from list? ${key}`);

  if (key === 7) removeFromList(res);

  await runMenu(res);

  res.say(
    "Thank you for participating. Review the results at www.georgia.gov. Goodbye!"
  );
});

function removeFromList(res) {
  // This address does not exist, it its only for ilustration
  http
    .post("https://georgia.gov/removeFromList")
    .timeout(1200)
    .basicAuth("username", "password")
    .then((result) => {
      if (result.body === "OK") {
        res.say("You have been remove from our list");
      } else {
        // Do nothing for now
      }
    });
}

async function runMenu(res) {
  while (true) {
    res.say("For Trump Press one. For Hillary, press two and for Sanders 3");

    const key = await res.gather(config);

    if (!["1", "2", "3"].includes(key)) {
      res.say("I could not register your selection. Lets try again.");
      // You can use Play to stream a pre-recorded audio
      res.play("sound:beep");
      continue;
    }

    res.say(`You selected option ${key}, ${candidates[key].name}`);

    break;
  }
}
