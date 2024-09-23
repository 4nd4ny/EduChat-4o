import {
  Conversation,
  getHistory,
  storeConversation,
  History,
  deleteConversationFromHistory,
  updateConversation,
} from "./History";
import {
  defaultConfig,
  OpenAIChatMessage,
  OpenAIConfig,
  OpenAISystemMessage,
  OpenAIChatModels,
  SystemPrompt,
  ApiKey,
  OpenAIRequest
} from "@/utils/OpenAI";
import React, { 
  PropsWithChildren, 
  useCallback, 
  useEffect 
} from "react";
import { useRouter } from "next/router";

const CHAT_ROUTE = "/";

const defaultContext = {
  loading: true,
  config: defaultConfig as OpenAIConfig,
  updateConfig: (newConfig: Partial<OpenAIConfig>) => {},
  
  systemMessage: {
    role: "system",
    content: SystemPrompt,
  } as OpenAISystemMessage,
  updateSystemMessage: (content: string) => {},
  
  messages: [] as OpenAIChatMessage[],
  submit: () => {},
  addMessage: () => {},
  updateMessageContent: (id: number, content: string) => {},
  removeMessage: (id: number) => {},
  
  toggleMessageRole: (id: number) => {},

  conversationId: "",
  conversationName: "",
  updateConversationName: () => {},
  generateTitle: () => {},
  loadConversation: (id: string, conversation: Conversation) => {},
  resetConversation: () => {}, 
  deleteConversation: () => {},  
  clearConversation: () => {},

  conversations: {} as History,
  
  error: "",
};

const OpenAIContext = React.createContext<{
  loading: boolean;
  config: OpenAIConfig;
  updateConfig: (newConfig: Partial<OpenAIConfig>) => void;

  systemMessage: OpenAISystemMessage;
  updateSystemMessage: (content: string) => void;

  messages: OpenAIChatMessage[];
  submit: () => void;
  addMessage: (
    content?: string,
    submit?: boolean,
    role?: "user" | "assistant"
  ) => void;
  updateMessageContent: (id: number, content: string) => void;
  removeMessage: (id: number) => void;

  toggleMessageRole: (id: number) => void;

  conversationId: string;
  conversationName: string;
  updateConversationName: (id: string, name: string) => void;
  generateTitle: () => void;
  loadConversation: (id: string, conversation: Conversation) => void;
  resetConversation: () => void; 
  deleteConversation: (id: string) => void;
  clearConversation: () => void;
  conversations: History;

  error: string;
}>(defaultContext);

