import API from "./api";

export const sendMessage = async (message: string, conversationId?: string) => {
  const res = await API.post("/chat/message", { message, conversationId });
  return res.data.data;
};

export const getConversations = async () => {
  const res = await API.get("/conversations");
  return res.data.data;
};

export const getConversation = async (id: string) => {
  const res = await API.get(`/conversations/${id}`);
  return res.data.data;
};

export const getConversationStats = async () => {
  const res = await API.get("/conversations/stats");
  return res.data.data;
};

export const deleteConversation = async (id: string) => {
  const res = await API.delete(`/conversations/${id}`);
  return res.data;
};
