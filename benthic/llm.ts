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
          content: `Please provide a concise, clear, and informative text description that can be used as an aria label using the following data.`,
        },
        {
          role: "user",
          content: `Here are the description tokens provided by the user: ${JSON.stringify(
            descriptionTokens
          )}`,
        },
        {
          role: "user",
          content: `For each bin, use the Vega-Lite predicate schema to create one Vega-lite predicate for each field in the bin.
                     Each predicate must include the field and only ONE property to specify what data from that field belongs in the bin:
                     equal, range, lt (less than), lte (less than or equal), gt (greater than), gte (greater than or equal), or oneOf.
                     Make sure to give a full response in a JSON format. Do not change the names of the fields in your answer.

                     For example, if we have:
        
                    {
                        "bins": ["Compact Cars", "Mid-Size Cars", "Full-Size Cars"]
                    },
                    
                    You should output:
                    
                    { bins: [
                            {
                                "bin_name": "Compact Cars",
                                "reasoning": [insert a meaningful explanation for the existence of this bin and its boundaries],
                                "pred":
                                    {
                                    "field": "Displacement",
                                    "lte": 100,
                                    }
                            },
                            {
                                "bin_name": "Mid-Size Cars",
                                "reasoning": [insert a meaningful explanation for the existence of this bin and its boundaries],
                                "pred": 
                                    {
                                    "field": "Displacement",
                                    "range": [101, 150],
                                    }
                            },
                            {
                                "bin_name": "Full-Size Cars",
                                "reasoning": [insert a meaningful explanation for the existence of this bin and its boundaries],
                                "pred": 
                                    {
                                    "field": "Displacement",
                                    "gte": 151,
                                    }
                            }
                        ]
                    }
        
                    Another example, if we have:
        
                    {
                        "bins": ["Japan", "USA", "France"]
                    },
                    
                    You should output:
                    
                    { bins: [
                            {
                                "bin_name": "Japan",
                                "reasoning": [insert a meaningful explanation for the existence of this bin and its boundaries],
                                "pred": 
                                    {
                                    "field": "car_origin",
                                    "oneOf": ["nissan", "lexus"]
                                    }
                            },
                            {
                                "bin_name": "USA",
                                "reasoning": [insert a meaningful explanation for the existence of this bin and its boundaries],
                                "pred": 
                                    {
                                    "field": "car_origin",
                                    "oneOf": ["ford", "ram"]
                                    }
                            },
                            {
                                "bin_name": "France",
                                "reasoning": [insert a meaningful explanation for the existence of this bin and its boundaries],
                                "pred": 
                                    {
                                    "field": "car_origin",
                                    "oneOf": ["renault", "citroen"]
                                    }
                            }
                        ]
                    }    
                    `,
        },
      ],
    });

    return chat.choices[0].message.content;
  }
}