export default function OpenAIProvider({ children }: PropsWithChildren) {
  


  // General
  const router = useRouter(); 
  const [loading, setLoading] = React.useState(false);
  const [config, setConfig] = React.useState<OpenAIConfig>(defaultConfig);
  const updateConfig = (newConfig: Partial<OpenAIConfig>) => {
    setConfig((prev) => {
      // If model changes set max tokens to half of the model's max tokens
      if (newConfig.model && newConfig.model !== prev.model) {
        newConfig.max_tokens = Math.floor(
          OpenAIChatModels[newConfig.model].maxLimit / 2
        );
      }
      return {
        ...prev,
        ...newConfig,
      };
    });
  };



  // System
  const [systemMessage, setSystemMessage] = React.useState<OpenAISystemMessage>(defaultContext.systemMessage);
  const updateSystemMessage = (content: string) => {
    setSystemMessage({
      role: "system",
      content,
    });
  };



  // Messages
  const [messages, setMessages] = React.useState<OpenAIChatMessage[]>([]);

  const submit = useCallback(
    async (messages_: OpenAIChatMessage[] = []) => {
      if (loading) return;
      setLoading(true);

      messages_ = messages_.length ? messages_ : messages;

      try {
        const decoder = new TextDecoder();
        const { body, ok } = await fetch("/api/completion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ApiKey}`,
          },
          body: JSON.stringify({
            ...config,
            messages: [systemMessage, ...messages_].map(
              ({ role, content }) => ({
                role,
                content,
              })
            ),
          }),
        });

        if (!body) return;
        const reader = body.getReader();

        if (!ok) {
          // Get the error message from the response body
          const { value } = await reader.read();
          const chunkValue = decoder.decode(value);
          const { error } = JSON.parse(chunkValue);

          throw new Error(
            error?.message ||
              "Failed to fetch response, check your API key and try again."
          );
        }

        let done = false;

        const message = {
          id: messages_.length,
          role: "assistant",
          content: "",
        } as OpenAIChatMessage;

        setMessages((prev) => {
          message.id = prev.length;
          return [...prev, message];
        });

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          message.content += chunkValue;

          updateMessageContent(message.id as number, message.content);
        }
      } catch (error: any) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              id: prev.length,
              role: "assistant",
              content: error.message,
            },
          ];
        });
      }

      setLoading(false);
    },
    [config, messages, systemMessage, loading]
  );

  const addMessage = useCallback(
    (
      content: string = "",
      submit_: boolean = false,
      role: "user" | "assistant" = "user"
    ) => {
      setMessages((prev) => {
        const messages = [
          ...prev,
          {
            id: prev.length,
            role,
            content: content || "",
          } as OpenAIChatMessage,
        ];
        submit_ && submit(messages);
        return messages;
      });
    },
    [submit]
  );

  const updateMessageContent = (id: number, content: string) => {
    setMessages((prev) => {
      const index = prev.findIndex((message) => message.id === id);
      if (index === -1) return prev;
      const message = prev[index];
      return [
        ...prev.slice(0, index),
        {
          ...message,
          content,
        },
        ...prev.slice(index + 1),
      ];
    });
  };

  const removeMessage = (id: number) => {
    setMessages((prev) => {
      return [...prev.filter((message) => message.id !== id)];
    });
  };



  // Roles

  const toggleMessageRole = (id: number) => {
    setMessages((prev) => {
      const index = prev.findIndex((message) => message.id === id);
      if (index === -1) return prev;
      const message = prev[index];
      return [
        ...prev.slice(0, index),
        {
          ...message,
          role: message.role === "user" ? "assistant" : "user",
        },
        ...prev.slice(index + 1),
      ];
    });
  };



  // Conversation 
  const [conversationId, setConversationId] = React.useState<string>("");
  const [conversationName, setConversationName] = React.useState("");
  const updateConversationName = (id: string, name: string) => {
    setConversations((prev) => {
      const conversation = prev[id];
      if (!conversation) return prev;
      return {
        ...prev,
        [id]: {
          ...conversation,
          name,
        },
      };
    });
    if (id === conversationId) setConversationName(name);
    updateConversation(id, { name });
  };

  const handleStoreConversation = useCallback(() => {
    if (messages.length === 0) return;

    const conversation = {
      name: conversationName,
      systemMessage,
      messages,
      config,
      lastMessage: Date.now(),
    } as Conversation;

    let id = storeConversation(conversationId, conversation);
    setConversationId(id);
    setConversations((prev) => ({ ...prev, [id]: conversation }));

    if (router.pathname === CHAT_ROUTE) router.push(`/chat/${id}`);
  }, [conversationId, messages]);

  useEffect(() => {
    handleStoreConversation();
  }, [messages, systemMessage, config]);

  const generateTitle = useCallback(async () => {
    
    setConversationName("...");
    let name = messages[0].content;
    const titlePrompt = `Summarize the following text in exactly three words, maintaining the language of the statement (usually french):
      <TEXT>
      ${name}
      </TEXT>`;

    const payload: OpenAIRequest = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: titlePrompt }],
      max_tokens: 10,
      temperature: 0.7,
    };

    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ApiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const name = await response.text();
      setConversationName(name);

    } catch (error) {
      console.error("Error generating title:", error);
      name = "New Conversation"; // Fallback title in case of error
    }
  
  }, [conversationId, messages]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'user') {
      generateTitle();
    }
  }, [messages]);

  const loadConversation = (id: string, conversation: Conversation) => {
    setConversationId(id);

    const { systemMessage, messages, config, name } = conversation;

    setSystemMessage(systemMessage);
    setMessages(messages);
    updateConfig(config);
    setConversationName(name);
  };

  const resetConversation = useCallback(() => {
    const newId = Date.now().toString();

    setConversationId(newId);
    setConversationName("...");
    setSystemMessage(defaultContext.systemMessage);
    setMessages([]);
    setConfig(defaultConfig);

    // Créer une nouvelle conversation
    const newConversation: Conversation = {
      name: "...",
      systemMessage: defaultContext.systemMessage,
      messages: [],
      config: defaultConfig,
      lastMessage: Date.now(),
    };

    // Mettre à jour l'historique des conversations
    setConversations(prev => ({
      ...prev,
      [newId]: newConversation
    }));

    // Stocker la nouvelle conversation
    storeConversation(newId, newConversation);

    // Rediriger vers la nouvelle conversation
    router.push(`/chat/${newId}`);
  }, [router]);

  const deleteConversation = (id: string) => {
    deleteConversationFromHistory(id);
    setConversations((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    if (id === conversationId) clearConversation();
  };

  const clearConversation = () => {
    setMessages([]);
    setSystemMessage(defaultContext.systemMessage);
    setConversationId("");
  };



  // Conversations
  const [conversations, setConversations] = React.useState<History>({} as History);

  // Load conversation from local storage
  useEffect(() => {
    setConversations(getHistory());
  }, []);
  
  


  const [error] = React.useState("");

  const value = React.useMemo(
    () => ({
      loading,
      config,
      updateConfig,
      
      systemMessage,
      updateSystemMessage,
      
      messages,
      submit,
      addMessage,
      updateMessageContent,
      removeMessage,
      
      toggleMessageRole,

      conversationId,
      conversationName,
      updateConversationName,
      generateTitle,
      loadConversation,
      deleteConversation,
      resetConversation,
      clearConversation,
      conversations,
      
      error,
    }),
    [
      loading,
      config,

      systemMessage,

      messages,
      submit,
      addMessage,

      conversationId,
      resetConversation,

      conversations,

      error,
    ]
  );

  return (
    <OpenAIContext.Provider value={value}>{children}</OpenAIContext.Provider>
  );
}

export const useOpenAI = () => React.useContext(OpenAIContext);
