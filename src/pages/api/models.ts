import { ApiKey, OpenAIChatModels } from '@/utils/OpenAI';
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const openAi = new OpenAI({ apiKey: `${ApiKey}` });

  try {
    const { data } = await openAi.models.list();
/*
    console.log("\nListe complète des modèles :");
    console.table(data.map(model => ({
      id: model.id,
      created: new Date(model.created * 1000).toLocaleString(),
      ownedBy: model.owned_by
    })));

    console.log("\nDétails complets de chaque modèle :");
    data.forEach((model, index) => {
      console.log(`\nModèle ${index + 1}:`);
      console.dir(model, { depth: null, colors: true });
    });
*/
    // Get the list of models
    const models = data.map(({ id }) => id);

    // Get the models that can interface with the chat API and return
    
    const chatModels = models
      .filter((model) => model in OpenAIChatModels)
      .map((model) => OpenAIChatModels[model as keyof typeof OpenAIChatModels])
      //.sort((a, b) => (b.maxLimit || 0) - (a.maxLimit || 0)); // Sort by max limit

    return res.status(200).json({
      models,
      chatModels,
    });
  } catch (e: any) {
    if (e.response) {
      return res.status(e.response.status).json({ error: e.response.data });
    }

    return res.status(500).json({ error: e.message });
  }
}
