import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512]

for (const size of sizes) {
  await sharp('public/Drunk logo simple trans.png')
    .resize(size, size, { fit: 'contain', background: '#f6f6f4' })
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`)
}

console.log('Icons generated.')
