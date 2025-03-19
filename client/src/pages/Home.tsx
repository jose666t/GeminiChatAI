import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabNavigation from '@/components/TabNavigation';
import ChatTab from '@/components/ChatTab';
import ImageAnalysisTab from '@/components/ImageAnalysisTab';
import TranslationTab from '@/components/TranslationTab';
import ProgrammingTab from '@/components/ProgrammingTab';
import { TabId } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabId>('chat');
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <Header />
      
      <main className="flex-grow pt-2 pb-4 md:py-6">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="tab-content">
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'image-analysis' && <ImageAnalysisTab />}
            {activeTab === 'translation' && <TranslationTab />}
            {activeTab === 'programming' && <ProgrammingTab />}
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Home;
