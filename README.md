Shail Digital (SocialSync)
# 🚀 Social Media Automation System

An end-to-end AI-powered social media automation pipeline that generates images, creates captions, plans content, schedules posts, and manages a content calendar — all with minimal human intervention.

---

## 🧠 Tools & Technologies Used

- **[CrewAI](https://docs.crewai.com/)** – Multi-agent framework for managing caption generation, content planning, and scheduling.
- **Stable Diffusion** – For AI-based image generation.
- **Langchain + LLMs (OpenAI/Anthropic)** – Used for smart caption creation and tone adjustments.
- **Cron + Scheduler API** – For scheduling and auto-posting content.
- **Content Calendar (Google Sheets / Notion / Custom DB)** – For visual planning and tracking.
- **Social Media APIs** – For programmatic posting (Instagram, Twitter, LinkedIn, etc.).

---

## 🛠️ Features

- ✅ **Automated Image Generation** using Stable Diffusion from prompt or topic.
- ✅ **AI-Powered Caption Creation** with CrewAI agents (optimized for engagement, tone, and length).
- ✅ **Content Planning**: Weekly content themes, trends, and hashtags.
- ✅ **Smart Scheduling**: Automatically posts content at optimal times.
- ✅ **Content Calendar Management**: Track upcoming posts and campaigns visually.
- ✅ **Multi-Platform Support**: Deploys to Instagram and Linkedin.

---


## 🧪 How It Works

1. **User Input / Prompt** → Topic or theme of the week.
2. **Image Generation** → `Stable Diffusion` creates visuals based on the theme.
3. **Caption Agent** → CrewAI agent writes engaging captions with emojis, CTAs, and hashtags.
4. **Content Planner Agent** → Structures a weekly content plan.
5. **Scheduler Agent** → Assigns time slots and updates the content calendar.
6. **Auto Posting** → Scheduled posts are sent to social media via API.

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/social-media-automation.git
cd social-media-automation

# Install dependencies
pip install -r requirements.txt

# Set up API keys (OpenAI, Stable Diffusion, Social Media)
cp .env.example .env
# Fill in the .env with your keys

# Run the full automation pipeline
python main.py


