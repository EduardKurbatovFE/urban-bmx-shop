import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File not provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 415 }
      );
    }

    const filePath = `${id}/avatar.jpg`;

    const { data: existingFiles, error: listError } = await supabase.storage
      .from('avatars')
      .list(id);

    if (listError) {
      console.warn('⚠️ Failed to list avatars:', listError.message);
    }

    if (existingFiles && existingFiles.length > 0) {
      const paths = existingFiles.map((file) => `${id}/${file.name}`);

      const { error: removeError } = await supabase.storage
        .from('avatars')
        .remove(paths);

      if (removeError) {
        console.warn('⚠️ Failed to remove old avatar:', removeError.message);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    if (!data?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get avatar URL' },
        { status: 500 }
      );
    }

    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('users')
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ url: avatarUrl }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';

    console.error('❌ Avatar upload error:', message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
