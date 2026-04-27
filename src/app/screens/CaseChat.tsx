import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { SideNav } from '../components/SideNav';
import { useCases } from '../contexts/CasesContext';
import { ArrowLeft, Send, Paperclip, File, FileText, FileImage, X, Download, Clock, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'support';
  senderName: string;
  message: string;
  timestamp: Date;
  attachments?: {
    id: string;
    name: string;
    size: string;
    type: string;
  }[];
}

export function CaseChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCase, updateCase } = useCases();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const caseItem = getCase(id || '');
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // Clear unread messages when the user opens the chat
  useEffect(() => {
    if (caseItem && caseItem.unreadMessages && caseItem.unreadMessages > 0) {
      updateCase(caseItem.id, { unreadMessages: 0 });
    }
  }, [caseItem?.id]);
  
  // Mock messages - initial data
  const initialMessages: Message[] = [
    {
      id: '1',
      sender: 'support',
      senderName: 'Priya Sharma',
      message: 'Hello! I am Priya, your dedicated relationship manager for case ' + (caseItem?.caseId || '') + '. How can I assist you today?',
      timestamp: new Date('2026-03-18T10:30:00'),
    },
    {
      id: '2',
      sender: 'user',
      senderName: 'You',
      message: 'Hi Priya! I wanted to check on the status of my property tax filing.',
      timestamp: new Date('2026-03-18T10:35:00'),
    },
    {
      id: '3',
      sender: 'support',
      senderName: 'Priya Sharma',
      message: 'Great question! Your property tax filing is currently in progress. We have collected all necessary documents and are preparing the submission. Expected completion is within 3-5 business days.',
      timestamp: new Date('2026-03-18T10:40:00'),
      attachments: [
        {
          id: 'att1',
          name: 'Tax_Filing_Progress_Report.pdf',
          size: '2.4 MB',
          type: 'PDF'
        }
      ]
    },
  ];
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  if (!caseItem) {
    return (
      <div className="flex min-h-screen bg-background dark:bg-neutral-900">
        <SideNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-h2 text-foreground dark:text-neutral-0 mb-4">Case not found</h2>
            <Link 
              to="/cases"
              className="text-primary-700 hover:text-primary-600 text-small font-medium"
            >
              Back to Case Management
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!messageText.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      senderName: 'You',
      message: messageText,
      timestamp: new Date(),
      attachments: attachments.map((file, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Image' : 'File'
      }))
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type === 'PDF') return <FileText className="w-5 h-5 text-red-500" />;
    if (type === 'Image') return <FileImage className="w-5 h-5 text-purple-500" />;
    return <File className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-neutral-900">
      <SideNav />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card dark:bg-neutral-900 border-b border-black/5 dark:border-white/10 px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(`/case/${id}`)}
              className="flex items-center gap-2 text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-small font-medium">Back to Case Details</span>
            </button>
            
            <div>
              <div className="text-caption tracking-[0.05em] uppercase font-medium text-muted-foreground dark:text-neutral-300/60 mb-2">
                Case Chat
              </div>
              <h1 className="text-h1 tracking-tight text-foreground dark:text-neutral-0 leading-none mb-2">
                {caseItem.caseId}
              </h1>
              <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                {caseItem.subService || caseItem.serviceRequested} • {caseItem.propertyName}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Sender Name and Timestamp */}
                  <div className={`flex items-center gap-2 mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80">
                      {msg.senderName}
                    </span>
                    <span className="text-caption text-muted-foreground dark:text-neutral-300/60">
                      {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-[var(--radius-card)] px-5 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-primary-700 text-neutral-0'
                        : 'bg-card dark:bg-neutral-900 border border-black/5 dark:border-white/10 text-foreground dark:text-neutral-0'
                    }`}
                  >
                    <p className="text-small leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className={`flex items-center gap-3 p-3 rounded-[var(--radius-card)] ${
                              msg.sender === 'user'
                                ? 'bg-card/10'
                                : 'bg-neutral-900/[0.02] dark:bg-card/[0.02]'
                            }`}
                          >
                            {getFileIcon(att.type)}
                            <div className="flex-1 min-w-0">
                              <div className={`text-small font-medium truncate ${
                                msg.sender === 'user' ? 'text-neutral-0' : 'text-foreground dark:text-neutral-0'
                              }`}>
                                {att.name}
                              </div>
                              <div className={`text-caption ${
                                msg.sender === 'user' ? 'text-neutral-0/70' : 'text-neutral-700/80 dark:text-neutral-300/80'
                              }`}>
                                {att.size}
                              </div>
                            </div>
                            <button className={`p-2 rounded-[var(--radius)] transition-colors ${
                              msg.sender === 'user'
                                ? 'hover:bg-card/10'
                                : 'hover:bg-neutral-900/5 dark:hover:bg-card/5'
                            }`}>
                              <Download className={`w-4 h-4 ${
                                msg.sender === 'user' ? 'text-neutral-0' : 'text-neutral-700/80 dark:text-neutral-300/80'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-card dark:bg-neutral-900 border-t border-black/5 dark:border-white/10 px-8 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-700/10 dark:bg-primary-700/20 
                               border border-primary-700/20 rounded-[var(--radius)]"
                  >
                    <File className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                    <span className="text-caption text-primary-700 dark:text-primary-400 font-medium max-w-[200px] truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeAttachment(idx)}
                      className="p-0.5 hover:bg-primary-700/20 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-primary-700 dark:text-primary-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="flex items-end gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 
                           rounded-[var(--radius-card)] transition-colors text-neutral-700/80 dark:text-neutral-300/80 
                           hover:text-foreground dark:hover:text-neutral-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1 bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/10 dark:border-white/10 
                              rounded-[var(--radius-card)] overflow-hidden focus-within:border-primary-700/50 transition-colors">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message here..."
                  rows={1}
                  className="w-full px-4 py-3 bg-transparent text-small text-foreground dark:text-neutral-0 
                             placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none 
                             resize-none max-h-32"
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() && attachments.length === 0}
                className="p-3 bg-primary-700 hover:bg-primary-900 disabled:bg-neutral-900/10 dark:disabled:bg-card/10 
                           disabled:text-muted-foreground dark:disabled:text-neutral-300/60 text-neutral-0 rounded-[var(--radius-card)] 
                           transition-all shadow-[0_4px_12px_rgba(28,117,188,0.3)] 
                           hover:shadow-[0_6px_16px_rgba(28,117,188,0.4)] disabled:shadow-none 
                           disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 text-caption text-muted-foreground dark:text-neutral-300/60 text-center">
              Press Enter to send • Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}