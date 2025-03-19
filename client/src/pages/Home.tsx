import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabNavigation from '@/components/TabNavigation';
import ChatTab from '@/components/ChatTab';
import ImageAnalysisTab from '@/components/ImageAnalysisTab';
import TranslationTab from '@/components/TranslationTab';
import ProgrammingTab from '@/components/ProgrammingTab';
import { TabId } from '@/types';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabId>('chat');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="tab-content">
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'image-analysis' && <ImageAnalysisTab />}
            {activeTab === 'translation' && <TranslationTab />}
            {activeTab === 'programming' && <ProgrammingTab />}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
