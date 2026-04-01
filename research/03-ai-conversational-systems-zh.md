# AI 与会话式学习系统

## 从智能辅导到大语言模型：AI 驱动的对话如何促进学习

### 1. 基础：智能辅导系统（1970年至今）

计算机能够通过对话进行教学的想法始于1970年，当时 Jaime Carbonell 构建了 SCHOLAR，这是一个使用苏格拉底式提问来辅导学生学习南美地理的系统，采用自然语言文本输入和输出。SCHOLAR 标志着与计算机辅助教学（Computer-Assisted Instruction, CAI）的概念性决裂。CAI 根植于 Skinner 的行为主义：与其让学生在固定的反应序列上反复操练，SCHOLAR 将知识建模为语义网络，并根据学习者的回答调整其问题。在1970年代和1980年代，后继者如 SOPHIE（电子故障排除）、DEBUGGY（算术错误）和 WHY（因果推理）在多个领域展示了 AI 驱动的教学对话的可行性。

最成功的商业化路线源自 Carnegie Mellon University 的 John Anderson 的 ACT-R 认知理论。Anderson 及其同事，特别是 Kenneth Koedinger，开发了认知辅导器（Cognitive Tutors），逐步模拟学生的问题解决过程，提供即时反馈并跟踪多种解题策略。Kulik 和 Fletcher（2016）的里程碑式元分析考察了50项对照评估，发现在92%的案例中接受智能辅导的学生优于传统教学的学生，中位效应量为 d = 0.66。VanLehn（2011）的元分析进一步表明，基于步骤和子步骤的 ITS 达到了0.75到0.80的效应量——与人类辅导的效应量不相上下，VanLehn 测得的人类辅导效应量为 d = 0.79。Ma 等人（2014）发现大学生群体的 ITS 总体效应为 g = 0.32-0.37，仍显著优于传统课堂教学。

### 2. AutoTutor 与会话式 ITS：以对话为教学法

Memphis 大学的 Art Graesser 及其同事将 ITS 范式引向了明确的对话方向。AutoTutor 于1990年代末首次部署，让学生就牛顿物理学、计算机素养和批判性思维进行多轮自然语言对话。其核心创新是期望与错误概念定制化对话（Expectation and Misconception Tailored, EMT）：对于每个问题，AutoTutor 维护一个课程脚本，列出预期的正确答案组成部分和常见错误概念。系统评估每个学生话语与这些列表的匹配度，并动态选择对话行为——提示、引导展开、提示缺失词汇、纠正错误概念、正面/中性/负面反馈和总结——以引导学生构建完整答案。

对话行为分类是基于实证的。Graesser、Person 和 Magliano（1995）分析了数百份人类辅导录音稿，发现即使是未经训练的辅导者也会可靠地使用一组可预测的对话行为。AutoTutor 通过计算方式复制了这些模式，使用潜在语义分析（Latent Semantic Analysis, LSA）来评估学生贡献与预期答案之间的语义相似度。十多项对照实验显示效应量从0.4到1.5不等，平均约为0.8——大致相当于提高一个字母等级。后续扩展加入了情感检测（识别无聊、困惑和挫折）以及三方对话格式，其中两个动画代理与人类学习者互动。

### 3. LLM 时代：大语言模型作为辅导者（2023-2026）

GPT-4 于2023年3月发布，催生了一波基于 LLM 的教育工具浪潮。Khan Academy 推出了 Khanmigo，这是一个由 GPT-4 驱动的虚拟辅导者，涵盖数学、写作、编程和历史角色扮演。Duolingo 推出了 Duolingo Max，利用 GPT-4 提供开放式对话练习和详细的语法解释。Carnegie Learning 发布了 LiveHint，这是一个与其成熟数学平台集成的 LLM 驱动提示系统。

一项重大系统综述（MDPI, 2025）考察了2023年1月至2025年2月期间发表的82项同行评审和行业研究，确定了五个反复出现的主题：（i）检索增强生成（RAG）显著减少幻觉；（ii）提示工程护栏维护学术诚信；（iii）多智能体辩论架构提高对非结构化任务的准确性；（iv）情感支架提升学习者的坚持度；（v）与人类教师的协同编排减轻公平风险。综述结论是，教师整理和审核 LLM 输出的人机混合工作流一致优于完全自主的 AI 辅导者。

然而，一项将 GPT-4o 与已建立的 ITS 进行对比的基准研究发现，LLM「可靠地遵循指令，但倾向于提供过于直接的反馈，偏离了有效的辅导方式」，这表明当前基于 LLM 的辅导如果没有在提示架构中进行显著的教学法支架设计，不太可能达到设计良好的传统 ITS 的学习效果。

### 4. 辅导困境：过度帮助与建设性挣扎

AI 辅导中的核心张力在于过度帮助的倾向。Barcaui（2025）进行了一项随机对照试验（N = 120），其中学习 AI 概念的大学生被分配使用 ChatGPT 或传统学习方法。在45天后的突击测试中，ChatGPT 组得分为57.5%，而对照组为68.5%（Cohen's d = 0.68，p = .002）。该研究将此归因于认知卸载（cognitive offloading）：当外部工具承担了核心心理工作时，学习者绕过了巩固长期记忆的「合意困难」。

