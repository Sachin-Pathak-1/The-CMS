import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../utils/prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fallbackStorePath = path.resolve(__dirname, "..", "data", "chat-store.json");

const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  table: process.env.SUPABASE_CHAT_TABLE || "chat_messages",
};

const isSupabaseConfigured = () => Boolean(supabaseConfig.url && supabaseConfig.serviceRoleKey);

const ensureFallbackStore = async () => {
  try {
    await fs.access(fallbackStorePath);
  } catch {
    await fs.mkdir(path.dirname(fallbackStorePath), { recursive: true });
    await fs.writeFile(fallbackStorePath, JSON.stringify({ messages: [] }, null, 2), "utf8");
  }
};

const readFallbackStore = async () => {
  await ensureFallbackStore();
  const raw = await fs.readFile(fallbackStorePath, "utf8");
  return JSON.parse(raw);
};

const writeFallbackStore = async (store) => {
  await ensureFallbackStore();
  await fs.writeFile(fallbackStorePath, JSON.stringify(store, null, 2), "utf8");
};

const supabaseHeaders = () => ({
  apikey: supabaseConfig.serviceRoleKey,
  Authorization: `Bearer ${supabaseConfig.serviceRoleKey}`,
  "Content-Type": "application/json",
});

const normalizeMessage = (message) => ({
  id: message.id,
  senderId: message.sender_id || message.senderId,
  receiverId: message.receiver_id || message.receiverId,
  body: message.body,
  createdAt: message.created_at || message.createdAt,
});

const getConversationPair = (userId, memberId) => [
  { sender_id: userId, receiver_id: memberId },
  { sender_id: memberId, receiver_id: userId },
];

export const getChatMembers = async (currentUserId) => {
  const users = await prisma.user.findMany({
    where: { id: { not: currentUserId } },
    select: {
      id: true,
      username: true,
      type: true,
      userDetails: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  let messageRows = [];

  if (isSupabaseConfigured()) {
    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/${supabaseConfig.table}?or=(sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId})&order=created_at.desc`,
      { headers: supabaseHeaders() }
    );

    if (response.ok) {
      messageRows = (await response.json()).map(normalizeMessage);
    }
  } else {
    const store = await readFallbackStore();
    messageRows = store.messages
      .filter((message) => message.senderId === currentUserId || message.receiverId === currentUserId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return users.map((user) => {
    const latestMessage = messageRows.find((message) => message.senderId === user.id || message.receiverId === user.id);

    return {
      id: user.id,
      username: user.username,
      type: user.type,
      name: [user.userDetails?.firstName, user.userDetails?.lastName].filter(Boolean).join(" ").trim() || user.username,
      avatar: user.userDetails?.avatar || "",
      latestMessage: latestMessage?.body || "",
      latestMessageAt: latestMessage?.createdAt || null,
      latestSenderId: latestMessage?.senderId || null,
    };
  });
};

export const getConversationMessages = async (userId, memberId) => {
  if (isSupabaseConfigured()) {
    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/${supabaseConfig.table}?or=(and(sender_id.eq.${userId},receiver_id.eq.${memberId}),and(sender_id.eq.${memberId},receiver_id.eq.${userId}))&order=created_at.asc`,
      { headers: supabaseHeaders() }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chat messages");
    }

    const rows = await response.json();
    return rows.map(normalizeMessage);
  }

  const store = await readFallbackStore();
  return store.messages
    .filter((message) =>
      (message.senderId === userId && message.receiverId === memberId) ||
      (message.senderId === memberId && message.receiverId === userId))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const sendMessage = async (senderId, receiverId, body) => {
  const message = {
    id: `msg_${Date.now()}`,
    senderId,
    receiverId,
    body,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const response = await fetch(`${supabaseConfig.url}/rest/v1/${supabaseConfig.table}`, {
      method: "POST",
      headers: {
        ...supabaseHeaders(),
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
        body,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const [row] = await response.json();
    return normalizeMessage(row);
  }

  const store = await readFallbackStore();
  store.messages.push(message);
  await writeFallbackStore(store);
  return message;
};
