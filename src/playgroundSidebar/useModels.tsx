import { ApiKey, OpenAIModel } from '@/utils/OpenAI';
import React from "react";

/*
  Simple hook to fetch models from the API
*/
export default function useModels() {
  const [models, setModels] = React.useState<OpenAIModel[]>([]);
  const [loadingModels, setLoadingModels] = React.useState(false);

  React.useEffect(() => {

    const fetchModels = async () => {
      setLoadingModels(true);
      const models = await fetch("/api/models", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${ApiKey}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.chatModels);
      setModels(models || []);
      setLoadingModels(false);
    };

    fetchModels();
  }, []);

  return { models, loadingModels };
}
