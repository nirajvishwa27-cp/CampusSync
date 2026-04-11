async function run() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Set GEMINI_API_KEY before running this script.');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );
    const data = await response.json();
    console.log(
      'Available models:',
      data.models?.map((m) => m.name).join('\n') || data
    );
  } catch (e) {
    console.error(e);
  }
}
run();
