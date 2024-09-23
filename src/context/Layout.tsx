import React, { useState, useEffect } from 'react';
import ProtectedPage from "./ProtectedPage";
import ChatSidebar from "../chatSidebar/ChatSidebar";
import Head from "next/head";
import { useRouter } from 'next/router';
import styles from '../utils/sidebar.module.css';
import PlaygroundSidebar from '../playgroundSidebar/PlaygroundSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isPlaygroundPage = router.pathname === '/playground';
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configbarOpen, setConfigbarOpen] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const openSidebar = () => {
    setSidebarOpen(true);
    setConfigbarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setConfigbarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setConfigbarOpen(!configbarOpen);
  };

  const getSidebarClasses = (isOpen: boolean) => `
    ${isMobile ? 'fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out transform' : ''}
    ${isMobile && !isOpen ? '-translate-x-[calc(100%+4px)]' : 'translate-x-0'}
  `;

  const getSidebarStyle = (isOpen: boolean) => ({
    boxShadow: isMobile && !isOpen ? '15px 0 15px rgba(0, 0, 0, 0.1)' : 'none',
  });

  return (
    <React.Fragment>
      <Head>
        <title>{isPlaygroundPage ? 'OpenAI Playground' : 'EduChat'}</title>
        <meta name="description" content={isPlaygroundPage ? 'A clone of OpenAI playground.' : 'ChatGPT for Education - Provided by Chamblandes'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ProtectedPage>
        <div className="max-w-screen relative h-screen max-h-screen w-screen overflow-hidden">
          <div className="flex h-[calc(100vh)] max-h-[calc(100vh)]">
            {!isPlaygroundPage && (
              <>
                {isMobile && (
                  <div>
                    <button
                      onMouseOver={openSidebar}
                      onClick={toggleSidebar}
                      className={`${styles.button} "fixed h-full rounded-md"`}
                    >
                    </button>
                    <div className={styles.tab} onClick={toggleSidebar}>
                      <span>{sidebarOpen ? 'Fermer' : 'Historique'}</span>
                    </div>
                  </div>
                )}
                <div className={getSidebarClasses(sidebarOpen)} style={getSidebarStyle(sidebarOpen)} >
                  <ChatSidebar />
                </div>
              </>
            )}
            {isPlaygroundPage && (
              <>
                {isMobile && (
                  <div>
                    <button
                      onMouseOver={openSidebar}
                      onClick={toggleSidebar}
                      className={`${styles.button} "fixed h-full rounded-md"`}
                    >
                    </button>
                    <div className={styles.tab} onClick={toggleSidebar}>
                      <span>{sidebarOpen ? 'Fermer' : 'Paramètres'}</span>
                    </div>
                  </div>
                )}
                <div className={getSidebarClasses(configbarOpen)} style={getSidebarStyle(configbarOpen)}>
                  <PlaygroundSidebar />
                </div>
              </>
            )}
            <div className="flex flex-grow overflow-hidden" onMouseOver={closeSidebar}>
              {children}
            </div>
          </div>
        </div>
      </ProtectedPage>
    </React.Fragment>
  );
};

export default Layout;