Stanford 研究者 Rose Wang 和 Dorottya Demszky 通过 Tutor CoPilot 应对了这一问题，这是一个向人类辅导者（而非直接向学生）提供实时教学建议的 AI 系统。在首个人机辅导系统的随机对照试验中（900名辅导者，1,800名 K-12 学生，2024年3月至5月），使用 CoPilot 的辅导者的学生掌握数学主题的可能性高出4个百分点（p < 0.01），评分最低的辅导者的学生获得了最大的提升（+9个百分点）。对超过350,000条消息的分析显示，CoPilot 增加了探测性问题并减少了泛泛的表扬。

与此同时，Harvard 的 Kestin 等人（2025）证明了精心设计的 AI 辅导可以成功。在一项针对物理课程194名大学生的随机对照试验中，使用基于 GPT-4 的辅导者的学生取得了主动学习课堂组两倍以上的学习增长，同时节省了20%的时间。关键的是，AI 辅导者的系统提示包含了明确的指南：拒绝直接给出答案、将问题分解为顺序步骤、管理认知负荷、以及培养成长心态。

### 5. 个性化与适应：学习者建模

贝叶斯知识追踪（Bayesian Knowledge Tracing, BKT）由 Corbett 和 Anderson（1994）提出，将学生学习建模为隐马尔可夫模型，具有二元潜在状态（已掌握/未掌握）和四个参数：初始知识、学习率、猜测概率和失误概率。BKT 仍被广泛使用，但其局限性推动了该领域向深度学习方法发展。

深度知识追踪（Deep Knowledge Tracing, DKT）由 Piech 等人（2015）提出，使用循环神经网络将知识状态建模为连续向量。到2024年，研究达到顶峰，单年有37篇关于知识追踪的论文，驱动力来自结合图神经网络、Transformer 和注意力机制的混合方法。2025年 *Scientific Reports* 的一篇论文提出了一种双流神经网络，将深度知识追踪与认知负荷估计相整合。

LLM 与知识追踪的整合是一个活跃的前沿。EMNLP 2025 的立场论文认为，当 LLM 作为记忆增强智能体时，它们可以保留个性化数据（如反复出现的语法错误），实现跨会话的一致性支架。效果最好的系统将 LLM 的流畅性与结构化学习者模型相结合。

### 6. 提示工程作为教学设计

系统提示已成为塑造 LLM 教学行为的主要杠杆。Qian（2025）在 *Journal of Educational Computing Research* 上的系统综述确定了两种广泛的提示策略：基于技术的（针对特定学习目标）和基于过程的（支持认知参与）。

多个研究团队已将苏格拉底式提示形式化用于 LLM。KELE 多智能体框架（EMNLP 2025）通过持续的启发式提问来组织苏格拉底式教学。SocraticLLM（CIKM 2024）收集了专门构建的数据集（SocraticMATH）来训练 LLM 进行多轮数学指导。SOCREVAL（NAACL 2024）证明苏格拉底方法启发的提示设计将 GPT-4 与人类判断在推理质量上的相关性从0.40提升到0.58。联合国教科文组织的《教师 AI 能力框架》（2024）现在明确将提示工程定位为核心教育者能力。

### 7. 多模态会话学习

GPT-4o 于2024年发布，实现了文本、图像和语音的同时处理。多媒体学习理论（Mayer, 2001）预测，结合言语和视觉通道可以降低认知负荷。Taneja 等人（2025）测试了 MuDoC，这是一个基于 GPT-4o 构建的多模态文档基础对话系统，生成文本和图像交错的回复。他们的研究发现，视觉内容和内容可验证性都增强了学习者的参与度和信任度，尽管在即时评估中未观察到显著的表现差异——这表明多模态的益处可能在更长的时间跨度或迁移任务中才会显现。

Pew Research Center（2025）的一项调查发现，超过25%的美国青少年经常使用 ChatGPT 完成学术任务。基于语音的辅导是一个特别活跃的研究领域，研究者指出多模态设计在存在语言障碍时为理解提供了替代途径。

### 8. 风险与局限：AI 辅导何时失败

**幻觉**（hallucination）——自信地生成虚假信息——可能是最具 AI 特色的失败模式。美国教育部已标记了 AI「幻觉」出不准确的历史事件描述的风险。

**过度依赖**构成了一种更微妙但可能更具破坏性的威胁。*Smart Learning Environments*（2024）的一项系统综述发现，对 AI 对话系统的长期依赖可能损害批判性思维、决策和分析推理能力。

**公平问题**很尖锐。2020年，乌干达大学在282,000名学生之间仅共享6 Gbps带宽，而美国高中的目标是每1,000名学生3 Gbps。Brookings 研究者警告说，拟人化 AI 设计使儿童容易受到「平庸欺骗」的影响。

**学术诚信**：2025年一项研究中，超过半数的学生和教师报告了 AI 辅助学术不端行为事件，学生使用「AI 人性化」工具来逃避检测。

新兴共识是教学设计是关键变量。对给答案型 AI 的非结构化访问有害于学习。设计用于支架推理、培养建设性挣扎、并在人类监督工作流中运行的 AI 可以达到或超越传统教学。挑战不在于 AI 能否教学，而在于我们是否会设计它来教得好。

---

**参考文献：**

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
