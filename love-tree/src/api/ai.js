export async function generateMascotFromAudio(audioBlob) {
  const form = new FormData();
  form.append("audio", audioBlob, "voice.webm");

  const res = await fetch("http://localhost:5000/api/mascot/from-audio", {
    method: "POST",
    body: form
  });

  return await res.json();
}
