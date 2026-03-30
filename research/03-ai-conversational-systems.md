# AI and Conversational Learning Systems

## From Intelligent Tutoring to Large Language Models: How AI-Driven Conversation Facilitates Learning

### 1. The Foundations: Intelligent Tutoring Systems (1970--Present)

The idea that computers could teach through dialogue dates to 1970, when Jaime Carbonell built SCHOLAR, a system that used Socratic questioning to tutor students on South American geography using natural-language text input and output. SCHOLAR marked a conceptual break from Computer-Assisted Instruction (CAI), which was rooted in Skinnerian behaviorism: rather than drilling students on fixed response sequences, SCHOLAR modeled knowledge as a semantic network and adapted its questions to the learner's answers. Through the 1970s and 1980s, successors such as SOPHIE (electronic troubleshooting), DEBUGGY (arithmetic errors), and WHY (causal reasoning) demonstrated the viability of AI-driven pedagogical dialogue across domains.

The most commercially successful lineage emerged from John Anderson's ACT-R theory of cognition at Carnegie Mellon University. Anderson and colleagues, notably Kenneth Koedinger, developed Cognitive Tutors that modeled student problem-solving step by step, providing immediate feedback and tracking multiple solution strategies. A landmark meta-analysis by Kulik and Fletcher (2016) examined 50 controlled evaluations and found that students receiving intelligent tutoring outperformed conventionally taught students in 92% of cases, with a median effect size of d = 0.66. VanLehn's (2011) meta-analysis further showed that step-based and substep-based ITS achieved effect sizes of 0.75 to 0.80 -- rivaling the effect size of human tutoring, which VanLehn measured at d = 0.79. Ma et al. (2014) found an overall ITS effect of g = 0.32--0.37 for college populations, still significantly outperforming traditional classroom instruction.

### 2. AutoTutor and Conversational ITS: Dialogue as Pedagogy

Art Graesser and colleagues at the University of Memphis took the ITS paradigm in a distinctly conversational direction. AutoTutor, first deployed in the late 1990s, engaged students in multi-turn natural-language dialogues on Newtonian physics, computer literacy, and critical thinking. Its core innovation was Expectation and Misconception Tailored (EMT) dialogue: for each problem, AutoTutor maintained a curriculum script listing expected correct answer components and common misconceptions. The system evaluated each student utterance against these lists and dynamically selected conversational moves -- hints, pumps for elaboration, prompts for missing words, corrections of misconceptions, positive/neutral/negative feedback, and summaries -- to guide the student toward constructing a complete answer.

The conversational move taxonomy was empirically grounded. Graesser, Person, and Magliano (1995) analyzed hundreds of human tutoring transcripts and found that even untrained tutors reliably use a predictable set of dialogue acts. AutoTutor replicated these patterns computationally, using latent semantic analysis (LSA) to evaluate semantic similarity between student contributions and expected answers. Over a dozen controlled experiments showed effect sizes ranging from 0.4 to 1.5, with a mean of approximately 0.8 -- roughly equivalent to one letter grade improvement. Later extensions incorporated affect detection (recognizing boredom, confusion, and frustration) and trialogue formats in which two animated agents interacted with the human learner.

### 3. The LLM Era: Large Language Models as Tutors (2023--2026)

The release of GPT-4 in March 2023 catalyzed a wave of LLM-based educational tools. Khan Academy launched Khanmigo, a GPT-4-powered virtual tutor covering math, writing, coding, and historical role-play. Duolingo introduced Duolingo Max, using GPT-4 to provide open-ended conversational practice and detailed grammar explanations. Carnegie Learning released LiveHint, an LLM-powered hint system integrated with their established math platform.

A major systematic review (MDPI, 2025) of 82 peer-reviewed and industry studies published between January 2023 and February 2025 identified five recurring themes: (i) retrieval-augmented generation dramatically reduces hallucination; (ii) prompt-engineering guardrails preserve academic integrity; (iii) multi-agent debate architectures improve accuracy on ill-structured tasks; (iv) affective scaffolds raise learner persistence; and (v) co-orchestration with human teachers mitigates equity risks. The review concluded that hybrid human-AI workflows, in which teachers curate and moderate LLM output, consistently outperform fully autonomous AI tutors.

However, a benchmarking study comparing GPT-4o against established ITS found that the LLM "reliably adheres to instructions but tends to provide overly direct feedback that diverges from effective tutoring," suggesting that current LLM-based tutoring is unlikely to match the learning benefits of well-designed traditional ITS without significant pedagogical scaffolding in the prompt architecture.

### 4. The Tutoring Dilemma: Over-Helping and Productive Struggle

