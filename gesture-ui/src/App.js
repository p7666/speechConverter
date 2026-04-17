import { useEffect, useState } from "react";

function App() {
  const [gesture, setGesture] = useState("Waiting...");
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("Connecting...");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [lastSpoken, setLastSpoken] = useState("");
  const [lastSpokenTime, setLastSpokenTime] = useState(0); // ✅ NEW

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://speechconverter.onrender.com/gesture")
        .then(res => res.json())
        .then(data => {

          if (data.lastUpdated && Date.now() - data.lastUpdated < 10000) {
            setStatus("Connected");
            setGesture(data.gesture);

            // ✅ Update history
            setHistory(prev => {
              if (prev[0] !== data.gesture) {
                return [data.gesture, ...prev.slice(0, 4)];
              }
              return prev;
            });

            // ✅ HANDLE REPEATED GESTURES WITH DELAY
            const now = Date.now();

            if (
              audioEnabled &&
              data.gesture &&
              data.gesture !== "None" &&
              (data.gesture !== lastSpoken || now - lastSpokenTime > 3000)
            ) {
              speak(data.gesture);
              setLastSpoken(data.gesture);
              setLastSpokenTime(now);
            }

          } else {
            setStatus("Connect to WiFi"); // ✅ UPDATED TEXT
            setGesture("None");
          }

        })
        .catch(() => {
          setStatus("Disconnected");
          setGesture("No Server");
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [lastSpoken, lastSpokenTime, audioEnabled]);

  // ✅ SPEECH FUNCTION
  const speak = (text) => {
    if (!text || text === "None") return;

    const synth = window.speechSynthesis;

    synth.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = synth.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    synth.speak(utterance);
  };

  return (
    <div className="container-fluid min-vh-100 bg-dark text-white p-4">

      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">Gesture Recognition System</h1>

        {/* Enable Voice */}
        <button
          className="btn btn-primary mt-3"
          onClick={() => {
            setAudioEnabled(true);

            // 🔊 Enable speech
            const test = new SpeechSynthesisUtterance("Voice enabled");
            window.speechSynthesis.speak(test);
          }}
        >
          Enable Voice 🔊
        </button>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        <span className={`badge px-4 py-2 fs-6 ${
          status === "Connected"
            ? "bg-success"
            : status === "Connect to WiFi"
            ? "bg-warning text-dark"
            : "bg-danger"
        }`}>
          {status}
        </span>
      </div>

      <div className="row justify-content-center">

        {/* Gesture */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card text-center shadow-lg">
            <div className="card-body">
              <h5 className="card-title">Detected Gesture</h5>
              <p className="display-4 text-primary fw-bold">
                {gesture}
              </p>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-body">
              <h5 className="card-title">Recent Gestures</h5>
              <ul className="list-group">
                {history.length === 0 ? (
                  <li className="list-group-item">No gestures yet</li>
                ) : (
                  history.map((g, index) => (
                    <li key={index} className="list-group-item">
                      {g}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;