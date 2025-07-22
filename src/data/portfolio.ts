export const portfolioData = {
  about: `
    My name is Suon Vannputhika. I am a Software Engineering student and developer based in Phnom Penh, Cambodia.<br><br>
    Type 'skills' to see my technical skills or 'projects' to view my work.
  `,
  skills: [
    { category: 'Languages', items: 'Python, JavaScript, Dart, HTML, CSS, SQL' },
    { category: 'Frameworks/Tools', items: 'Flutter, React, Next.js, Tailwind CSS, Node.js, Godot, Git, Figma' },
    { category: 'Soft Skills', items: 'UX/UI Design, Project Leadership, Public Speaking, Agile Development' }
  ],
  experience: `
    <span class="text-green-400">Work Experience</span><br>
    <span class="text-yellow-400">Product Development Internship @ WALD Limited</span><br>
    Apr 2025 – Jul 2025<br>
    – Led the development team for a digital transformation project, creating a web application to modernize the design process for a traditional lacquerware company.<br>
    – Oversaw the project lifecycle, from initial concept and system architecture to final deployment and feature implementation.<br>
    – Managed the development timeline, ensuring key milestones for the admin dashboard, AI-powered features, and user-facing components were met.<br><br>
    <span class="text-yellow-400">Software Engineering Internship @ Kirirom Institute of Technology</span><br>
    Mar 2024 – Jun 2025<br>
    <span class="text-cyan-400">Game Designer & Developer</span> (Apr 2025 – Jun 2025)<br>
    – Designed core gameplay systems including combat loops, progression mechanics, and procedural level generation.<br>
    – Developed the game using Godot 4, implementing player interactions, enemy behaviors, and item interactions.<br><br>
    <span class="text-cyan-400">Hospitality App Project</span> (Apr 2024 – Jun 2025)<br>
    – Led the complete redesign of a legacy hospitality app, analyzing UX pain points and creating high-fidelity mockups.<br>
    – Rebuilt and refactored the application’s frontend using Flutter, improving performance, usability, and maintainability.<br>
    – Redesigned core user flows such as room booking, service requests, and payment interactions to be more intuitive.<br><br>
    <span class="text-cyan-400">Biometric Machine Learning Project</span> (Mar 2024 – Sep 2024)<br>
    – Managed the data lifecycle by building ETL pipelines with Python to gather, clean, and prepare user metadata for the ML model.<br>
    – Designed and developed the admin dashboard’s frontend using Next.js and Tailwind CSS for efficient user management.<br>
    – Ensured system quality by creating detailed test plans and conducting manual testing of all components.<br><br>
    <span class="text-yellow-400">Product Lead @ Rean&Play Studio</span><br>
    Mar 2023 – Jul 2025<br>
    <span class="text-cyan-400">Marketing and PR Officer</span> (Mar 2023 – Feb 2024)<br>
    – Led pitching and presentation efforts at startup competitions, including winning 1st place at SMARTSPARK+ COHORT 1.<br>
    – Acted as the public face of the studio, building credibility with judges, investors, and partners.<br>
    – Designed and executed marketing campaigns, managed social media, and handled public relations.<br><br>
    <span class="text-cyan-400">User Experience Designer</span> (Mar 2023 – Jul 2025)<br>
    – Designed and implemented the UI/UX for LetterHunter, an adventure puzzle game teaching the Khmer alphabet.<br>
    – Translated user research into wireframes, user flows, and high-fidelity designs.<br>
    – Designed responsive front-end interfaces using Flutter to bring designs to life.<br>
  `,
  education: `
    <span class="text-green-400">Education</span><br>
    <span class="text-yellow-400">Bachelor of Engineering in Software Engineering</span><br>
    Kirirom Institute of Technology, Feb 2023 – Feb 2027
  `,
  projects: [
    {
      title: 'Digital Menu Web App',
      description: 'Developed a dynamic menu management system using Angular, Node.js, Express, and MongoDB for a local restaurant. Implemented CRUD functionality for food items and categories, enabling real-time updates through a responsive admin dashboard. Ensured a mobile-first responsive layout for customers to browse the menu with optimized performance and user experience.',
      stack: 'Angular, Node.js, Express, MongoDB',
      date: ''
    },
    {
      title: 'DSA Message Signing',
      description: 'Created a simple tool that allows users to generate digital signature key pairs and encrypt messages using DSA (Digital Signature Algorithm). Developed the front end with React for intuitive interaction and connected it to a Python backend using Flask for cryptographic operations. Enabled secure message signing and verification with a focus on clarity and beginner usability.',
      stack: 'React, Python, Flask',
      date: ''
    },
    {
      title: 'Diabetes Prediction App',
      description: 'Built a web-based health application using Gradio and a trained Random Forest classifier on the Pima Indians Diabetes dataset. Implemented an intuitive interface for users to input medical data and receive diabetes risk predictions with confidence scores. Enabled offline model training and persistence with Pickle and Scikit-learn for reproducibility and deployment.',
      stack: 'Gradio, Python, Scikit-learn, Pickle',
      date: ''
    },
    {
      title: 'African Wildlife Classifier',
      description: 'Developed an image classification app using PyTorch and Gradio to identify African wildlife species from user-uploaded images. Fine-tuned AlexNet to classify four species (Buffalo, Elephant, Rhino, Zebra) with softmax confidence output. Handled fallback loading of pretrained models and optimized the app for various environments including Hugging Face Spaces and Colab.',
      stack: 'PyTorch, Gradio, AlexNet',
      date: ''
    }
  ],
  achievements: [
    {
      title: 'SMARTSPARK+ Cohort 1 - Winner',
      date: 'May 2023 – Sep 2023',
      description: 'Participated in the three month long training; learning to effectively start, operate and advertise a start-up. Presented the winning pitch for Rean&Play Studio’s idea to develop engaging Khmer language learning games for children.'
    },
    {
      title: 'UnipreneurSprint Batch 3 - Second Runner-up',
      date: 'Jan 2024',
      description: 'Participated in the three day long hackathon; learning to effectively identify problems and solutions and turning them into marketable products.'
    },
    {
      title: 'Youth to Business Hackathon - Winner',
      date: 'Mar 2024',
      description: 'Developed and delivered the winning pitch to modernize a tailor shop, presenting my team’s idea for inventory management, digital advertising, and customer-focused loyalty and recycling programs.'
    }
  ],
  contact: `
    <span class="text-green-400">Contact Information</span><br>
    <span class="text-yellow-400">Phone:</span> +855 11355529<br>
    <span class="text-yellow-400">Email:</span> <a href='mailto:vannputhikasuon@gmail.com' class='text-blue-400 hover:underline'>vannputhikasuon@gmail.com</a><br>
    <span class="text-yellow-400">Location:</span> Phnom Penh, Cambodia<br>
  `,
  fastfetch: {
    name: "Suon Vannputhika",
    title: "Software Engineering Student",
    os: "terminal",
    shell: "zsh",
    packages: "npm",
    editor: "VS Code",
    contact: {
      email: "vannputhikasuon@gmail.com",
      github: "",
      linkedin: "",
    },
    art: `                                    
                 #*#                    
              #%%%%%%%%%%               
            #%%%%%%%%@@@@%%             
            %@@%#*+==++*#%%%            
           %%%+====-====+#%@            
           %%%++**=--+#**#@%            
           %@*+*#*+==*****%@            
           %#+==--=-======#*            
            +#==--===+--=+*             
              +==+===+++=+              
              ++=-=====++               
               +++=-==+++               
               +===++===*%              
         ####+-==-----==+######         
     *#######*-===----==+#####*####     
   **##########--------*#####*******    
  ***###########%*+*#########********   
  ##*#*####################*******#***  
    `
  }
}; 