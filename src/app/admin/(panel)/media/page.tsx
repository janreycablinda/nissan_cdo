import { listMedia } from '@/lib/media';
import MediaLibrary from '@/components/admin/MediaLibrary';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const items = await listMedia();
  return <MediaLibrary items={items} />;
}
