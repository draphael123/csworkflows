import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <Header />
      <ChatInterface />
    </main>
  );
}


