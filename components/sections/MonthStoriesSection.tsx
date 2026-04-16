
import React, { useState, useEffect, useCallback } from 'react';
import AnimatedContent from '@/components/AnimatedContent';
import { Calendar, X } from 'lucide-react';
import { Stories, StoriesContent, Story, StoryAuthor, StoryAuthorImage, StoryAuthorName, StoryOverlay, StoryVideo, StoryImage } from '@/components/kibo-ui/stories';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { motion } from 'motion/react';

export type StoryItem = {
  id: number;
  author: string;
  avatar?: string;
  fallback?: string;
  video?: string;
  image?: string;
};

interface MonthStoriesSectionProps {
  title: string;
  stories: StoryItem[];
  children?: React.ReactNode;
}

const IMAGE_DURATION = 5000;

const MonthStoriesSection: React.FC<MonthStoriesSectionProps> = ({ title, stories, children }) => {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const handleStoryClick = (story: StoryItem) => {
    setSelectedStory(story);
    setIsOpen(true);
  };

  // Sync current state with carousel
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setVideoProgress(0);
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect); // Ensure initial state is set or reset on re-initialization

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Auto-advance logic
  useEffect(() => {
    if (!api || !isOpen) return;

    const currentStory = stories[current];
    let timeoutId: NodeJS.Timeout | undefined;

    if (currentStory?.image) {
      timeoutId = setTimeout(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          // If it's the last story, close the dialog
          setIsOpen(false);
        }
      }, IMAGE_DURATION); 
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [api, current, isOpen, stories]);

  const selectedStoryIndex = stories.findIndex(s => s.id === selectedStory?.id);

  return (
    <>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedContent distance={40} duration={0.8}>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-500" />
                {title}
              </h2>

              <Stories className="w-full mb-8" opts={{ align: 'start', dragFree: true, loop: false, containScroll: 'trimSnaps' }}>
                <StoriesContent className="-ml-3">
                  {stories.map((story) => (
                    <Story 
                      className="aspect-[9/16] w-[180px] md:w-[200px]" 
                      key={story.id}
                      onClick={() => handleStoryClick(story)}
                    >
                      {story.video ? (
                        <StoryVideo src={story.video} />
                      ) : story.image ? (
                        <StoryImage src={story.image} alt={story.author} />
                      ) : null}
                      <StoryOverlay />
                      <StoryAuthor>
                        <StoryAuthorImage fallback={story.fallback} name={story.author} src={story.avatar} />
                        <StoryAuthorName>{story.author}</StoryAuthorName>
                      </StoryAuthor>
                    </Story>
                  ))}
                </StoriesContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Stories>

              {children}
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-full md:max-w-lg w-full h-[100dvh] md:h-[90vh] p-0 gap-0 block bg-black border-none overflow-hidden focus:outline-none">
          <VisuallyHidden.Root>
            <DialogTitle>View stories</DialogTitle>
          </VisuallyHidden.Root>

          {/* Story Progress Indicators */}
          <div className="absolute top-2 left-2 right-2 z-[60] flex gap-1 h-1">
            {stories.map((story, index) => {
                const isActive = index === current;
                const isPast = index < current;
                return (
                <div key={story.id} className="h-full flex-1 bg-white/30 rounded-full overflow-hidden">
                    <motion.div 
                    key={`${story.id}-${isActive}-${isPast}`}
                    className="h-full bg-white"
                    initial={{ width: isPast ? "100%" : "0%" }}
                    animate={{ 
                        width: isPast ? "100%" : isActive ? (story.video ? `${videoProgress}%` : "100%") : "0%"
                    }}
                    transition={{
                        duration: isActive && !story.video ? IMAGE_DURATION / 1000 : 0,
                        ease: "linear"
                    }}
                    />
                </div>
                )
            })}
          </div>
          
          <DialogClose className="absolute right-4 top-8 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
            <X className="h-5 w-5" />
          </DialogClose>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedStory && (
               <Carousel
                setApi={setApi}
                opts={{
                  startIndex: selectedStoryIndex >= 0 ? selectedStoryIndex : 0,
                  align: 'center',
                  loop: false,
                }}
                className="w-full h-full touch-pan-y [&>div]:h-full"
              >
                <CarouselContent className="h-full ml-0">
                  {stories.map((story, index) => (
                    <CarouselItem key={story.id} className="h-full pl-0 basis-full">
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        {story.video ? (
                          <video
                            src={story.video}
                            controls={false} // Custom controls or tap to play/pause could be better, but removing native controls helps with swipe
                            autoPlay={index === current}
                            playsInline
                            className="max-w-full max-h-full w-full h-full object-contain"
                            onTimeUpdate={(e) => {
                                setVideoProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100);
                            }}
                            onClick={(e) => {
                                // Simple tap to play/pause logic or navigate? 
                                // For now, let's keep it simple. If we want Instagram style, we need complex tap zones.
                                // But enabling controls helps user.
                                // If controls are on, swipe might be tricky on the control bar.
                                // Let's leave controls off for "Instagram feel" and autoplay?
                                // User asked for "swipe to the right". 
                                // Native video controls often swallow touch events.
                                e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause();
                            }}
                            onEnded={() => {
                                if (api?.canScrollNext()) {
                                    api.scrollNext();
                                } else {
                                    setIsOpen(false);
                                }
                            }}
                          />
                        ) : story.image ? (
                          <div className="relative w-full h-full select-none">
                            <img
                              src={story.image}
                              alt={story.author}
                              className="object-contain absolute inset-0 w-full h-full"
                              draggable={false}
                            />
                          </div>
                        ) : null}

                        {/* Author info at bottom */}
                        <div className="absolute bottom-8 left-4 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full z-10 pointer-events-none">
                          <StoryAuthorImage 
                            fallback={story.fallback} 
                            name={story.author} 
                            src={story.avatar} 
                          />
                          <span className="text-white font-medium text-sm">{story.author}</span>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 border-none text-white hidden md:flex" />
                <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 border-none text-white hidden md:flex" />
              </Carousel>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthStoriesSection;