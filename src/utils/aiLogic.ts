export type ResponseType = 
  | 'concrete-task'
  | 'time-intention'
  | 'aspiration'
  | 'indirect'
  | 'emotional';

export interface UserContext {
  goals: string[];
  values: string[];
  emotionalState: string[];
  constraints: string[];
  preferences: string[];
  timeCommitments: Array<{
    description: string;
    hours?: number;
    flexible: boolean;
  }>;
  fixedEvents: Array<{
    title: string;
    date: Date;
    time?: string;
  }>;
}

export interface ConversationMemory {
  phrasesUsed: Set<string>;
  questionsAsked: Set<string>;
  topicsDiscussed: Set<string>;
  userResponseStyle: 'detailed' | 'brief' | 'mixed';
  conversationEnergy: 'high' | 'medium' | 'low';
  messageCount: number;
}

export interface ConversationState {
  stage: 'initial' | 'gathering-context' | 'understanding-goals' | 'building-schedule' | 'refining';
  contextCompleteness: number;
  lastResponseType: ResponseType | null;
  needsFollowUp: boolean;
  userContext: UserContext;
  memory: ConversationMemory;
}

export class AILogic {
  private conversationState: ConversationState;

  constructor() {
    this.conversationState = {
      stage: 'initial',
      contextCompleteness: 0,
      lastResponseType: null,
      needsFollowUp: false,
      userContext: {
        goals: [],
        values: [],
        emotionalState: [],
        constraints: [],
        preferences: [],
        timeCommitments: [],
        fixedEvents: []
      },
      memory: {
        phrasesUsed: new Set(),
        questionsAsked: new Set(),
        topicsDiscussed: new Set(),
        userResponseStyle: 'mixed',
        conversationEnergy: 'medium',
        messageCount: 0
      }
    };
  }

  private hasUsedPhrase(phrase: string): boolean {
    const normalized = phrase.toLowerCase().trim();
    return this.conversationState.memory.phrasesUsed.has(normalized);
  }

  private markPhraseUsed(phrase: string): void {
    const normalized = phrase.toLowerCase().trim();
    this.conversationState.memory.phrasesUsed.add(normalized);
  }

  private hasAskedQuestion(question: string): boolean {
    const normalized = question.toLowerCase().replace(/[?!.]/g, '').trim();
    return this.conversationState.memory.questionsAsked.has(normalized);
  }

  private markQuestionAsked(question: string): void {
    const normalized = question.toLowerCase().replace(/[?!.]/g, '').trim();
    this.conversationState.memory.questionsAsked.add(normalized);
  }

  private analyzeUserResponseStyle(message: string): void {
    const wordCount = message.split(/\s+/).length;
    this.conversationState.memory.messageCount++;

    if (wordCount > 30) {
      this.conversationState.memory.userResponseStyle = 'detailed';
      this.conversationState.memory.conversationEnergy = 'high';
    } else if (wordCount < 10) {
      this.conversationState.memory.userResponseStyle = 'brief';
      this.conversationState.memory.conversationEnergy = 'low';
    } else {
      this.conversationState.memory.userResponseStyle = 'mixed';
      this.conversationState.memory.conversationEnergy = 'medium';
    }
  }

  private getVariedGreeting(): string {
    const greetings = [
      "Hi! I'm PLANelope, your AI scheduling companion. I'm here to help you build a schedule that actually works for your life — not just fill up a calendar. Let's start with what matters to you. What are your main goals or priorities this week?",
      "Hey there! I'm PLANelope. Instead of just cramming tasks into a calendar, I want to help you design a week that aligns with what actually matters to you. What's been on your mind lately?",
      "Welcome! I'm PLANelope, and I'm here to help you think through your week in a way that feels sustainable. What's coming up that you want to make sure you have time for?",
      "Hi! I'm PLANelope. Rather than starting with a blank calendar, let's talk about what you're trying to accomplish. What's one thing you really want to make progress on this week?",
      "Hey! I'm PLANelope, your scheduling companion. I don't believe in one-size-fits-all schedules, so let's start with you. What does a good week look like for you right now?"
    ];

    const randomIndex = Math.floor(Math.random() * greetings.length);
    const greeting = greetings[randomIndex];
    this.markPhraseUsed(greeting);
    return greeting;
  }

