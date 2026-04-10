# Mockable   
## Problem Statement   
Job seekers, especially fresh graduates and early professionals, often struggle with interview preparation due to the lack of personalized feedback. Traditional mock interviews are either expensive or too generic. Self-assessment is challenging, and there's a clear gap between interview preparation tools and the actionable insights needed to improve. There is a need for a system that offers **affordable, personalized, and scalable mock interviews with intelligent feedback**.   
   
## Objective   
1. Enable users to conduct mock interviews tailored to their job role, experience and resume.   
2. Generate AI-based questions dynamically based on job description, role and resume.   
3. Record and/or upload interview video responses through a user-friendly web interface.   
4. Analyze responses using AI-powered speech-to-text transcription, sentiment analysis, tone detection, and NLP.   
5. Optionally analyze facial expressions and body language using computer vision.   
6. Generate an interactive, downloadable performance report highlighting:   
    - Verbal fluency   
    - Confidence trends   
    - Technical accuracy   
    - Filler word usage   
    - Improvement suggestions   
7. Support report tracking over time for progress monitoring.   
   
   
## Features   
|                                   Feature |                                                                  Description |
|:------------------------------------------|:-----------------------------------------------------------------------------|
|                **AI-Generated Questions** | Questions generated based on role, JD, and experience using GPT-4 or similar |
|                 **Video/Audio Recording** |                         Web-based recording or upload of interview responses |
|                        **Speech-to-Text** |                       Using Whisper or AssemblyAI for accurate transcription |
|              **NLP & Sentiment Analysis** |     Analyze speech content for tone, clarity, filler words, confidence, etc. |
| **Facial Expression Analysis** (Optional) |                      Detect visual cues like eye contact, smiles, hesitation |
|                       **Feedback Report** |                  Detailed summary with graphs, scores, and improvement areas |
|                **Tech Stack Flexibility** |     Backend in **Rust** (Axum), frontend in **ReactJS**, AI with OpenAI APIs |
|                        **Authentication** |                  Clerk or Firebase for secure login and user data management |
|                     **PDF Report Export** |                                   Downloadable reports for review or sharing |

## Tech Stack   
|                          Layer |                                             Technology |
|:-------------------------------|:-------------------------------------------------------|
|                   **Frontend** |                                   ReactJS, TailwindCSS |
|             **Backend (Core)** |                  **NodeJS** |
|                   **Database** |                                  MongoDB |
|             **Authentication** |                                                  OAuth |
|             **Speech-to-Text** |                    GTTS |
|           **Video Processing** |                     ffmpeg  |
|          **Report Generation** | JSON APIs + frontend visualization (Recharts/Chart.js) |

## Workflow
   
1. **User logs in** and enters:   
    - Job role (e.g., "Full Stack Developer")   
    - Job description   
    - Experience level   
2. System uses GPT API to **generate a personalized set of questions**.   
3. User starts interview:   
    - Either records responses live using webcam/audio   
    - Or uploads pre-recorded video/audio   
4. Backend performs:   
    - **Speech transcription**   
    - **NLP scoring** of responses   
    - **Sentiment analysis & tone detection**   
    - *(Optional)* Facial emotion analysis via vision models   
5. Backend generates a **performance score/report**, highlighting:   
    - Technical strength   
    - Confidence levels   
    - Language fluency   
    - Body language insights (optional)   
    - Suggestions for improvement   
6. Report is displayed to user with visual charts and improvement tips.   
   
## AI/ML Integration   
|                 Function |                                           Tool |
|:-------------------------|:-----------------------------------------------|
|      Question Generation |                               OpenAI GPT-4 API |
|     Speech Transcription |                       Whisper API / AssemblyAI |
|              NLP Scoring |       HuggingFace Transformers (BERT, RoBERTa) |
|         Sentiment & Tone |          VADER, TextBlob, or fine-tuned models |
| Facial Emotion Detection |                                 DeepFace, FER+ |
|     Resume Match (Bonus) | JD + Resume cosine similarity using embeddings |
| WASM Integration (Bonus) |    Rust scoring logic compiled for WebAssembly |

## Future Scope:   
- AI avatars (use D-ID or Synthesia for mock interviewer)   
- Live feedback during interviews (e.g., “Try to speak slower”)   
- Resume parsing + JD match checker   
- Dashboard with progress tracking   
- Multi-language support for vernacular users   
- Integration with LinkedIn API for profile-based question generation   
   
## Security & Privacy Considerations:   
- All video and audio files encrypted in storage (AES-256)   
- Secure user authentication and session handling   
- Auto-deletion option for interview data   
- GDPR-compliant user consent mechanism for analysis   
   
   
## 🔬 Research Papers for "Mockable"
   
- **BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding**   
    *Devlin et al., 2018*   
- **T5: Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer**   
    *Raffel et al., 2020*   
- **A Survey on Question Generation from Text**   
    *Amidei et al., 2021*   
 --- 
- **Automated Interview Analysis: A Survey**   
    *Meena et al., 2022*   
- **An Intelligent Tutoring System Using Natural Language Processing Techniques**   
    *Alqahtani et al., 2019*   
 --- 
- **Deep Knowledge Tracing**   
    *Piech et al., 2015*   
   
### 🗣️ 5. Speech and Communication Analysis (if doing voice-based interviews)   
- **OpenSMILE – The Munich Versatile and Fast Open-Source Audio Feature Extractor**   
    *Eyben et al., 2010*   
- **Automated Assessment of Public Speaking Skills Using Audio and Video Features**   
    *Chen et al., 2021*   
   
## Pricing → How can Money be made from this?   
|                      Model |            Pricing Range |               Target |
|:---------------------------|:-------------------------|:---------------------|
|                   Freemium |             ₹0 → ₹399/mo |          Individuals |
|             One-time Packs |              ₹149 – ₹999 | Students, jobseekers |
|      B2B SaaS for Colleges |       ₹10k–₹50k/semester |     TPOs, Institutes |
|      API/SaaS for HR Firms |           Custom pricing | Recruiters, Startups |
| Add-ons (Resume, JD match) |                 ₹99–₹499 |            All tiers |
|        AI Avatar Interview |         ₹49–₹149 per use |        Premium users |

   