A central tension in AI tutoring is the tendency to over-help. Barcaui (2025) conducted a randomized controlled trial (N = 120) in which undergraduates studying AI concepts were assigned to use either ChatGPT or traditional study methods. On a surprise retention test 45 days later, the ChatGPT group scored 57.5% compared to 68.5% for the control group (Cohen's d = 0.68, p = .002). The study attributed this to cognitive offloading: when an external tool handles the core mental work, learners bypass the "desirable difficulties" that consolidate long-term memory.

Stanford researchers Rose Wang and Dorottya Demszky tackled this problem with Tutor CoPilot, an AI system that provides real-time pedagogical suggestions to human tutors rather than to students directly. In the first RCT of a human-AI tutoring system (900 tutors, 1,800 K-12 students, March--May 2024), students whose tutors used CoPilot were 4 percentage points more likely to master math topics (p < 0.01), with the largest gains (+9 p.p.) appearing among students of the lowest-rated tutors. Analysis of over 350,000 messages showed CoPilot increased probing questions and reduced generic praise.

Meanwhile, Kestin et al. (2025) at Harvard demonstrated that carefully designed AI tutoring can succeed. In an RCT with 194 undergraduates in a physics course, students using a GPT-4-based tutor achieved over twice the learning gains of an active-learning classroom group while spending 20% less time. Crucially, the AI tutor's system prompt incorporated explicit guidelines to refuse direct answers, break problems into sequential steps, manage cognitive load, and promote a growth mindset.

### 5. Personalization and Adaptation: Modeling the Learner

Bayesian Knowledge Tracing (BKT), introduced by Corbett and Anderson (1994), models student learning as a Hidden Markov Model with binary latent states (mastered/not mastered) and four parameters: initial knowledge, learning rate, guess probability, and slip probability. BKT remains widely deployed, but its limitations have driven the field toward deep learning approaches.

Deep Knowledge Tracing (DKT), introduced by Piech et al. (2015), uses recurrent neural networks to model knowledge state as a continuous vector. By 2024, research peaked with 37 papers on knowledge tracing in a single year, driven by hybrid approaches combining graph neural networks, transformers, and attention mechanisms. A 2025 paper in *Scientific Reports* presented a dual-stream neural network integrating deep knowledge tracing with cognitive load estimation.

The integration of LLMs with knowledge tracing is an active frontier. Position papers at EMNLP 2025 argued that when LLMs serve as memory-augmented agents, they can retain individualized data such as repeated grammar mistakes, enabling consistent scaffolding across sessions. The systems that work best combine LLM fluency with structured learner models.

### 6. Prompt Engineering as Pedagogical Design

The system prompt has emerged as the primary lever for shaping LLM pedagogical behavior. A 2025 systematic review by Qian in the *Journal of Educational Computing Research* identified two broad prompting strategies: technique-based (targeting specific learning goals) and process-based (supporting cognitive engagement).

Several research groups have formalized Socratic prompting for LLMs. The KELE multi-agent framework (EMNLP 2025) structures Socratic teaching through continuous heuristic questioning. SocraticLLM (CIKM 2024) collected a purpose-built dataset (SocraticMATH) to train LLMs for multi-turn mathematical guidance. SOCREVAL (NAACL 2024) demonstrated that Socratic-method-inspired prompt design improved GPT-4's correlation with human judgments on reasoning quality from 0.40 to 0.58. The UNESCO "AI Competency Framework for Teachers" (2024) now explicitly positions prompt engineering as a core educator competency.

### 7. Multimodal Conversational Learning

The release of GPT-4o in 2024 enabled simultaneous processing of text, images, and voice. Multimedia learning theory (Mayer, 2001) predicts that combining verbal and visual channels reduces cognitive load. Taneja et al. (2025) tested MuDoC, a multimodal document-grounded conversational system built on GPT-4o that generates responses interleaved with text and images. Their study found that both visuals and content verifiability enhanced learner engagement and trust, though no significant performance difference was observed on immediate assessments -- suggesting multimodal benefits may emerge over longer time horizons or on transfer tasks.

A Pew Research Center survey (2025) found that over 25% of U.S. teenagers regularly use ChatGPT for academic tasks. Voice-based tutoring is a particularly active research area, with researchers noting that multimodal design offers alternative pathways for comprehension when language barriers exist.

### 8. Risks and Limitations: When AI Tutoring Fails

**Hallucination** -- the confident generation of false information -- is perhaps the most distinctive AI failure mode. The U.S. Department of Education has flagged the risk of AI "hallucinating" inaccurate depictions of historical events.

**Over-reliance** poses a subtler but potentially more damaging threat. A systematic review in *Smart Learning Environments* (2024) found that prolonged dependence on AI dialogue systems can impair critical thinking, decision-making, and analytical reasoning.

**Equity concerns** are acute. Ugandan universities shared only 6 Gbps among 282,000 students in 2020, while U.S. high schools target 3 Gbps per 1,000 students. Brookings researchers warn that anthropomorphic AI design makes children susceptible to "banal deception."

**Academic integrity**: over half of students and faculty in a 2025 study reported incidents of AI-assisted academic misconduct, with students using "AI humanizer" tools to evade detection.

The emerging consensus is that pedagogical design is the critical variable. Unstructured access to answer-giving AI harms learning. AI designed to scaffold reasoning, foster productive struggle, and operate within human-supervised workflows can match or exceed traditional instruction. The challenge is not whether AI can teach, but whether we will design it to teach well.

---

**Sources:**

- Kulik & Fletcher (2016) - Effectiveness of Intelligent Tutoring Systems
- VanLehn (2011) - ITS vs Human Tutoring Meta-Analysis
- Ma et al. (2014) - ITS Effect Sizes for College Students
- Graesser et al. (1995, 2004) - AutoTutor Research
- Nye, Graesser & Hu (2014) - AutoTutor: 17 Years Review
- MDPI (2025) - AI-Powered Educational Agents Systematic Review
- Barcaui (2025) - ChatGPT as a Cognitive Crutch RCT
- Wang & Demszky (2024) - Tutor CoPilot RCT
- Kestin et al. (2025) - AI Tutoring Outperforms Active Learning
- Corbett & Anderson (1994) - Bayesian Knowledge Tracing
- Piech et al. (2015) - Deep Knowledge Tracing
- Qian (2025) - Prompt Engineering in Education Review
- KELE (EMNLP 2025) - Multi-Agent Socratic Framework
- SocraticLLM (CIKM 2024) - Socratic Math Dataset
- SOCREVAL (NAACL 2024) - Socratic Evaluation Framework
- UNESCO (2024) - AI Competency Framework for Teachers
- Taneja et al. (2025) - MuDoC Multimodal System
- Pew Research Center (2025) - Teen AI Usage Survey
- Brookings - AI's Future for Students
