import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File not provided' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    if (!fileExt) {
      return NextResponse.json(
        { error: 'Invalid file extension' },
        { status: 400 }
      );
    }

    const filePath = `${id}/avatar.${fileExt}`;

    const { error: removeError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (removeError) {
      console.warn('⚠️ Avatar remove warning:', removeError.message);
    }

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload avatar', details: uploadError.message },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: 'Failed to update user', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: avatarUrl }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';

    console.error('❌ Avatar upload error:', message);

    return NextResponse.json(
      { error: 'Unexpected error', details: message },
      { status: 500 }
    );
  }
}
