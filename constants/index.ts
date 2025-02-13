// Suggestions for chat
export const SUGGESTIONS = [
  "What is artificial intelligence?",
  "How does machine learning work?",
  "Tell me about neural networks",
  "What are the applications of AI in healthcare?",
  "Explain blockchain technology",
  "How do cryptocurrencies work?",
  "What is cloud computing?",
  "Explain quantum computing",
  "What is the Internet of Things?",
  "How does 5G technology work?",
  "What is cybersecurity?",
  "Explain big data analytics",
  "What is virtual reality?",
  "How does augmented reality work?",
  "What is edge computing?",
  "Explain machine vision",
  "What is natural language processing?",
  "How do chatbots work?",
  "What is robotics?",
  "Explain autonomous vehicles",
  "What is 3D printing?",
  "How does facial recognition work?",
  "What is biometric authentication?",
  "Explain smart home technology",
  "What is renewable energy?",
  "How do solar panels work?",
  "What is gene editing?",
  "Explain CRISPR technology",
  "What is space exploration?",
  "How do satellites work?",
  "What is climate change?",
  "Explain sustainable development",
  "What is digital transformation?",
  "How does digital marketing work?",
  "What is social media analytics?",
  "Explain content marketing",
  "What is SEO?",
  "How do search engines work?",
  "What is e-commerce?",
  "Explain digital payments",
  "What is mobile computing?",
  "How do mobile apps work?",
  "What is web development?",
  "Explain responsive design",
  "What is UX design?",
  "How does UI design work?",
  "What is data science?",
  "Explain statistical analysis",
  "What is machine translation?",
  "How does voice recognition work?",
  "What is computer vision?",
  "Explain image processing",
  "What is deep learning?",
  "How do neural networks learn?",
  "What is reinforcement learning?",
  "Explain supervised learning",
  "What is unsupervised learning?",
  "How does pattern recognition work?",
  "What is data mining?",
  "Explain predictive analytics",
  "What is cloud storage?",
  "How does data encryption work?",
  "What is network security?",
  "Explain firewalls",
  "What is malware?",
  "How do antivirus programs work?",
  "What is digital privacy?",
  "Explain data protection",
  "What is artificial neural network?",
  "How does deep learning differ from machine learning?",
  "What is computer programming?",
  "Explain software development",
  "What is agile methodology?",
  "How does DevOps work?",
  "What is cloud migration?",
  "Explain serverless computing",
  "What is microservices architecture?",
  "How does containerization work?",
  "What is Docker?",
  "Explain Kubernetes",
  "What is API integration?",
  "How do web services work?",
  "What is database management?",
  "Explain SQL vs NoSQL",
  "What is data warehousing?",
  "How does data visualization work?",
  "What is business intelligence?",
  "Explain data analytics",
  "What is process automation?",
  "How does RPA work?",
  "What is digital twin technology?",
  "Explain industrial IoT",
  "What is smart manufacturing?",
  "How does supply chain automation work?",
  "What is digital banking?",
  "Explain fintech",
  "What is blockchain in finance?",
  "How do smart contracts work?",
  "What is digital identity?",
  "Explain zero trust security",
  "What is cloud security?",
  "How does multi-factor authentication work?",
  "What is bioinformatics?",
  "Explain DNA sequencing",
  "What is precision medicine?",
  "How does telemedicine work?",
];

// Common class names
export const COMMON_CLASSES = {
  transitionBase: "transition-colors duration-250",
  menuItem:
    "w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md",
  sectionTitle: "text-xs font-medium text-gray-500 dark:text-white mb-1",
  sectionDivider: "border-t border-gray-100 dark:border-gray-700",
  iconBase: "opacity-70 dark:invert transition-[filter] duration-250",
  menuText:
    "text-sm text-gray-700 dark:text-white transition-colors duration-250",
} as const;

// Theme settings
export const THEME_CONFIG = {
  light: {
    value: "light",
    icon: "/assets/icons/theme-light.svg",
  },
  dark: {
    value: "dark",
    icon: "/assets/icons/theme-dark.svg",
  },
} as const;

// Settings menu configuration
export const MENU_SECTIONS = {
  LANGUAGE: {
    title: "LANGUAGE",
    items: [
      {
        icon: "/assets/icons/language.svg",
        label: "Change Language",
      },
    ],
  },
  ACCESSIBILITY: {
    title: "ACCESSIBILITY",
    items: [
      {
        icon: "/assets/icons/accessibility.svg",
        label: "Accessibility Settings",
      },
      {
        icon: "/assets/icons/keyboard.svg",
        label: "Keyboard Shortcuts",
      },
    ],
  },
  ABOUT: {
    title: "ABOUT",
    items: [
      {
        icon: "/assets/icons/info.svg",
        label: "About AI Chat Assistant",
      },
    ],
  },
  APPEARANCE: {
    title: "APPEARANCE",
  },
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  menuClose: 400,
} as const;

// Helper function to get random suggestions
export const getRandomSuggestions = (count: number): string[] => {
  const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