  classifyResponse(userMessage: string): ResponseType {
    const message = userMessage.toLowerCase();

    const timePatterns = [
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/,
      /\b\d{1,2}(am|pm|:\d{2})\b/,
      /\b(meeting|class|appointment|deadline)\b/,
      /\bon\s+\w+\s+at\s+\d/
    ];
    if (timePatterns.some(pattern => pattern.test(message))) {
      return 'concrete-task';
    }

    const timeIntentionPatterns = [
      /\b\d+\s*(hours?|hrs?)\b/,
      /\bspend.*time\b/,
      /\bwork.*for\b/,
      /\bstudy.*\d+\b/
    ];
    if (timeIntentionPatterns.some(pattern => pattern.test(message))) {
      return 'time-intention';
    }

    const aspirationPatterns = [
      /\b(want to|hope to|trying to|goal is)\b/,
      /\b(excel|improve|become|achieve)\b/,
      /\b(better at|good at|master)\b/
    ];
    if (aspirationPatterns.some(pattern => pattern.test(message))) {
      return 'aspiration';
    }

    const emotionalPatterns = [
      /\b(tired|exhausted|stressed|overwhelmed|anxious)\b/,
      /\b(feeling|felt|been)\b.*\b(rough|hard|difficult|tough)\b/,
      /\b(behind|struggling|can't keep up)\b/
    ];
    if (emotionalPatterns.some(pattern => pattern.test(message))) {
      return 'emotional';
    }

    return 'indirect';
  }

  generateAcknowledgment(responseType: ResponseType, userMessage: string): string {
    const message = userMessage.toLowerCase();
    let acknowledgments: string[] = [];

    switch (responseType) {
      case 'concrete-task':
        acknowledgments = [
          "Got it, I'll make note of that.",
          "Noted — I'll keep that in mind.",
          "Okay, that's locked in.",
          "Perfect, I have that down."
        ];
        break;

      case 'time-intention':
        if (message.includes('40 hours') || message.includes('study')) {
          acknowledgments = [
            "That's a significant time commitment. Rather than blocking out one massive chunk, let's think about how to distribute that realistically across your week — around your other commitments and energy levels.",
            "That's quite a bit of time. Instead of one giant block, we should probably break that into manageable pieces that fit around everything else you have going on.",
            "Okay, that's substantial. Let's figure out how to spread that across your week in a way that doesn't burn you out."
          ];
        } else {
          acknowledgments = [
            "I hear you want to dedicate time to this. Let's figure out how to fit that in naturally, not just as one big block.",
            "Got it. We'll need to find the right spots in your week where this actually fits without overwhelming everything else.",
            "Understood. Let's think about when you'll realistically have the energy and space for this."
          ];
        }
        break;

      case 'aspiration':
        if (message.includes('excel')) {
          acknowledgments = [
            "That's a meaningful goal — and it's actually more about how you spend your time overall than any single task. I'll keep that in mind as we build your schedule.",
            "I appreciate that. Excellence isn't about cramming more in — it's about being intentional with your time. That'll guide how we structure things.",
            "That matters. Real progress comes from consistency, not just intensity. We'll design around that."
          ];
        } else {
          acknowledgments = [
            "I appreciate you sharing that. This tells me what matters to you, which will help me prioritize your time in a way that aligns with what you care about.",
            "Thank you for that context. Knowing what you value helps me suggest a schedule that actually serves your goals.",
            "That's helpful to know. Your priorities should shape your schedule, not the other way around."
          ];
        }
        break;

      case 'emotional':
        if (message.includes('tired') || message.includes('exhausted')) {
          acknowledgments = [
            "I hear you. That tells me we need to be realistic about what you can actually handle right now — not pack your schedule too tight. Rest is legitimate and necessary.",
            "That's important context. When you're running on empty, the schedule needs to support recovery, not add more pressure.",
            "Understood. We need to build in breathing room, not just fill every gap. You can't pour from an empty cup."
          ];
        } else if (message.includes('behind') || message.includes('overwhelmed')) {
          acknowledgments = [
            "That's really important context. It sounds like you need a schedule that helps you catch up without burning out — not one that adds more pressure.",
            "I hear that. The goal here isn't to pile on more — it's to help you regain some control without making things worse.",
            "Thank you for being honest about that. We need a plan that reduces overwhelm, not amplifies it."
          ];
        } else {
          acknowledgments = [
            "Thank you for sharing that. How you're feeling matters, and it should inform how we structure your time.",
            "I appreciate you being open about that. Your emotional state is just as important as your task list.",
            "That's valuable context. A good schedule accounts for where you're at mentally and emotionally."
          ];
        }
        break;

      case 'indirect':
        acknowledgments = [
          "I appreciate you sharing that — it gives me helpful context about where you're at right now.",
          "That's useful to know. Every detail helps me understand what kind of schedule will actually work for you.",
          "Got it. The more I understand about your situation, the better I can tailor things to fit your life."
        ];
        break;
    }

    // Filter out already-used acknowledgments
    const unusedAcknowledgments = acknowledgments.filter(ack => !this.hasUsedPhrase(ack));
    
    // If all have been used, reset and use any
    const finalAcknowledgments = unusedAcknowledgments.length > 0 ? unusedAcknowledgments : acknowledgments;
    
    const selected = finalAcknowledgments[Math.floor(Math.random() * finalAcknowledgments.length)];
    this.markPhraseUsed(selected);
    return selected;
  }

  generateFollowUp(responseType: ResponseType, userMessage: string, context: UserContext): string | null {
    const message = userMessage.toLowerCase();
    let questions: string[] = [];

    // Check what we already know
    const hasGoals = context.goals.length > 0;
    const hasEmotionalContext = context.emotionalState.length > 0;
    const hasTimeCommitments = context.timeCommitments.length > 0;
    const hasFixedEvents = context.fixedEvents.length > 0;

    switch (responseType) {
      case 'aspiration':
        if (message.includes('excel')) {
          questions = [
            "Can I ask — when you picture excelling, what does that look like for you specifically? Is it grades, understanding the material, keeping up consistently, or something else?",
            "What would 'excelling' mean to you in practical terms? Better grades? Deeper understanding? Just staying on top of things?",
            "When you think about doing well, what's the marker for you? Is it performance, comprehension, or something else entirely?"
          ];
        } else {
          questions = [
            "What would success look like for you with this?",
            "How will you know when you're making real progress on this?",
            "What does 'good enough' look like here — what's the outcome you're aiming for?"
          ];
        }
        break;

      case 'time-intention':
        if (message.includes('hours')) {
          questions = [
            "How do you usually prefer to break up study time? Longer focused sessions, or shorter chunks throughout the day?",
            "Do you work better in long stretches, or do you prefer spreading things out in smaller blocks?",
            "What's your ideal session length? Some people need deep focus time, others do better with frequent breaks."
          ];
        } else {
          questions = [
            "When during the day do you typically have the most energy for this?",
            "Are you more of a morning person or do you hit your stride later in the day?",
            "When do you usually feel most focused — early, midday, or evening?"
          ];
        }
        break;

      case 'emotional':
        if (!hasGoals) {
          questions = [
            "Given how you're feeling, what would be most helpful to focus on this week? Just the essentials, or is there something specific you want to make progress on?",
            "What's the one thing that would make you feel less behind if you made progress on it?",
            "If you could only accomplish one thing this week, what would take the most weight off your shoulders?"
          ];
        } else {
          return null; // Don't pile on if we already have goals
        }
        break;

      case 'concrete-task':
        return null; // No follow-up needed for concrete tasks

      case 'indirect':
        if (!hasGoals) {
          questions = [
            "What's most important for you to accomplish this week?",
            "What's on your plate right now that you really need to make time for?",
            "If you had to pick one or two things to prioritize this week, what would they be?",
            "What's been taking up the most mental space for you lately?"
          ];
        } else if (!hasFixedEvents && !hasTimeCommitments) {
          questions = [
            "Are there any fixed commitments I should know about — classes, meetings, things you can't move?",
            "What's already locked into your schedule that we need to work around?",
            "Do you have any non-negotiable time blocks — things that are set in stone?"
          ];
        } else {
          return null; // We have enough context
        }
        break;
    }

    // Filter out already-asked questions
    const unaskedQuestions = questions.filter(q => !this.hasAskedQuestion(q));
    
    // If all questions have been asked, make an observation instead
    if (unaskedQuestions.length === 0) {
      return this.generateObservation(context);
    }

    const selected = unaskedQuestions[Math.floor(Math.random() * unaskedQuestions.length)];
    this.markQuestionAsked(selected);
    return selected;
  }

  private generateObservation(context: UserContext): string | null {
    const observations: string[] = [];

    if (context.goals.length > 0 && context.emotionalState.length > 0) {
      observations.push(
        `So it sounds like you want to ${context.goals[0]}, but you're also ${context.emotionalState[0]}. Does that feel like an accurate read?`
      );
    }

    if (context.timeCommitments.length > 0 && context.goals.length > 0) {
      observations.push(
        `From what you've shared, you're trying to balance ${context.goals[0]} with ${context.timeCommitments[0].description}. Am I understanding that right?`
      );
    }

    if (context.emotionalState.length > 0 && context.timeCommitments.length === 0) {
      observations.push(
        `You mentioned feeling ${context.emotionalState[0]}. Before we go further, are there any hard commitments in your schedule I should know about, or is it more about managing your energy?`
      );
    }

    if (observations.length === 0) {
      observations.push(
        "Based on what you've told me so far, I'm starting to get a picture of what you're working with. Is there anything else I should know before we start mapping out your week?"
      );
    }

    const unusedObservations = observations.filter(obs => !this.hasUsedPhrase(obs));
    const finalObservations = unusedObservations.length > 0 ? unusedObservations : observations;

    const selected = finalObservations[Math.floor(Math.random() * finalObservations.length)];
    this.markPhraseUsed(selected);
    return selected;
  }

  updateContext(responseType: ResponseType, userMessage: string): void {
    const message = userMessage.toLowerCase();

    switch (responseType) {
      case 'aspiration':
        this.conversationState.userContext.goals.push(userMessage);
        this.conversationState.userContext.values.push(userMessage);
        this.conversationState.memory.topicsDiscussed.add('goals');
        break;

      case 'emotional':
        this.conversationState.userContext.emotionalState.push(userMessage);
        this.conversationState.memory.topicsDiscussed.add('emotional-state');
        break;

      case 'time-intention':
        const hoursMatch = message.match(/(\d+)\s*(hours?|hrs?)/);
        this.conversationState.userContext.timeCommitments.push({
          description: userMessage,
          hours: hoursMatch ? parseInt(hoursMatch[1]) : undefined,
          flexible: true
        });
        this.conversationState.memory.topicsDiscussed.add('time-commitments');
        break;

      case 'concrete-task':
        this.conversationState.userContext.fixedEvents.push({
          title: userMessage,
          date: new Date(),
          time: undefined
        });
        this.conversationState.memory.topicsDiscussed.add('fixed-events');
        break;

      case 'indirect':
        this.conversationState.userContext.preferences.push(userMessage);
        break;
    }

    const contextItems = 
      this.conversationState.userContext.goals.length +
      this.conversationState.userContext.emotionalState.length +
      this.conversationState.userContext.timeCommitments.length +
      this.conversationState.userContext.fixedEvents.length;

    this.conversationState.contextCompleteness = Math.min(100, contextItems * 15);

    if (this.conversationState.contextCompleteness < 30) {
      this.conversationState.stage = 'gathering-context';
    } else if (this.conversationState.contextCompleteness < 60) {
      this.conversationState.stage = 'understanding-goals';
    } else {
      this.conversationState.stage = 'building-schedule';
    }
  }

  processUserMessage(userMessage: string): { acknowledgment: string; followUp: string | null } {
    this.analyzeUserResponseStyle(userMessage);
    
    const responseType = this.classifyResponse(userMessage);
    this.conversationState.lastResponseType = responseType;

    const acknowledgment = this.generateAcknowledgment(responseType, userMessage);
    this.updateContext(responseType, userMessage);
    const followUp = this.generateFollowUp(
      responseType, 
      userMessage, 
      this.conversationState.userContext
    );

    this.conversationState.needsFollowUp = followUp !== null;

    return { acknowledgment, followUp };
  }

  getInitialGreeting(): string {
    return this.getVariedGreeting();
  }

  getConversationState(): ConversationState {
    return this.conversationState;
  }

  shouldSuggestSchedule(): boolean {
    return this.conversationState.contextCompleteness >= 60 &&
           this.conversationState.stage === 'building-schedule';
  }
}
