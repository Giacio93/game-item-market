import sharp from 'sharp';

await sharp('public/social-preview.png')
  .resize(1200, 630, {
    fit: 'cover',
    position: 'center',
  })
  .jpeg({
    quality: 82,
    mozjpeg: true,
  })
  .toFile('public/social-preview-v2.jpg');

console.log('Created public/social-preview-v2.jpg');