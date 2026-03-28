import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
      options,
    );

    const data = await response.json();
console.log("RAW GEMINI:", JSON.stringify(data, null, 2));
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.log("error" , err);
  }
}

export default getOpenAIAPIResponse;