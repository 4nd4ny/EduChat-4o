import { useOpenAI } from "../context/OpenAIProvider";
import React from "react";
import Dropdown from "./Dropdown";
import Slider from "./Slider";
import { OpenAIChatModels, OpenAIConfig } from "@/utils/OpenAI";
import useModels from "./useModels";
import Link from "next/link";
import { MdHome } from "react-icons/md";
type Props = {};

export default function PlaygroundSidebar({}: Props) {
  const { config, updateConfig } = useOpenAI();
  const { models, loadingModels } = useModels();

  const handleUpdateConfig = <K extends keyof OpenAIConfig>(
    id: K,
    value: OpenAIConfig[K] | undefined
  ) => {
    updateConfig({
      [id]: value,
    });
  };

  return (
    <div className="flex flex-col bg-gray-100 left-0 top-0 h-full max-h-screen md:fixed md:w-[320px]">
      <div className="flex h-full flex-col items-stretch p-4 space-y-6">
        <Dropdown
          label="MODÈLE"
          options={
            loadingModels
              ? []
              : (models.map(({ id }) => ({ label: id, value: id })) as any)
          }
          value={config.model}
          onSelect={(option) => handleUpdateConfig("model", option)}
        />
        <Slider
          label="Température"
          range={[0, 1]}
          step={0.1}
          value={config.temperature as number}
          onChange={(value: OpenAIConfig["temperature"]) =>
            handleUpdateConfig("temperature", value)
          }
        />
        <Slider
          label="Nb tokens Maxi"
          range={[0, OpenAIChatModels[config.model].maxLimit || 8192]}
          step={1024}
          value={config.max_tokens as number}
          onChange={(value: OpenAIConfig["max_tokens"]) =>
            handleUpdateConfig("max_tokens", value)
          }
        />
        <Slider
          label="Proba de Sélection"
          range={[0, 1]}
          step={0.1}
          value={config.top_p as number}
          onChange={(value: OpenAIConfig["top_p"]) =>
            handleUpdateConfig("top_p", value)
          }
        />
        <Slider
          label="Pénalité de Fréquence"
          range={[0, 1]}
          step={0.1}
          value={config.frequency_penalty as number}
          onChange={(value: OpenAIConfig["frequency_penalty"]) =>
            handleUpdateConfig("frequency_penalty", value)
          }
        />
        <Slider
          label="Pénalité de Présence"
          range={[0, 1]}
          step={0.1}
          value={config.presence_penalty as number}
          onChange={(value: OpenAIConfig["presence_penalty"]) =>
            handleUpdateConfig("presence_penalty", value)
          }
        />
      </div>
      <div className="flex flex-col gap-y-2 border-y border-gray/10 py-2">
        <Link
          className="flex items-center gap-3 rounded p-3 transition-colors hover:bg-gray-500/10"
          href="/"
        >
          <MdHome />
          Accueil
        </Link>
      </div>
    </div>
  )
}
