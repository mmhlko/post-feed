import { ProfileCard } from '@/widgets/profile-card/ProfileCard';
import { PostsFeed } from '@/widgets/posts-feed/PostsFeed';

export const FeedPage = () => {
  return (
    <div className="min-h-screen bg-bg-0">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <ProfileCard />
            </div>
          </aside>
          <section className="lg:col-span-2">
            <PostsFeed />
          </section>
        </div>
      </main>
    </div>
  );
};