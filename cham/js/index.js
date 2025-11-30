const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = 2

canvas.width = 1920 * dpr
canvas.height = 1080 * dpr

const oceanLayerData = {
 l_Bg: l_Bg,
}

const brambleLayerData = {
  l_midbg: l_midbg,
}

const layersData = {
   l_water: l_water,
   l_caver_layer: l_caver_layer,
   l_mountain_bg: l_mountain_bg,
   l_mountain_dec: l_mountain_dec,
   l_ground: l_ground,
   l_bridge: l_bridge,
   l_ladder: l_ladder,
   l_decorations: l_decorations,
   l_traps: l_traps,
   l_key: l_key,
   l_chest: l_chest,
   l_collision: l_collision,
   //l_gems: l_gems,
};

const tilesets = {
  l_Bg: { imageUrl: './images/f9b59d71-79f2-4e70-19e8-d500a2a25f00.png', tileSize: 16 },
  l_midbg: { imageUrl: './images/97ab6198-aeca-4099-1033-15e2166f7500.png', tileSize: 16 },
  l_water: { imageUrl: './images/f2773fec-87a9-4ce0-7ac4-38aca248e000.png', tileSize: 16 },
  l_caver_layer: { imageUrl: './images/f2773fec-87a9-4ce0-7ac4-38aca248e000.png', tileSize: 16 },
  l_mountain_bg: { imageUrl: './images/0df374cd-d595-427a-58b5-ee9f0c692c00.png', tileSize: 16 },
  l_mountain_dec: { imageUrl: './images/0df374cd-d595-427a-58b5-ee9f0c692c00.png', tileSize: 16 },
  l_ground: { imageUrl: './images/f2773fec-87a9-4ce0-7ac4-38aca248e000.png', tileSize: 16 },
  l_bridge: { imageUrl: './images/f2773fec-87a9-4ce0-7ac4-38aca248e000.png', tileSize: 16 },
  l_ladder: { imageUrl: './images/f2773fec-87a9-4ce0-7ac4-38aca248e000.png', tileSize: 16 },
  l_decorations: { imageUrl: './images/f2773fec-87a9-4ce0-7ac4-38aca248e000.png', tileSize: 16 },
  l_traps: { imageUrl: './images/0df374cd-d595-427a-58b5-ee9f0c692c00.png', tileSize: 16 },
  l_key: { imageUrl: './images/bd3543cc-cfdd-42c5-2f80-23d916801900.png', tileSize: 16 },
  l_chest: { imageUrl: './images/bd3543cc-cfdd-42c5-2f80-23d916801900.png', tileSize: 16 },
  l_collision: { imageUrl: './images/bd3543cc-cfdd-42c5-2f80-23d916801900.png', tileSize: 16 },
  l_gems: { imageUrl: './images/gem.png', tileSize: 16 },
};



// Tile setup
const collisionBlocks = []
const platforms = []
const blockSize = 16 // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        }),
      )
    } else if (symbol === 2) {
      platforms.push(
        new Platform({
          x: x * blockSize,
          y: y * blockSize + blockSize,
          width: 16,
          height: 4,
        }),
      )
    }
  })
})

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  // Calculate the number of tiles per row in the tileset
  // We use Math.ceil to ensure we get a whole number of tiles
  const tilesPerRow = Math.ceil(tilesetImage.width / tileSize)

  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        // Adjust index to be 0-based for calculations
        const tileIndex = symbol - 1

        // Calculate source coordinates
        const srcX = (tileIndex % tilesPerRow) * tileSize
        const srcY = Math.floor(tileIndex / tilesPerRow) * tileSize

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16, // destination width, height
        )
      }
    })
  })
}
const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = canvas.width
  offscreenCanvas.height = canvas.height
  const offscreenContext = offscreenCanvas.getContext('2d')

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext,
        )
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));
  // platforms.forEach((platform) => platform.draw(offscreenContext))

  return offscreenCanvas
}
// END - Tile setup

// Change xy coordinates to move player's default position
let player = new Player({
  x: 100,
  y: 100,
  size: 32,
  velocity: { x: 0, y: 0 },
})

let oposums = [ 
 ]

