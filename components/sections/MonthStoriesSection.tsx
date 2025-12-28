'use client';

import React, { useState } from 'react';
import AnimatedContent from '@/components/AnimatedContent';
import { Calendar, X } from 'lucide-react';
import { Stories, StoriesContent, Story, StoryAuthor, StoryAuthorImage, StoryAuthorName, StoryOverlay, StoryVideo, StoryImage } from '@/components/kibo-ui/stories';
import { CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

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

const MonthStoriesSection: React.FC<MonthStoriesSectionProps> = ({ title, stories, children }) => {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStoryClick = (story: StoryItem) => {
    setSelectedStory(story);
    setIsOpen(true);
  };

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
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <VisuallyHidden.Root>
            <DialogTitle>View {selectedStory?.author}&apos;s story</DialogTitle>
          </VisuallyHidden.Root>
          
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
            <X className="h-5 w-5" />
          </DialogClose>
          
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {selectedStory?.video ? (
              <video
                src={selectedStory.video}
                controls
                autoPlay
                loop
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : selectedStory?.image ? (
              <div className="relative w-full h-full">
                <Image
                  src={selectedStory.image}
                  alt={selectedStory.author}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            ) : null}
            
            {/* Author info at bottom */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
              <StoryAuthorImage 
                fallback={selectedStory?.fallback} 
                name={selectedStory?.author} 
                src={selectedStory?.avatar} 
              />
              <span className="text-white font-medium text-sm">{selectedStory?.author}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthStoriesSection;
