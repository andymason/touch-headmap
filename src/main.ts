function getViewportDimensions(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function updateSurroundingArea(
  x: number,
  y: number,
  radius: number,
  data: Uint8ClampedArray
): void {
  for (let row = 0; row < radius; row++) {
    // Skip any rows that go beyond the grid boundary
    if (row + y > height) continue;

    for (let col = 0; col < radius; col++) {
      // Skip any rows that go beyond the grid boundary
      if (col + x > width) continue;

      const xIntensity = 0.5 - Math.abs(col / radius - 0.5);
      const yIntensity = 0.5 - Math.abs(row / radius - 0.5);
      const intensity = xIntensity + yIntensity;

      const rgbIndex = (y + col) * width * 4 + (x + row) * 4;
      // data[rgbIndex] = 255 * intensity;
      // data[rgbIndex + 1] = 255 * intensity;
      // data[rgbIndex + 2] = 255 * intensity;
      data[rgbIndex + 3] = 255 * intensity;
    }
  }
}

function handlePointerMovement(
  event: MouseEvent,
  ctx: CanvasRenderingContext2D,
  grid: number[],
  imageData: ImageData
): void {
  const { x, y } = event;
  const row = Math.floor(y);
  const col = Math.floor(x);

  // Update grid array
  const gridIndex = row * width + col;
  grid[gridIndex] = grid[gridIndex] + 1;

  // const rgbIndex = row * width * 4 + col * 4;
  // imageData.data[rgbIndex] = grid[gridIndex];
  // imageData.data[rgbIndex + 1] = grid[gridIndex];
  // imageData.data[rgbIndex + 2] = grid[gridIndex];
  // imageData.data[rgbIndex + 3] = 255;

  updateSurroundingArea(x, y, 30, imageData.data);

  ctx.putImageData(imageData, 0, 0);
}

const { width, height } = getViewportDimensions();

function main(): void {
  const grid: number[] = Array(width * height);
  grid.fill(0);

  const canvasEl = document.createElement("canvas");
  canvasEl.setAttribute("width", width.toString());
  canvasEl.setAttribute("height", height.toString());
  canvasEl.setAttribute("id", "surface");
  document.body.appendChild(canvasEl);

  const ctx = canvasEl.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get 3D canvas context");
  }

  const imageData: ImageData = ctx.createImageData(width, height);

  window.addEventListener("mousemove", (ev) =>
    handlePointerMovement(ev, ctx, grid, imageData)
  );

  // Add pointer listener for movement
  // Record pointer coordinates on movement

  // Create an array for each pixel on screen
  // Set each pixel to 0
  // Increase pixel value by one based on pointer coordinates
}

main();
