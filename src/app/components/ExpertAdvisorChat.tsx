import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, FileText, AlertTriangle, CheckCircle2, X, User, Bot, ArrowRight, Clock, Shield, Phone } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'advisor' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  requiresConfirmation?: boolean;
  confirmationData?: {
    action: string;
    impact: string;
    risks?: string[];
  };
  escalationAvailable?: boolean;
}

interface ExpertAdvisorChatProps {
  onClose?: () => void;
  propertyContext?: {
    id: string;
    caseId: string;
    location: string;
  };
}

export function ExpertAdvisorChat({ onClose, propertyContext }: ExpertAdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'advisor',
      content: `Good ${getTimeOfDay()}, I'm your VYBE Strategic Advisor. I provide institutional-grade counsel on portfolio optimization, risk mitigation, and execution strategy.${propertyContext ? `\n\nI see you're reviewing **${propertyContext.caseId}** in ${propertyContext.location}. How may I assist with this asset?` : '\n\nHow may I assist you today?'}`,
      timestamp: new Date(),
      suggestions: propertyContext 
        ? [
            'What are the key risks for this property?',
            'Optimize monetization strategy',
            'Compare with portfolio benchmarks',
            'Review regulatory compliance status'
          ]
        : [
            'Analyze my portfolio performance',
            'Identify highest-priority opportunities',
            'Review critical alerts across assets',
            'Compare properties by ROI potential'
          ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate advisor response
    setIsTyping(true);
    setTimeout(() => {
      const advisorResponse = generateAdvisorResponse(message);
      setMessages(prev => [...prev, advisorResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAdvisorResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();

    // Strategic pushback examples
    if (input.includes('sell') || input.includes('exit')) {
      return {
        id: Date.now().toString(),
        type: 'advisor',
        content: `I need to counsel caution here. While liquidity events are valuable, premature exits can forfeit substantial appreciation.\n\nBased on my analysis:\n\n**Current Market Timing:** Q1 2026 shows moderate demand, but historical patterns suggest Q2-Q3 peak pricing windows.\n\n**Opportunity Cost:** Exiting now vs. 90-day delay could result in 12-18% valuation gap based on comparable transaction data.\n\n**Strategic Alternative:** Consider a partial stake sale or structured JV to maintain upside exposure while accessing liquidity.\n\nWould you like me to model these scenarios with specific financial projections?`,
        timestamp: new Date(),
        suggestions: [
          'Yes, show me scenario analysis',
          'What are the tax implications?',
          'Connect me with a human advisor',
        ],
        escalationAvailable: true,
      };
    }

    if (input.includes('risk') || input.includes('alert')) {
      return {
        id: Date.now().toString(),
        type: 'advisor',
        content: `I've identified **2 critical alerts** requiring immediate executive attention:\n\n**1. Title Encumbrance (VYBE-2026-018)**\n• Severity: Critical\n• Impact: 6% land area at risk\n• Timeline: 58 days to statutory limitation\n• Recommendation: Engage specialized property counsel within 7 business days\n\n**2. Environmental Clearance Delay (VYBE-2025-089)**\n• Severity: High\n• Impact: ₹8-12 Cr cost escalation risk\n• Timeline: 90-day delay probability at 68%\n• Recommendation: Retain expeditor consultant and prepare contingency financing\n\nBoth issues require documented action plans. Shall I draft executive briefings for your legal and project teams?`,
        timestamp: new Date(),
        requiresConfirmation: true,
        confirmationData: {
          action: 'Generate Executive Risk Briefings',
          impact: 'Will create 2 detailed briefing documents and notify assigned partners',
          risks: [
            'Briefings will reference sensitive legal matters',
            'Partner notifications are irreversible once sent',
          ],
        },
        suggestions: [
          'Yes, generate briefings',
          'Show me detailed risk analysis first',
          'Escalate to human advisor',
        ],
      };
    }

    if (input.includes('optimize') || input.includes('strategy')) {
      return {
        id: Date.now().toString(),
        type: 'advisor',
        content: `I've completed portfolio-wide HABU (Highest & Best Use) analysis. Here's my strategic counsel:\n\n**Immediate Value Capture (0-90 days):**\n• VYBE-2026-001 (Mumbai): Exit window optimal. Market demand +23% YoY. Recommended action: List for sale/JV by April 15.\n• VYBE-2026-012 (Gurgaon): Pre-sale launch opportunity. 85% absorption probability. Fast-track approvals.\n\n**Medium-Term Repositioning (90-180 days):**\n• VYBE-2026-015 (Pune): Industrial lease conversion. 4 enterprise tenants identified. Build-to-Suit model yields 12-15% returns.\n\n**Hold & Monitor:**\n• VYBE-2026-018 (Chennai): Resolve title issue before monetization. 91-score HABU potential post-resolution.\n\n**Portfolio Impact:** Combined strategy projects +₹47 Cr incremental value vs. current trajectory.\n\nShall I prepare detailed execution roadmaps for the immediate-action items?`,
        timestamp: new Date(),
        suggestions: [
          'Yes, create execution roadmaps',
          'Show me comparable transaction data',
          'What are the execution risks?',
        ],
      };
    }

    if (input.includes('compare') || input.includes('benchmark')) {
      return {
        id: Date.now().toString(),
        type: 'advisor',
        content: `**Portfolio Benchmark Analysis (Top Quartile UHNI Portfolios)**\n\nYour portfolio performance relative to peer benchmarks:\n\n✓ **Risk-Adjusted Returns:** 24.2% vs. 18.7% peer avg. (+5.5pp)\n✓ **Capital Efficiency:** Top 15th percentile\n✓ **Regulatory Compliance:** 94% vs. 82% peer avg.\n\n⚠ **Areas for Improvement:**\n• Average hold period: 18 months vs. optimal 24-30 months\n• Pre-sale conversion rate: 67% vs. peer best 78%\n• Partner execution velocity: 82 days avg. vs. peer best 65 days\n\n**Strategic Recommendation:** Your portfolio is outperforming on returns but has optimization potential in execution velocity. I recommend strengthening partner vetting criteria and implementing milestone-based incentive structures.\n\nWould you like me to draft revised partner selection criteria?`,
        timestamp: new Date(),
        suggestions: [
          'Yes, draft new partner criteria',
          'Show me detailed velocity analysis',
          'How do I improve pre-sale conversion?',
        ],
      };
    }

    // Default intelligent response
    return {
      id: Date.now().toString(),
      type: 'advisor',
      content: `I understand you're inquiring about "${userInput}". Let me provide strategic context:\n\nBased on your portfolio data and current market conditions, I recommend we focus on:\n\n1. **Risk Mitigation:** Address the 2 critical alerts requiring immediate action\n2. **Value Optimization:** Capitalize on the Mumbai exit window (45-day optimal timing)\n3. **Execution Excellence:** Accelerate the Gurgaon pre-sale launch (14-day action window)\n\nEach of these items has significant financial impact. Which area would you like me to analyze in depth?`,
      timestamp: new Date(),
      suggestions: [
        'Tell me more about the Mumbai opportunity',
        'What are the Gurgaon pre-sale specifics?',
        'Focus on risk mitigation',
      ],
    };
  };

  const handleConfirm = (messageId: string) => {
    const confirmMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: '✓ Action confirmed. Generating executive briefings and notifying assigned partners...',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, confirmMessage]);
    setPendingConfirmation(null);

    setTimeout(() => {
      const completionMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'advisor',
        content: `**Action Completed**\n\nI've generated comprehensive executive briefings for both critical alerts:\n\n📄 **Title Encumbrance Brief (VYBE-2026-018)**\n• 4-page executive summary with recommended counsel shortlist\n• Legal timeline and mitigation strategy\n• Sent to: Your legal team + Property counsel panel\n\n📄 **EC Delay Risk Brief (VYBE-2025-089)**\n• SEIAA backlog analysis and expeditor options\n• Contingency financing scenarios\n• Sent to: Project team + Regulatory consultants\n\nBoth teams have been notified and will respond within 24 hours. I'll monitor their progress and alert you to any delays.\n\nIs there anything else I can assist with?`,
        timestamp: new Date(),
        suggestions: [
          'Set up progress tracking for these alerts',
          'What other risks should I monitor?',
          'Return to portfolio overview',
        ],
      };
      setMessages(prev => [...prev, completionMessage]);
    }, 2000);
  };

  const handleEscalate = () => {
    const escalationMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: '🔄 Escalating to human advisor...',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, escalationMessage]);

    setTimeout(() => {
      const humanMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'advisor',
        content: `I've connected you with **Rajesh Malhotra**, Senior Portfolio Strategist.\n\nRajesh has 18+ years in UHNI real estate advisory and has been briefed on your portfolio context. He'll reach out within 2 hours via:\n\n📞 Direct: +91-XXXX-XXXX-XX\n📧 Email: r.malhotra@vybe.capital\n💬 Secure Chat: Available now\n\nIn the interim, I'll continue monitoring your portfolio and will alert you to any time-sensitive matters.\n\nIs there anything else I can help with while you wait?`,
        timestamp: new Date(),
        suggestions: [
          'Send Rajesh my current questions',
          'Continue AI analysis in the meantime',
          'Schedule a video consultation',
        ],
      };
      setMessages(prev => [...prev, humanMessage]);
    }, 1500);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-white dark:bg-[#0a0a0a] border-l border-black/[0.06] dark:border-white/[0.08] shadow-[-8px_0_32px_rgba(0,0,0,0.12)] dark:shadow-[-8px_0_32px_rgba(0,0,0,0.6)] flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[14px] font-medium text-black dark:text-white">
              Expert Advisor
            </div>
            <div className="text-[11px] text-black/50 dark:text-white/50 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Strategic AI Counsel
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-black/60 dark:text-white/60" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === 'user' && (
              <div className="flex gap-3 justify-end">
                <div className="flex flex-col items-end max-w-[80%]">
                  <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <div className="text-[10px] text-black/40 dark:text-white/40 mt-1.5">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            {message.type === 'advisor' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col max-w-[85%]">
                  <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-black/[0.03] to-black/[0.06] dark:from-white/[0.03] dark:to-white/[0.06] border border-black/[0.06] dark:border-white/[0.08]">
                    <p className="text-[13px] leading-relaxed text-black dark:text-white/95 whitespace-pre-wrap">
                      {message.content.split('**').map((part, i) => 
                        i % 2 === 0 ? part : <strong key={i} className="font-medium">{part}</strong>
                      )}
                    </p>
                  </div>
                  <div className="text-[10px] text-black/40 dark:text-white/40 mt-1.5">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {/* Confirmation Required */}
                  {message.requiresConfirmation && message.confirmationData && (
                    <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                      <div className="flex items-start gap-2 mb-3">
                        <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[11px] font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                            Confirmation Required
                          </div>
                          <div className="text-[12px] text-black dark:text-white/95 font-medium mb-1">
                            {message.confirmationData.action}
                          </div>
                          <div className="text-[11px] text-black/60 dark:text-white/60 mb-2">
                            {message.confirmationData.impact}
                          </div>
                          {message.confirmationData.risks && (
                            <div className="space-y-1 mb-3">
                              {message.confirmationData.risks.map((risk, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-orange-600 dark:text-orange-400">
                                  <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                  {risk}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirm(message.id)}
                              className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white text-[12px] font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Confirm & Execute
                            </button>
                            <button
                              onClick={() => setPendingConfirmation(null)}
                              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 text-[12px] font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Escalation Option */}
                  {message.escalationAvailable && (
                    <button
                      onClick={handleEscalate}
                      className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[12px] font-medium hover:bg-blue-500/20 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Connect with Human Advisor
                    </button>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(suggestion)}
                          className="w-full text-left px-4 py-2.5 rounded-xl bg-white dark:bg-[#111111] border border-black/[0.06] dark:border-white/[0.08] text-[12px] text-black/70 dark:text-white/70 hover:border-black/[0.12] dark:hover:border-white/[0.15] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all flex items-center justify-between group"
                        >
                          <span>{suggestion}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {message.type === 'system' && (
              <div className="flex justify-center">
                <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {message.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-black/[0.03] to-black/[0.06] dark:from-white/[0.03] dark:to-white/[0.06] border border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-black/[0.06] dark:border-white/[0.08] bg-gradient-to-r from-black/[0.01] to-black/[0.02] dark:from-white/[0.01] dark:to-white/[0.02]">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
            placeholder="Ask for strategic counsel..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-[#111111] border border-black/[0.06] dark:border-white/[0.08] text-[13px] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 dark:focus:border-purple-500/50 transition-colors"
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim()}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-[10px] text-black/40 dark:text-white/40 mt-2 text-center">
          Strategic AI counsel • Human verification available for all decisions
        </div>
      </div>
    </div>
  );
}
