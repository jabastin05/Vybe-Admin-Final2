import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { AdminLayout } from '../components/AdminLayout';
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

export function AdminCaseChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCase, updateCase } = useCases();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const caseItem = getCase(id || '');
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // Clear unread messages when admin opens the chat
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
      senderName: 'Admin Team',
      message: 'Hello! This is the admin support team for case ' + (caseItem?.caseId || '') + '. How can we assist the client today?',
      timestamp: new Date('2026-03-18T10:30:00'),
    },
    {
      id: '2',
      sender: 'user',
      senderName: caseItem?.userName || 'Client',
      message: 'Hi! I wanted to check on the status of my property tax filing.',
      timestamp: new Date('2026-03-18T10:35:00'),
    },
    {
      id: '3',
      sender: 'support',
      senderName: 'Admin Team',
      message: 'Great question! The property tax filing is currently in progress. We have collected all necessary documents and are preparing the submission. Expected completion is within 3-5 business days.',
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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="vybe-page-title mb-4">Case not found</h2>
            <Link
              to="/admin/cases"
              className="text-primary-700 hover:text-primary-600 text-small font-medium"
            >
              Back to Case Management
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleSendMessage = () => {
    if (!messageText.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'support',
      senderName: 'Admin Team',
      message: messageText,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type.split('/')[1].toUpperCase()
      })) : undefined
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.toLowerCase().includes('pdf')) return FileText;
    if (type.toLowerCase().includes('image')) return FileImage;
    return File;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/admin/cases/${id}`}
          className="inline-flex items-center gap-2 text-small text-muted-foreground
                     hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Details
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="text-caption uppercase font-medium text-muted-foreground tracking-wider mb-2">
              Case Chat
            </div>
            <h1 className="text-h1 text-foreground leading-none mb-2">
              {caseItem.caseId}
            </h1>
            <p className="text-small text-muted-foreground">
              {caseItem.propertyName} • {caseItem.userName || 'Client'}
            </p>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-5 py-3 rounded-[var(--radius)] border ${
            caseItem.status === 'Open'
              ? 'bg-primary-700/10 text-primary-700 dark:text-primary-400 border-primary-700/20'
              : 'bg-muted text-muted-foreground border-border'
          }`}>
            {caseItem.status === 'Open' ? (
              <Clock className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span className="text-small font-medium">{caseItem.status}</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="vybe-card overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => {
            const isSupport = message.sender === 'support';
            
            return (
              <div
                key={message.id}
                className={`flex gap-4 ${isSupport ? 'justify-start' : 'justify-end'}`}
              >
                {/* Avatar (only for support/admin) */}
                {isSupport && (
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-small font-medium text-purple-600 dark:text-purple-400">
                      A
                    </span>
                  </div>
                )}

                {/* Message Content */}
                <div className={`max-w-[70%] ${isSupport ? '' : 'flex flex-col items-end'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-caption font-medium text-foreground">
                      {message.senderName}
                    </span>
                    <span className="text-caption text-muted-foreground">
                      {message.timestamp.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div
                    className={`rounded-[var(--radius-card)] px-4 py-3 ${
                      isSupport
                        ? 'bg-muted border border-border'
                        : 'bg-primary-700 text-neutral-0'
                    }`}
                  >
                    <p className={`text-small ${isSupport ? 'text-foreground' : 'text-neutral-0'}`}>
                      {message.message}
                    </p>
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => {
                        const FileIcon = getFileIcon(attachment.type);
                        
                        return (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-3 p-3 bg-muted border border-border rounded-[var(--radius)]"
                          >
                            <div className="w-10 h-10 rounded-[var(--radius)] bg-primary-700/10 flex items-center justify-center flex-shrink-0">
                              <FileIcon className="w-5 h-5 text-primary-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-small text-foreground font-medium truncate">
                                {attachment.name}
                              </div>
                              <div className="text-caption text-muted-foreground">
                                {attachment.size}
                              </div>
                            </div>
                            <button className="vybe-icon-btn">
                              <Download className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Avatar (only for client messages) */}
                {!isSupport && (
                  <div className="w-10 h-10 rounded-full bg-primary-700/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-small font-medium text-primary-700 dark:text-primary-400">
                      {caseItem.userName?.[0] || 'C'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          {/* Attachment Preview */}
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((file, index) => {
                const FileIcon = getFileIcon(file.type);

                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-[var(--radius-sm)]"
                  >
                    <FileIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-caption text-foreground">{file.name}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-0.5 hover:bg-neutral-900/10 dark:hover:bg-card/10 rounded"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-muted hover:bg-accent rounded-[var(--radius)] transition-colors flex-shrink-0"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 vybe-input resize-none"
            />

            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() && attachments.length === 0}
              className="h-[var(--button-height-desktop)] px-[var(--space-3)] bg-primary-700 hover:opacity-90 disabled:bg-muted disabled:hover:bg-muted rounded-[var(--radius-button)] transition-colors flex-shrink-0 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="w-5 h-5 text-neutral-0" />
            </button>
          </div>

          <p className="text-caption text-muted-foreground mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
