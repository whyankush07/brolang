<a href="https://brolang.whyankush.wtf">
<div align="center">
<img src = "/public/landing.png">
</div>
</a>

# Brolang

<p align="center">
  Brolang is a fun programming language written in Golang built for fun by <a href="https://x.com/whyankush07">Ankush</a>
</p>

<p align="center"> Supports both pure english and pure hindi syntax, tutorial will be linked soon.
</p>

## 🚀 Getting Started

You can get started with BROLANG by visiting [brolang.whyankush.wtf](https://brolang.whyankush.wtf)

- To set up locally, you can clone the repository and run the following commands:

```bash
git clone https://github.com/ankush-web-eng/brolangf
npm install -g yarn
yarn install
yarn dev
```

- For the backend repository:

```bash
git clone https://github.com/ankush-web-eng/brolang
go mod download
go build main.go
go run main.go
```

## 📚 Documentation

- To try out BROLANG, you can visit [docs](https://brolang.whyankush.wtf/docs) page for docs available in both Hindi and English.

<div align="center">
<img src = "/public/docs.png">
</div>

### Tech Stack

- BROLANG was primarily built on an **Event-Based Architecture**

- **Frontend**: [Nextjs-15](https://nextjs.org/)
- **Backend**: [Golang](https://go.dev/)
- **DATABASE**: [Aiven](https://aiven.io/) with [Prisma](https://www.prisma.io/)
- **Cloud**: [railway.app](https://railway.app) & [vercel](https://vercel.com)
- **Queue**: [Kafka](https://kafka.apache.org/)
- **Pub-Sub**: [Redis](https://redis.io/)
- **Menu and UI**: [TailwindCSS](https://tailwindcss.com/) + [Aceternity UI](https://ui.aceternity.com/) + [Shadcn UI](https://ui.shadcn.com)
<div align="center">
<img src = "/public/architecture.png">
<p>([Excallidraw](https://excalidraw.com/#json=UN8yz9cX29NkboT-hDAzx,lUIkw23AGJaiGYYD2Wg4Ig))</p>
</div>

- On production, this application is working on Client-Server architecture because of this independent student-developer's tight budget, moreover the code has been commented in context/CodeContext.tsx.

- The Web-Socket server's code and Worker's code is available in server/ directory.

### Open Source

- Contributions, issues and feature requests are welcome. Feel free to check the [issues page](/issues) if you want to contribute.
- I am open for all suggestions related to syntax, errors and tech-stack, your opinion is valuable.
- Either you can contribute directly or leave a quick DM [here](https://x.com/whyankush07)

## 📝 License

BROLANG is licensed under the MIT License. See [LICENSE](LICENSE) for more information.