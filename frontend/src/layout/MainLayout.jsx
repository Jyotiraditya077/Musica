import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Top Layout Group */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AudioPlayer />

        {!isMobile ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Left Sidebar for Desktop */}
            <ResizablePanel
              defaultSize={20}
              minSize={10}
              maxSize={30}
              className="overflow-hidden"
            >
              <LeftSidebar />
            </ResizablePanel>

            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

            {/* Main Content */}
            <ResizablePanel defaultSize={60} className="overflow-hidden">
              <div className="h-full w-full overflow-y-auto">
                <Outlet />
              </div>
            </ResizablePanel>

            {/* Right Sidebar (Desktop Only) */}
            <>
              <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
              <ResizablePanel
                defaultSize={20}
                minSize={0}
                maxSize={25}
                collapsedSize={0}
                className="overflow-hidden"
              >
                <FriendsActivity />
              </ResizablePanel>
            </>
          </ResizablePanelGroup>
        ) : (
          // Mobile Layout (Main content only)
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="shrink-0">
        <PlaybackControls />
      </div>

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && (
        <div className="bg-zinc-900 border-t border-zinc-700 w-full py-2">
          <LeftSidebar isMobile />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
