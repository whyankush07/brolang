<a href="https://brolang.whyankush.wtf">
<div align="center">
<img src = "/public/landing.png">
</div>
</a>

# Brolang

<p align="center">
  Brolang is a fun programming language built for fun by <a href="https://x.com/whyankush07">Ankush</a>
</p>

<p align="center"> Supports both pure english and pure hindi syntax with fully customizable keywords and error messages.
</p>

## 🚀 Getting Started

You can get started with BROLANG by visiting [brolang.whyankush.wtf](https://brolang.whyankush.wtf)

- To set up locally, you can clone the repository and run the following commands:

```bash
git clone https://github.com/ankush-web-eng/brolang
npm install -g yarn
yarn install
yarn dev
```

## ✨ Features

### 🎨 Custom Syntax Editor
- **Fully Customizable Keywords**: Change any keyword to your preferred term (e.g., "bhai_sun" → "LET", "agar" → "IF")
- **Personalized Error Messages**: Modify error messages to match your style or language
- **Real-time Preview**: See changes instantly in the playground
- **Persistent Configuration**: Save your custom syntax to localStorage
- **Reset to Default**: Easily restore original syntax anytime

### 🎮 Interactive Playground
- Write and test Brolang code instantly in your browser
- Real-time syntax highlighting and error detection
- Multiple themes support (Dracula, GitHub Dark, Monokai, etc.)
- Responsive design for mobile and desktop

### 🐛 Bug Reporting System
- Report bugs directly from the application
- Integrated with GitHub Issues for seamless tracking
- User-friendly interface for detailed bug descriptions

### 📚 Documentation
- Comprehensive docs available in both Hindi and English
- Interactive examples and tutorials
- API references and language specifications

<div align="center">
<img src = "/public/docs.png">
</div>

## 🛠 Tech Stack

- BROLANG uses a modern **Event-Based Architecture** with real-time capabilities

- **Frontend**: [Next.js 15](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Compiler**: Custom TypeScript-based compiler for Brolang syntax
- **Backend**: [Golang](https://go.dev/) microservices
- **Database**: [Prisma](https://www.prisma.io/) with [Aiven](https://aiven.io/)
- **Cloud**: [Railway.app](https://railway.app) & [Vercel](https://vercel.com)
- **Queue**: [Apache Kafka](https://kafka.apache.org/)
- **Pub-Sub**: [Redis](https://redis.io/)
- **UI/UX**: [TailwindCSS](https://tailwindcss.com/) + [Aceternity UI](https://ui.aceternity.com/) + [Shadcn UI](https://ui.shadcn.com)
- **Email**: [Nodemailer](https://nodemailer.com/) with custom templates

<div align="center">
<img src = "/public/architecture.png">
<p>([Excalidraw](https://excalidraw.com/#json=UN8yz9cX29NkboT-hDAzx,lUIkw23AGJaiGYYD2Wg4Ig))</p>
</div>

- On production, this application uses Client-Server architecture optimized for performance and cost-efficiency
- WebSocket server and worker code available in `server/` directory
- Code is well-commented with context in `context/CodeContext.tsx`

## 📖 Usage

### Using the Custom Syntax Editor

1. Click the "Customize Syntax" button in the playground
2. Modify keywords and error messages to your liking
3. Test your changes in real-time
4. Save configuration to persist across sessions
5. Share your custom syntax with others!

### Example Custom Syntax

```brolang
// Default syntax
bhai_sun x = 10;
agar x > 5 {
    bol_bhai "Hello World!";
}

// Custom syntax example
let x = 10;
if x > 5 {
    print "Hello World!";
}
```

## 🤝 Contributing

- Contributions, issues and feature requests are welcome!
- Check the [issues page](https://github.com/ankush-web-eng/brolangf/issues) to contribute
- Open to suggestions for new syntax, error messages, and tech stack improvements
- DM me on [Twitter](https://x.com/whyankush07) for quick discussions

## 📝 License

BROLANG is licensed under the MIT License. See [LICENSE](LICENSE) for more information.