import OpenAI from "openai";

const secrets =
  process.env.NODE_ENV === "development"
    ? require("TODO: insert own path here") // TODO
    : {};
const openai = new OpenAI({
  apiKey: secrets["OPENAI_API_KEY"],
  dangerouslyAllowBrowser: true,
});

export async function llmDescription(
  curNodeInfo: any,
  parentInfo: any,
  childrenInfo: any
): Promise<string> {
  if (curNodeInfo.length === 0) {
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
          content: `The data provided contains information about a component of a visualization, its parent components, and its children components. The information provided to you will be in the following format:

          current node: {
                label: string;
                shortDescription?: string;
                longDescription?: string;
                objectType?: string; // shape, text, image, etc
            }

          parent node: [{
              label: string;
              shortDescription?: string;
              longDescription?: string;
              objectType?: string; // shape, text, image, etc
            }]

          children node: [{
              label: string;
              shortDescription?: string;
              longDescription?: string;
              objectType?: string; // shape, text, image, etc
            }]
            
            The description information for the current node, all of the current node's parents, and all of the current node's children are provided separately, and the information for the parent and children nodes is in array format.

            A definition for each of the fields is as follows:

            - label: one word description or name of the component.
            - shortDescription: 4-5 word string that provides a brief summary of the component.
            - longDescription: sentence or phrase that provides additional information about the component.
            - objectType: string that specifies the type of content in the component, such as shape, text, or image.
            
            You should provide a text description that summarizes all of the information provided in a clear and concise manner. Remember, the text description you provide will be used as the aria label for this component of the visualization.`,
        },
        {
          role: "user",
          content: `Here is the information for the current node: ${JSON.stringify(
            curNodeInfo
          )}. The information for the parent nodes is: ${JSON.stringify(
            parentInfo
          )} and the information for the children nodes is: ${JSON.stringify(
            childrenInfo
          )}.`,
        },
      ],
    });

    return chat.choices[0].message.content;
  }
}