let sprites = []
let hearts = [
  new Heart({
     x: 10,
     y: 10,
      width: 21,
      height: 18,
      imageSrc: './images/hearts.png',
      spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
    new Heart({
     x: 33,
    y: 10,
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
    new Heart({
     x: 56,
    y: 10,
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  })
]

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

let lastTime = performance.now()
let camera = {
  x : 0,
  y : 0,
}
const SCROLL_POST_RIGHT = 330
const SCROLL_POST_TOP = 100
const SCROLL_POST_BOTTOM = 220
let oceanBackgroundCanvas = null
let brambleBackgroundCanvas = null
let gems = []
let gemUI = new Sprite( {
    x: 13,
    y: 36,
    width: 15, 
    height: 13, 
    imageSrc: './images/gem.png',
    spriteCropbox: {
              x: 0,
              y: 0,
              width: 15,
              height: 13,
              frames: 5,
            },
            
      } )

let gemCount = 0
function init(){

 gems = []
gemCount = 0

l_gems.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      gems.push( new Sprite( {
    x: x * 16,
    y: y * 16,
    width: 15, 
    height: 13, 
    imageSrc: './images/gem.png',
    spriteCropbox: {
              x: 0,
              y: 0,
              width: 15,
              height: 13,
              frames: 5,
            },
            hitbox: {
              x: x * 16,
              y: y * 16,
              width: 15, 
              height: 13, 
            },
      }),
    )
  }
})
})






  player = new Player({
  x: 100,
  y: 100,
  size: 32,
  velocity: { x: 0, y: 0 },
})

 oposums = [ 
  new Oposum({
   x: 649,
  y: 210,
  width: 36,
  height: 28
}),
  new Oposum({
  x: 1178,
  y: 340,
  width: 36,
  height: 28
}),
  new Oposum({
    x: 1635,
    y: 550,
    width: 36,
    height: 28
}),
  new Oposum({
    x: 2088,
    y: 260,
    width: 36,
    height: 28
}),
  new Oposum({
    x: 2670,
    y: 260,
    width: 36,
    height: 28
}),]

 sprites = []
 hearts = [
  new Heart({
     x: 10,
     y: 10,
      width: 21,
      height: 18,
      imageSrc: './images/hearts.png',
      spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
    new Heart({
     x: 33,
    y: 10,
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
    new Heart({
     x: 56,
    y: 10,
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  })
]
 camera = {
  x : 0,
  y : 0,
}
}
function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime
  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  for (let i = oposums.length - 1; i >= 0; i--){
  const oposum = oposums[i]
  oposum.update(deltaTime, collisionBlocks)

  const collisionDirection = checkCollision(player, oposum)
    if (collisionDirection){
      if (collisionDirection === 'bottom' && !player.isOnGround) {
      console.log(collisionDirection)
    player.velocity.y = -200
    sprites.push(
       new Sprite( {
    x: oposum.x,
    y: oposum.y,
    width: 32, 
    height: 32, 
    imageSrc: './images/enemy-death.png',
    spriteCropbox: {
              x: 0,
              y: 0,
              width: 40,
              height: 41,
              frames: 6,
            },
          }),
        )

        oposums.splice(i, 1)

     } else if (collisionDirection === 'left' || collisionDirection === 'right') {
      const fullHearts = hearts.filter((heart) => {
          return !heart.depleted
        })

        if (!player.isInvincible && fullHearts.length > 0) {
          fullHearts[fullHearts.length - 1].depleted = true
        } else if (fullHearts.length === 0) {
          init()
        }
        player.setIsInvincible()
     }
     
    }
  }


   for (let i = sprites.length - 1; i >= 0; i--){
    const sprite = sprites[i]
    sprite.update(deltaTime)

    if(sprite.iteration === 1 ){
      sprites.splice(i, 1)
    }
   }

   
   for (let i = gems.length - 1; i >= 0; i--){
    const gem = gems[i]
    gem.update(deltaTime)



      const collisionDirection = checkCollision(player, gem)
      if(collisionDirection) {
        sprites.push(
       new Sprite( {
    x: gem.x- 8,
    y: gem.y- 8,
    width: 32, 
    height: 32, 
    imageSrc: './images/item-feedback.png',
    spriteCropbox: {
              x: 0,
              y: 0,
              width: 32,
              height: 32,
              frames: 5,
            },
          }),
        )
        gems.splice(i, 1)
        gemCount++

        if (gems.length === 0) {
        console.log('YOU WIN!')
      }
   }
   }

  // Track scroll post distance
  if(player.x > SCROLL_POST_RIGHT && player.x < 2160){
  const scrollPostDistance = player.x - SCROLL_POST_RIGHT
  camera.x = scrollPostDistance
}
if(player.y < SCROLL_POST_TOP && camera.y > 0 ){
  const scrollPostDistance = SCROLL_POST_TOP - player.y
  camera.y = scrollPostDistance
}
if(player.y > SCROLL_POST_BOTTOM ){
  const scrollPostDistance = player.y - SCROLL_POST_BOTTOM
  camera.y = -scrollPostDistance
}

  // Render scene
 c.save()
  c.scale(dpr + 1, dpr + 1)
  c.translate(-camera.x, camera.y)
  c.clearRect(0, 0, canvas.width, canvas.height)
  c.drawImage(oceanBackgroundCanvas, camera.x * 0.32, 0)
  c.drawImage(brambleBackgroundCanvas, camera.x * 0.16, 0)
  c.drawImage(backgroundCanvas, 0, 0)
  player.draw(c)

  for (let i = oposums.length - 1; i >= 0; i--){
    const oposum = oposums[i]
    oposum.draw(c) }

  for (let i = sprites.length - 1; i >= 0; i--){
    const sprite = sprites[i]
    sprite.draw(c)
   }

     for (let i = gems.length - 1; i >= 0; i--){
    const gem = gems[i]
    gem.draw(c)
   }

 
  
  c.restore()

  c.save()
  c.scale(dpr + 1, dpr + 1)
   for (let i = hearts.length - 1; i >= 0; i--){
    const heart = hearts[i]
    heart.draw(c)
   }
    gemUI.draw(c)
    c.fillText(gemCount, 33, 46)
  c.restore()

  requestAnimationFrame(() => animate(backgroundCanvas))
}

const startRendering = async () => {
  try {
    oceanBackgroundCanvas = await renderStaticLayers(oceanLayerData)
    brambleBackgroundCanvas = await renderStaticLayers(brambleLayerData)
    const backgroundCanvas = await renderStaticLayers(layersData)
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas')
      return
    }

    animate(backgroundCanvas)
  } catch (error) {
    console.error('Error during rendering:', error)
  }
}

init()
startRendering()

