import OpenAI from "openai";

const secrets =
  process.env.NODE_ENV === "development"
    ? require("TODO: insert own path here") // TODO
    : {};
const openai = new OpenAI({
  apiKey: secrets["OPENAI_API_KEY"],
  dangerouslyAllowBrowser: true,
});

export async function llmDescription(descriptionTokens: any): Promise<string> {
  if (descriptionTokens.length === 0) {
    return "";
  } else {
    const chat = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
      seed: 1,
      messages: [
        {
          role: "system",
          content: `Using the following data, please provide a concise, clear, and informative text description that can be used as an aria label for a component of a visualization.`,
        },
        {
          role: "user",
          content: `The provided data is information on a component of a visualization. The information provided to you will be in the following format:
          
            {
                "label": "string",
                "color": "string",
                "objectType": "string",
                "role": "string",
                "textDescription": "string"
            }

            A description of each of the fields is as follows:

            - label: The label of the component.
            - color: The color of the component.
            - objectType: The type of the object (e.g., shape, text, image).
            - role: The role of the object (e.g., main concept, sub-concept, connector).
            - textDescription: A text description of the component.
            
            You should provide a text description that summarizes all of the information provided in a clear and concise manner. Remember, the text description you provide will be used as the aria label for this component of the visualization.`,
        },
        {
          role: "user",
          content: `Here is the data provided by the user: ${JSON.stringify(
            descriptionTokens
          )}`,
        },
      ],
    });

    return chat.choices[0].message.content;
  }
}
