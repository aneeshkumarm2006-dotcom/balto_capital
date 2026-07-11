import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { ghCommitFiles, githubMode } from '@/lib/admin/github';
import { readContent, writeContent } from '@/lib/admin/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_EDGE = 1800; // same web size the sync-images pipeline ships
const JPEG_QUALITY = 82;

interface PhotoSet {
  hero?: string | null;
  gallery: string[];
  hidden?: string[];
}

interface MediaItem {
  path: string;
  name: string;
  uploadedAt: string;
}

/** Upload one or more photos.
 *  - dest omitted / 'building' (+ slug): resized into
 *    public/assets/<slug>/uploads/ and appended to the building's gallery in
 *    content/photos.json.
 *  - dest 'library': resized into public/assets/library/ and registered in
 *    content/media.json for reuse across properties (and city cards). */
export async function POST(req: Request) {
  const form = await req.formData();
  const dest = String(form.get('dest') ?? 'building');
  const slug = String(form.get('slug') ?? '');
  const files = form.getAll('files').filter((f): f is File => f instanceof File);

  if (dest === 'building') {
    const buildings = await readContent<Array<{ slug: string }>>('buildings');
    if (!buildings.some((b) => b.slug === slug)) {
      return NextResponse.json({ error: 'Unknown building.' }, { status: 400 });
    }
  } else if (dest !== 'library') {
    return NextResponse.json({ error: 'Unknown upload destination.' }, { status: 400 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: 'No files received.' }, { status: 400 });
  }

  const relDir = dest === 'library' ? ['library'] : [slug, 'uploads'];

  // Resize everything to web size in memory first.
  const added: string[] = [];
  const names: string[] = [];
  const buffers: Buffer[] = [];
  const stamp = Date.now();
  for (let i = 0; i < files.length; i++) {
    const input = Buffer.from(await files[i].arrayBuffer());
    const filename = `${stamp}-${String(i + 1).padStart(2, '0')}.jpg`;
    try {
      buffers.push(
        await sharp(input)
          .rotate() // honour EXIF orientation
          .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .toBuffer()
      );
    } catch {
      return NextResponse.json(
        { error: `"${files[i].name}" is not a readable image.` },
        { status: 400 }
      );
    }
    added.push(['/assets', ...relDir, filename].join('/'));
    names.push(files[i].name);
  }

  // Updated content JSON that references the new images.
  let contentName: 'media' | 'photos';
  let contentData: unknown;
  if (dest === 'library') {
    const media = await readContent<MediaItem[]>('media');
    const now = new Date().toISOString();
    added.forEach((p, i) =>
      media.push({ path: p, name: names[i], uploadedAt: now })
    );
    contentName = 'media';
    contentData = media;
  } else {
    const photos = await readContent<Record<string, PhotoSet>>('photos');
    const set: PhotoSet = photos[slug] ?? { hero: null, gallery: [], hidden: [] };
    set.gallery = [...set.gallery, ...added];
    if (!set.hero) set.hero = added[0];
    photos[slug] = set;
    contentName = 'photos';
    contentData = photos;
  }
  const contentJson = JSON.stringify(contentData, null, 2) + '\n';

  if (githubMode()) {
    // One atomic commit: the images plus the JSON that references them.
    await ghCommitFiles(
      [
        ...added.map((webPath, i) => ({
          path: `public${webPath}`,
          content: buffers[i],
        })),
        { path: `content/${contentName}.json`, content: contentJson },
      ],
      `cms: upload ${added.length} photo(s) to ${dest === 'library' ? 'library' : slug}`
    );
  } else {
    const dir = path.join(process.cwd(), 'public', 'assets', ...relDir);
    await fs.mkdir(dir, { recursive: true });
    await Promise.all(
      buffers.map((buf, i) =>
        fs.writeFile(path.join(dir, path.basename(added[i])), buf)
      )
    );
    await writeContent(contentName, contentData);
  }

  return NextResponse.json({ ok: true, added });
}
