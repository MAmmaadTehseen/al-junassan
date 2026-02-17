"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Mail, MailOpen, Loader2 } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
  }, [supabase]);

  const markAsRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
  };

  const handleSelect = (msg: Message) => {
    setSelected(msg.id === selected ? null : msg.id);
    if (!msg.is_read) markAsRead(msg.id);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages</h1>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No messages yet</div>
        ) : (
          <div className="divide-y">
            {messages.map((msg) => (
              <div key={msg.id}>
                <button
                  onClick={() => handleSelect(msg)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {msg.is_read ? (
                        <MailOpen className="w-5 h-5 text-gray-300" />
                      ) : (
                        <Mail className="w-5 h-5 text-gold-500" />
                      )}
                      <div>
                        <p className={`font-medium ${msg.is_read ? "text-gray-600" : "text-gray-900"}`}>
                          {msg.name}
                        </p>
                        <p className="text-xs text-gray-400">{msg.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {!msg.is_read && <Badge variant="gold">New</Badge>}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(msg.created_at).toLocaleDateString("en-PK")}
                      </p>
                    </div>
                  </div>
                </button>
                {selected === msg.id && (
                  <div className="px-4 pb-4 ml-8">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {msg.phone && (
                        <p className="text-sm text-gray-500">Phone: {msg.phone}</p>
                      )}
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
